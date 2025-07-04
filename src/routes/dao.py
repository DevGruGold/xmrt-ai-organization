from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from src.models.dao import db, Proposal, Vote, AIAgent, TreasuryTransaction, ChatMessage, ProposalStatus, AgentType
from src.services.eliza_agent import get_agent_by_name, governance_agent, treasury_agent, security_agent
import uuid
import time

dao_bp = Blueprint('dao', __name__)

# CORS headers for all responses
@dao_bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@dao_bp.route('/proposals', methods=['GET'])
def get_proposals():
    """Get all proposals"""
    proposals = Proposal.query.order_by(Proposal.created_at.desc()).all()
    return jsonify([proposal.to_dict() for proposal in proposals])

@dao_bp.route('/proposals', methods=['POST'])
def create_proposal():
    """Create a new proposal"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Title and description are required'}), 400
    
    # Set voting period to 7 days from now
    voting_ends_at = datetime.utcnow() + timedelta(days=7)
    
    proposal = Proposal(
        title=data['title'],
        description=data['description'],
        voting_ends_at=voting_ends_at,
        creator_address=data.get('creator_address', '0x0000000000000000000000000000000000000000'),
        status=ProposalStatus.ACTIVE
    )
    
    db.session.add(proposal)
    db.session.commit()
    
    # Get AI recommendation from governance agent
    try:
        session_id = str(uuid.uuid4())
        analysis_message = f"Analyze proposal: {data['title']} - {data['description']}"
        ai_response = governance_agent.generate_response(analysis_message, session_id)
        
        # Extract recommendation from response
        if "recommend supporting" in ai_response.lower() or "support" in ai_response.lower():
            proposal.ai_recommendation = "Support"
        elif "oppose" in ai_response.lower() or "against" in ai_response.lower():
            proposal.ai_recommendation = "Oppose"
        else:
            proposal.ai_recommendation = "Analyzing"
        
        db.session.commit()
    except Exception as e:
        print(f"Error getting AI recommendation: {e}")
    
    return jsonify(proposal.to_dict()), 201

@dao_bp.route('/proposals/<int:proposal_id>/vote', methods=['POST'])
def vote_on_proposal(proposal_id):
    """Vote on a proposal"""
    data = request.get_json()
    
    if not data or 'vote_choice' not in data or not data.get('voter_address'):
        return jsonify({'error': 'Vote choice and voter address are required'}), 400
    
    proposal = Proposal.query.get_or_404(proposal_id)
    
    if proposal.status != ProposalStatus.ACTIVE:
        return jsonify({'error': 'Proposal is not active for voting'}), 400
    
    # Check if user already voted
    existing_vote = Vote.query.filter_by(
        proposal_id=proposal_id,
        voter_address=data['voter_address']
    ).first()
    
    if existing_vote:
        return jsonify({'error': 'Address has already voted on this proposal'}), 400
    
    # Create new vote
    vote = Vote(
        proposal_id=proposal_id,
        voter_address=data['voter_address'],
        vote_choice=data['vote_choice'],
        vote_weight=data.get('vote_weight', 1)
    )
    
    db.session.add(vote)
    
    # Update proposal vote counts
    if data['vote_choice']:
        proposal.votes_for += vote.vote_weight
    else:
        proposal.votes_against += vote.vote_weight
    
    proposal.total_votes += vote.vote_weight
    
    db.session.commit()
    
    return jsonify({'message': 'Vote recorded successfully', 'proposal': proposal.to_dict()})

@dao_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all AI agents with enhanced status"""
    agents_data = []
    
    # Get enhanced status from Eliza agents
    for agent in [governance_agent, treasury_agent, security_agent]:
        status = agent.get_agent_status()
        agents_data.append(status)
    
    return jsonify(agents_data)

