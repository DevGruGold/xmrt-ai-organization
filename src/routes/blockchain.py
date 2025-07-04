from flask import Blueprint, request, jsonify
from src.services.blockchain import get_blockchain_service, get_zk_proof_service
from src.models.dao import db, TreasuryTransaction
from datetime import datetime

blockchain_bp = Blueprint('blockchain', __name__)

# CORS headers for all responses
@blockchain_bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@blockchain_bp.route('/token/info', methods=['GET'])
def get_token_info():
    """Get XMRT token information"""
    blockchain_service = get_blockchain_service()
    token_info = blockchain_service.get_token_info()
    return jsonify(token_info)

@blockchain_bp.route('/token/balance/<address>', methods=['GET'])
def get_token_balance(address):
    """Get XMRT token balance for an address"""
    blockchain_service = get_blockchain_service()
    balance_info = blockchain_service.get_balance(address)
    return jsonify(balance_info)

@blockchain_bp.route('/staking/info/<address>', methods=['GET'])
def get_staking_info(address):
    """Get staking information for an address"""
    blockchain_service = get_blockchain_service()
    staking_info = blockchain_service.get_staking_info(address)
    return jsonify(staking_info)

@blockchain_bp.route('/staking/stake', methods=['POST'])
def stake_tokens():
    """Stake XMRT tokens"""
    data = request.get_json()
    
    if not data or not data.get('address') or not data.get('amount'):
        return jsonify({'error': 'Address and amount are required'}), 400
    
    blockchain_service = get_blockchain_service()
    
    try:
        result = blockchain_service.stake_tokens(
            address=data['address'],
            amount=data['amount'],
            private_key=data.get('private_key')
        )
        
        if result.success:
            # Record transaction in database
            transaction = TreasuryTransaction(
                transaction_hash=result.transaction_hash,
                transaction_type='staking',
                description=f"Staked {data['amount']} XMRT",
                amount=f"+{data['amount']} XMRT",
                to_address=data['address'],
                block_number=result.block_number
            )
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'transaction_hash': result.transaction_hash,
                'block_number': result.block_number,
                'gas_used': result.gas_used,
                'explorer_url': f"https://sepolia.etherscan.io/tx/{result.transaction_hash}"
            })
        else:
            return jsonify({
                'success': False,
                'error': result.error_message
            }), 400
            
    except Exception as e:
        return jsonify({'error': f'Staking failed: {str(e)}'}), 500

@blockchain_bp.route('/governance/vote', methods=['POST'])
def vote_on_proposal():
    """Vote on a governance proposal"""
    data = request.get_json()
    
    required_fields = ['address', 'proposal_id', 'support']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Address, proposal_id, and support are required'}), 400
    
    blockchain_service = get_blockchain_service()
    
    try:
        result = blockchain_service.vote_on_proposal(
            address=data['address'],
            proposal_id=data['proposal_id'],
            support=data['support'],
            private_key=data.get('private_key')
        )
        
        if result.success:
            # Record transaction in database
            transaction = TreasuryTransaction(
                transaction_hash=result.transaction_hash,
                transaction_type='governance',
                description=f"Voted {'for' if data['support'] else 'against'} proposal #{data['proposal_id']}",
                amount="0 XMRT",
                from_address=data['address'],
                block_number=result.block_number
            )
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'transaction_hash': result.transaction_hash,
                'block_number': result.block_number,
                'gas_used': result.gas_used,
                'explorer_url': f"https://sepolia.etherscan.io/tx/{result.transaction_hash}"
            })
        else:
            return jsonify({
                'success': False,
                'error': result.error_message
            }), 400
            
    except Exception as e:
        return jsonify({'error': f'Voting failed: {str(e)}'}), 500

@blockchain_bp.route('/governance/create-proposal', methods=['POST'])
def create_proposal():
    """Create a new governance proposal"""
    data = request.get_json()
    
    if not data or not data.get('address') or not data.get('description'):
        return jsonify({'error': 'Address and description are required'}), 400
    
    blockchain_service = get_blockchain_service()
    
    try:
        result = blockchain_service.create_proposal(
            address=data['address'],
            description=data['description'],
            voting_period=data.get('voting_period', 604800),  # 7 days default
            private_key=data.get('private_key')
        )
        
        if result.success:
            # Record transaction in database
            transaction = TreasuryTransaction(
                transaction_hash=result.transaction_hash,
                transaction_type='governance',
                description=f"Created proposal: {data['description'][:50]}...",
                amount="0 XMRT",
                from_address=data['address'],
                block_number=result.block_number
            )
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'transaction_hash': result.transaction_hash,
                'block_number': result.block_number,
                'gas_used': result.gas_used,
                'explorer_url': f"https://sepolia.etherscan.io/tx/{result.transaction_hash}"
            })
        else:
            return jsonify({
                'success': False,
                'error': result.error_message
            }), 400
            
    except Exception as e:
        return jsonify({'error': f'Proposal creation failed: {str(e)}'}), 500

