from src.models.user import db
from datetime import datetime
from enum import Enum

class ProposalStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    EXECUTED = "executed"
    REJECTED = "rejected"

class AgentType(Enum):
    GOVERNANCE = "governance"
    TREASURY = "treasury"
    SECURITY = "security"

class Proposal(db.Model):
    __tablename__ = 'proposals'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(ProposalStatus), default=ProposalStatus.PENDING)
    votes_for = db.Column(db.Integer, default=0)
    votes_against = db.Column(db.Integer, default=0)
    total_votes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    voting_ends_at = db.Column(db.DateTime, nullable=False)
    ai_recommendation = db.Column(db.String(50), default="Analyzing")
    creator_address = db.Column(db.String(42), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status.value,
            'votes_for': self.votes_for,
            'votes_against': self.votes_against,
            'total_votes': self.total_votes,
            'created_at': self.created_at.isoformat(),
            'voting_ends_at': self.voting_ends_at.isoformat(),
            'ai_recommendation': self.ai_recommendation,
            'creator_address': self.creator_address
        }

class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    proposal_id = db.Column(db.Integer, db.ForeignKey('proposals.id'), nullable=False)
    voter_address = db.Column(db.String(42), nullable=False)
    vote_choice = db.Column(db.Boolean, nullable=False)  # True for yes, False for no
    vote_weight = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one vote per address per proposal
    __table_args__ = (db.UniqueConstraint('proposal_id', 'voter_address'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'proposal_id': self.proposal_id,
            'voter_address': self.voter_address,
            'vote_choice': self.vote_choice,
            'vote_weight': self.vote_weight,
            'created_at': self.created_at.isoformat()
        }

class AIAgent(db.Model):
    __tablename__ = 'ai_agents'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    agent_type = db.Column(db.Enum(AgentType), nullable=False)
    status = db.Column(db.String(20), default="active")
    last_action = db.Column(db.String(200))
    performance_score = db.Column(db.Integer, default=90)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.agent_type.value,
            'status': self.status,
            'last_action': self.last_action,
            'performance': self.performance_score,
            'created_at': self.created_at.isoformat(),
            'last_active': self.last_active.isoformat()
        }

class TreasuryTransaction(db.Model):
    __tablename__ = 'treasury_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_hash = db.Column(db.String(66), nullable=False, unique=True)
    transaction_type = db.Column(db.String(50), nullable=False)  # governance, treasury, staking
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.String(50), nullable=False)  # Store as string to handle large numbers
    from_address = db.Column(db.String(42))
    to_address = db.Column(db.String(42))
    block_number = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'hash': self.transaction_hash,
            'type': self.transaction_type,
            'description': self.description,
            'amount': self.amount,
            'from_address': self.from_address,
            'to_address': self.to_address,
            'block_number': self.block_number,
            'created_at': self.created_at.isoformat()
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    agent_name = db.Column(db.String(100), nullable=False)
    message_type = db.Column(db.String(20), nullable=False)  # user or agent
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'agent_name': self.agent_name,
            'type': self.message_type,
            'content': self.content,
            'timestamp': self.created_at.isoformat()
        }