@dao_bp.route('/agents/<agent_name>/chat', methods=['POST'])
def chat_with_agent(agent_name):
    """Send a message to an AI agent using enhanced Eliza service"""
    data = request.get_json()
    
    if not data or not data.get('message'):
        return jsonify({'error': 'Message is required'}), 400
    
    # Get the enhanced Eliza agent
    agent = get_agent_by_name(agent_name)
    if not agent:
        return jsonify({'error': 'Agent not found'}), 404
    
    session_id = data.get('session_id', str(uuid.uuid4()))
    user_message = data['message']
    
    try:
        # Generate enhanced AI response
        ai_response = agent.generate_response(user_message, session_id)
        
        # Save conversation to database
        user_chat = ChatMessage(
            session_id=session_id,
            agent_name=agent_name,
            message_type='user',
            content=user_message
        )
        db.session.add(user_chat)
        
        ai_chat = ChatMessage(
            session_id=session_id,
            agent_name=agent_name,
            message_type='agent',
            content=ai_response
        )
        db.session.add(ai_chat)
        
        # Update database agent record if exists
        db_agent = AIAgent.query.filter_by(name=agent_name).first()
        if db_agent:
            db_agent.last_active = datetime.utcnow()
            db_agent.last_action = f"Responded to: {user_message[:50]}..."
        
        db.session.commit()
        
        # Get agent status
        agent_status = agent.get_agent_status()
        
        return jsonify({
            'session_id': session_id,
            'response': ai_response,
            'agent': agent_status,
            'context': agent.get_or_create_memory(session_id).context
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing message: {str(e)}'}), 500

@dao_bp.route('/agents/<agent_name>/memory/<session_id>', methods=['GET'])
def get_agent_memory(agent_name, session_id):
    """Get agent memory for a session"""
    agent = get_agent_by_name(agent_name)
    if not agent:
        return jsonify({'error': 'Agent not found'}), 404
    
    memory = agent.get_or_create_memory(session_id)
    
    return jsonify({
        'session_id': memory.session_id,
        'context': memory.context,
        'conversation_history': memory.conversation_history[-10:],  # Last 10 messages
        'user_preferences': memory.user_preferences,
        'created_at': memory.created_at.isoformat(),
        'last_updated': memory.last_updated.isoformat()
    })

@dao_bp.route('/agents/<agent_name>/decisions', methods=['GET'])
def get_agent_decisions(agent_name):
    """Get recent agent decisions"""
    agent = get_agent_by_name(agent_name)
    if not agent:
        return jsonify({'error': 'Agent not found'}), 404
    
    # Get last 10 decisions
    recent_decisions = agent.decision_history[-10:]
    
    decisions_data = []
    for decision in recent_decisions:
        decisions_data.append({
            'decision_type': decision.decision_type,
            'confidence': decision.confidence,
            'reasoning': decision.reasoning,
            'recommended_action': decision.recommended_action,
            'data_sources': decision.data_sources,
            'timestamp': decision.timestamp.isoformat()
        })
    
    return jsonify(decisions_data)

@dao_bp.route('/treasury/stats', methods=['GET'])
def get_treasury_stats():
    """Get treasury statistics with AI analysis"""
    # Get analysis from treasury agent
    try:
        session_id = str(uuid.uuid4())
        analysis = treasury_agent.generate_response("Provide current treasury status and metrics", session_id)
    except:
        analysis = "Treasury analysis temporarily unavailable"
    
    stats = {
        'total_value_locked': '$2.4M',
        'active_members': 1247,
        'active_proposals': 3,
        'ai_agents': 3,
        'ai_analysis': analysis,
        'token_stats': {
            'total_supply': '1,000,000 XMRT',
            'circulating_supply': '750,000 XMRT',
            'market_cap': '$2.4M',
            'holders': 1247,
            'treasury_balance': '150,000 XMRT',
            'staked_tokens': '450,000 XMRT'
        }
    }
    return jsonify(stats)

@dao_bp.route('/treasury/transactions', methods=['GET'])
def get_treasury_transactions():
    """Get recent treasury transactions"""
    transactions = TreasuryTransaction.query.order_by(TreasuryTransaction.created_at.desc()).limit(10).all()
    return jsonify([tx.to_dict() for tx in transactions])

@dao_bp.route('/security/status', methods=['GET'])
def get_security_status():
    """Get security status with AI analysis"""
    try:
        session_id = str(uuid.uuid4())
        security_analysis = security_agent.generate_response("Provide current security status and threat assessment", session_id)
    except:
        security_analysis = "Security analysis temporarily unavailable"
    
    return jsonify({
        'threat_level': 'LOW',
        'last_audit': '2025-07-04',
        'vulnerabilities': 0,
        'monitoring_status': 'ACTIVE',
        'ai_analysis': security_analysis,
        'security_score': 98
    })

# Initialize sample data
@dao_bp.route('/init-sample-data', methods=['POST'])
def init_sample_data():
    """Initialize sample data for testing"""
    
    # Create AI Agents if they don't exist
    agents_data = [
        {
            'name': 'Eliza-Governance',
            'agent_type': AgentType.GOVERNANCE,
            'last_action': 'Analyzed proposal #42',
            'performance_score': 97
        },
        {
            'name': 'Eliza-Treasury',
            'agent_type': AgentType.TREASURY,
            'last_action': 'Optimized portfolio allocation',
            'performance_score': 94
        },
        {
            'name': 'Eliza-Security',
            'agent_type': AgentType.SECURITY,
            'last_action': 'Completed security audit',
            'performance_score': 91
        }
    ]
    
    for agent_data in agents_data:
        existing_agent = AIAgent.query.filter_by(name=agent_data['name']).first()
        if not existing_agent:
            agent = AIAgent(**agent_data)
            db.session.add(agent)
    
    # Create sample proposals if they don't exist
    if Proposal.query.count() == 0:
        proposals_data = [
            {
                'title': 'Increase Treasury Allocation for AI Development',
                'description': 'Proposal to allocate 15% more funds to AI agent development and training',
                'status': ProposalStatus.ACTIVE,
                'votes_for': 1250,
                'votes_against': 340,
                'total_votes': 1590,
                'voting_ends_at': datetime.utcnow() + timedelta(days=2),
                'ai_recommendation': 'Support',
                'creator_address': '0x1234567890123456789012345678901234567890'
            },
            {
                'title': 'Deploy New Eliza Agent for Market Analysis',
                'description': 'Create specialized AI agent for real-time market analysis and trading recommendations',
                'status': ProposalStatus.PENDING,
                'votes_for': 890,
                'votes_against': 120,
                'total_votes': 1010,
                'voting_ends_at': datetime.utcnow() + timedelta(days=5),
                'ai_recommendation': 'Support',
                'creator_address': '0x2345678901234567890123456789012345678901'
            },
            {
                'title': 'Upgrade Zero-Knowledge Proof Infrastructure',
                'description': 'Implement advanced ZK-STARK technology for enhanced privacy and verification',
                'status': ProposalStatus.EXECUTED,
                'votes_for': 2100,
                'votes_against': 450,
                'total_votes': 2550,
                'voting_ends_at': datetime.utcnow() - timedelta(days=1),
                'ai_recommendation': 'Executed',
                'creator_address': '0x3456789012345678901234567890123456789012'
            }
        ]
        
        for proposal_data in proposals_data:
            proposal = Proposal(**proposal_data)
            db.session.add(proposal)
    
    # Create sample treasury transactions
    if TreasuryTransaction.query.count() == 0:
        transactions_data = [
            {
                'transaction_hash': '0x1a2b3c4d5e6f7890123456789012345678901234567890123456789012345678',
                'transaction_type': 'governance',
                'description': 'Proposal #42 execution reward',
                'amount': '+500 XMRT',
                'to_address': '0x1234567890123456789012345678901234567890',
                'created_at': datetime.utcnow() - timedelta(minutes=2)
            },
            {
                'transaction_hash': '0x4d5e6f7890123456789012345678901234567890123456789012345678901234',
                'transaction_type': 'treasury',
                'description': 'Treasury rebalancing',
                'amount': '-2,500 XMRT',
                'from_address': '0x2345678901234567890123456789012345678901',
                'created_at': datetime.utcnow() - timedelta(minutes=15)
            },
            {
                'transaction_hash': '0x7g8h9i0123456789012345678901234567890123456789012345678901234567',
                'transaction_type': 'staking',
                'description': 'Staking rewards distribution',
                'amount': '+1,250 XMRT',
                'to_address': '0x3456789012345678901234567890123456789012',
                'created_at': datetime.utcnow() - timedelta(hours=1)
            }
        ]
        
        for tx_data in transactions_data:
            transaction = TreasuryTransaction(**tx_data)
            db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify({'message': 'Sample data initialized successfully with enhanced AI agents'})