@blockchain_bp.route('/transaction/<tx_hash>', methods=['GET'])
def get_transaction_status(tx_hash):
    """Get transaction status and details"""
    blockchain_service = get_blockchain_service()
    tx_status = blockchain_service.get_transaction_status(tx_hash)
    return jsonify(tx_status)

@blockchain_bp.route('/network/stats', methods=['GET'])
def get_network_stats():
    """Get network statistics"""
    blockchain_service = get_blockchain_service()
    network_stats = blockchain_service.get_network_stats()
    return jsonify(network_stats)

@blockchain_bp.route('/zk/generate-voting-proof', methods=['POST'])
def generate_voting_proof():
    """Generate ZK proof for anonymous voting"""
    data = request.get_json()
    
    required_fields = ['voter_address', 'proposal_id', 'vote_choice']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'voter_address, proposal_id, and vote_choice are required'}), 400
    
    zk_service = get_zk_proof_service()
    
    try:
        proof_result = zk_service.generate_voting_proof(
            voter_address=data['voter_address'],
            proposal_id=data['proposal_id'],
            vote_choice=data['vote_choice']
        )
        
        return jsonify(proof_result)
        
    except Exception as e:
        return jsonify({'error': f'Proof generation failed: {str(e)}'}), 500

@blockchain_bp.route('/zk/verify-proof', methods=['POST'])
def verify_proof():
    """Verify a zero-knowledge proof"""
    data = request.get_json()
    
    if not data or not data.get('proof_data'):
        return jsonify({'error': 'proof_data is required'}), 400
    
    zk_service = get_zk_proof_service()
    
    try:
        verification_result = zk_service.verify_proof(data['proof_data'])
        return jsonify(verification_result)
        
    except Exception as e:
        return jsonify({'error': f'Proof verification failed: {str(e)}'}), 500

@blockchain_bp.route('/zk/generate-treasury-proof', methods=['POST'])
def generate_treasury_proof():
    """Generate ZK proof for treasury operations"""
    data = request.get_json()
    
    required_fields = ['operation', 'amount', 'recipient']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'operation, amount, and recipient are required'}), 400
    
    zk_service = get_zk_proof_service()
    
    try:
        proof_result = zk_service.generate_treasury_proof(
            operation=data['operation'],
            amount=data['amount'],
            recipient=data['recipient']
        )
        
        return jsonify(proof_result)
        
    except Exception as e:
        return jsonify({'error': f'Treasury proof generation failed: {str(e)}'}), 500

@blockchain_bp.route('/wallet/connect', methods=['POST'])
def connect_wallet():
    """Handle wallet connection"""
    data = request.get_json()
    
    if not data or not data.get('address'):
        return jsonify({'error': 'Wallet address is required'}), 400
    
    address = data['address']
    blockchain_service = get_blockchain_service()
    
    # Get wallet information
    balance_info = blockchain_service.get_balance(address)
    staking_info = blockchain_service.get_staking_info(address)
    
    return jsonify({
        'success': True,
        'address': address,
        'balance': balance_info,
        'staking': staking_info,
        'network': 'Sepolia Testnet',
        'connected_at': datetime.utcnow().isoformat()
    })

@blockchain_bp.route('/wallet/add-token', methods=['POST'])
def add_token_to_wallet():
    """Provide token information for adding to wallet"""
    blockchain_service = get_blockchain_service()
    token_info = blockchain_service.get_token_info()
    
    return jsonify({
        'success': True,
        'token_address': token_info['contract_address'],
        'token_symbol': token_info['symbol'],
        'token_decimals': token_info['decimals'],
        'token_image': 'https://example.com/xmrt-logo.png',  # Would be actual logo URL
        'message': 'Add XMRT token to your wallet using the provided contract address'
    })

