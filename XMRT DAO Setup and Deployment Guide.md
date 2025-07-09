# XMRT DAO Setup and Deployment Guide

## Quick Start

The XMRT DAO is already deployed and accessible at: **https://p9hwiqc5ky73.manus.space**

For immediate access, simply visit the URL and connect your Web3 wallet configured for Sepolia Testnet.

## Local Development Setup

### Prerequisites

- Node.js 20.18.0 or higher
- Python 3.11 or higher
- Git
- Web3 wallet (MetaMask recommended)

### Frontend Setup

1. Clone the repository and navigate to the frontend directory:
```bash
git clone <repository-url>
cd xmrt-dao-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd xmrt-dao-backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python src/main.py
```

The backend API will be available at `http://localhost:5000`

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///database/app.db
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
XMRT_CONTRACT_ADDRESS=0x77307DFbc436224d5e6f2048d2b6bDfA66998a15
```

### Wallet Configuration

1. Install MetaMask or compatible Web3 wallet
2. Add Sepolia Testnet network:
   - Network Name: Sepolia Testnet
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

3. Add XMRT token to wallet:
   - Contract Address: `0x77307DFbc436224d5e6f2048d2b6bDfA66998a15`
   - Symbol: XMRT
   - Decimals: 18

## API Endpoints Reference

### DAO Operations

- `GET /api/dao/proposals` - Get all proposals
- `POST /api/dao/proposals` - Create new proposal
- `POST /api/dao/proposals/{id}/vote` - Vote on proposal
- `GET /api/dao/agents` - Get AI agent status
- `POST /api/dao/agents/{name}/chat` - Chat with AI agent

### Blockchain Operations

- `GET /api/blockchain/token/info` - Get XMRT token information
- `GET /api/blockchain/token/balance/{address}` - Get token balance
- `POST /api/blockchain/staking/stake` - Stake tokens
- `POST /api/blockchain/governance/vote` - Vote on-chain
- `GET /api/blockchain/network/stats` - Get network statistics

### Zero-Knowledge Proofs

- `POST /api/blockchain/zk/generate-voting-proof` - Generate voting proof
- `POST /api/blockchain/zk/verify-proof` - Verify proof
- `POST /api/blockchain/zk/generate-treasury-proof` - Generate treasury proof

## Testing

### Frontend Testing

```bash
cd xmrt-dao-frontend
npm test
```

### Backend Testing

```bash
cd xmrt-dao-backend
source venv/bin/activate
python -m pytest tests/
```

### API Testing

Use the provided Postman collection or test endpoints directly:

```bash
# Test token info
curl https://p9hwiqc5ky73.manus.space/api/blockchain/token/info

# Test proposals
curl https://p9hwiqc5ky73.manus.space/api/dao/proposals

# Test AI agents
curl https://p9hwiqc5ky73.manus.space/api/dao/agents
```

## Deployment

### Production Deployment

The application is deployed using Manus deployment services. To deploy your own instance:

1. Build the frontend:
```bash
cd xmrt-dao-frontend
npm run build
```

2. Copy built files to Flask static directory:
```bash
cp -r dist/* ../xmrt-dao-backend/src/static/
```

3. Deploy using Manus services or your preferred hosting platform.

### Docker Deployment

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "src/main.py"]
```

Build and run:
```bash
docker build -t xmrt-dao .
docker run -p 5000:5000 xmrt-dao
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Verify Sepolia Testnet is selected
   - Check that the site is allowed in wallet settings

2. **API Connection Errors**
   - Verify backend server is running
   - Check CORS configuration
   - Ensure proper network connectivity

3. **Transaction Failures**
   - Verify sufficient ETH for gas fees
   - Check transaction parameters
   - Monitor network congestion

### Debug Mode

Enable debug mode in Flask for detailed error messages:

```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

### Logging

Check application logs for detailed error information:

```bash
# Backend logs
tail -f logs/app.log

# Frontend console
# Open browser developer tools and check console
```

## Security Considerations

### Development Security

- Never commit private keys or sensitive credentials
- Use environment variables for configuration
- Implement proper input validation
- Enable HTTPS in production

### Production Security

- Use secure random secret keys
- Implement rate limiting
- Enable security headers
- Regular security audits

## Support and Resources

### Documentation

- [XMRT DAO Documentation](./XMRT_DAO_Documentation.md)
- [API Reference](./API_Reference.md)
- [Architecture Overview](./architecture_plan.md)

### Community

- GitHub Issues: Report bugs and feature requests
- Discord: Community discussions and support
- Documentation: Comprehensive guides and tutorials

### Development Resources

- [Eliza AI Framework](https://github.com/elizaOS/eliza)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Web3.py Documentation](https://web3py.readthedocs.io/)

---

*Setup Guide prepared by Manus AI - July 4, 2025*

