
# XMRT AI Organization - API Documentation

This document provides comprehensive documentation for all API endpoints and WebSocket events available in the XMRT AI Organization system.

## 🌐 Base URL

**Local Development**: `http://localhost:3000`
**Production**: `https://your-domain.com`

## 📡 REST API Endpoints

### Health & Status

#### GET /health
Returns basic health status of the application.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-06T15:30:00.000Z",
  "version": "1.0.0",
  "organization": {
    "status": "operational",
    "uptime": 2847600,
    "agents": {
      "total": 3,
      "active": 3,
      "inactive": 0
    }
  }
}
```

#### GET /api/organization/status
Returns detailed organization status and metrics.

**Response**:
```json
{
  "id": "xmrt-ai-organization",
  "name": "XMRT Fully Automated AI Organization",
  "status": "operational",
  "uptime": 2847600,
  "agents": {
    "total": 3,
    "active": 3,
    "inactive": 0
  },
  "ecosystem": {
    "connected": true,
    "services": [
      "XMART Token Management",
      "Monero Mining Pool",
      "CashDapp Banking",
      "DAO Governance",
      "DeFi Integration"
    ]
  },
  "performance": {
    "responseTime": 45,
    "throughput": 1250,
    "errorRate": 0.02
  },
  "lastUpdated": "2025-01-06T15:30:00.000Z"
}
```

### AI Agents

#### GET /api/agents
Returns list of all available AI agents.

**Response**:
```json
{
  "agents": [
    {
      "id": "executive",
      "name": "XMRT Executive AI",
      "role": "Strategic Leadership",
      "capabilities": [
        "strategic_planning",
        "resource_allocation",
        "stakeholder_communication",
        "governance"
      ],
      "status": "active"
    },
    {
      "id": "operations",
      "name": "XMRT Operations AI",
      "role": "Operational Management",
      "capabilities": [
        "process_optimization",
        "system_monitoring",
        "workflow_management",
        "quality_assurance"
      ],
      "status": "active"
    },
    {
      "id": "financial",
      "name": "XMRT Financial AI",
      "role": "Financial Management",
      "capabilities": [
        "treasury_management",
        "defi_optimization",
        "risk_management",
        "financial_reporting"
      ],
      "status": "active"
    }
  ]
}
```

#### GET /api/agents/:agentId
Returns detailed information about a specific agent.

**Parameters**:
- `agentId` (string): Agent identifier (`executive`, `operations`, `financial`)

**Response**:
```json
{
  "id": "executive",
  "name": "XMRT Executive AI",
  "role": "Strategic Leadership",
  "character": {
    "name": "XMRT Executive AI",
    "username": "xmrt_executive",
    "system": "You are the Executive AI Agent...",
    "bio": [
      "Executive AI Agent responsible for strategic leadership...",
      "Specializes in organizational management..."
    ],
    "capabilities": [
      "Strategic planning and goal setting",
      "Resource allocation and budget management"
    ]
  },
  "capabilities": [
    "strategic_planning",
    "resource_allocation",
    "stakeholder_communication",
    "governance"
  ],
  "status": "active"
}
```

**Error Response** (404):
```json
{
  "error": "Agent not found"
}
```

#### POST /api/chat/:agentId
Send a message to a specific AI agent and receive a response.

**Parameters**:
- `agentId` (string): Agent identifier

**Request Body**:
```json
{
  "message": "What is the current financial status of the organization?",
  "userId": "user-123"
}
```

**Response**:
```json
{
  "agentId": "executive",
  "response": "The XMRT organization is performing exceptionally well. We're maintaining 99.7% uptime, managing $2.34M in assets, and serving 1,247 active community members...",
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

**Error Response** (404):
```json
{
  "error": "Agent not found"
}
```

**Error Response** (500):
```json
{
  "error": "Internal server error"
}
```

### XMRT Ecosystem

#### GET /api/xmrt/ecosystem
Returns information about XMRT ecosystem integration.

**Response**:
```json
{
  "ecosystemUrl": "https://xmrt.io",
  "services": [
    "XMART Token Management",
    "Monero Mining Pool",
    "CashDapp Banking",
    "DAO Governance",
    "DeFi Integration"
  ],
  "status": "operational"
}
```

#### GET /api/blockchain/status
Returns blockchain integration status and metrics.

**Response**:
```json
{
  "ethereum": {
    "connected": true,
    "blockNumber": 18501234,
    "gasPrice": "25.67 gwei"
  },
  "xmart": {
    "totalSupply": "1000000000",
    "stakingRewards": "8.5",
    "holders": 1247
  },
  "monero": {
    "poolStatus": "active",
    "hashRate": "2.5 MH/s",
    "miners": 156
  }
}
```

#### GET /api/finance/portfolio
Returns financial portfolio status and performance.

**Response**:
```json
{
  "totalValue": "2340000",
  "assets": [
    {
      "symbol": "XMART",
      "amount": "1053000",
      "value": "1053000",
      "percentage": 45
    },
    {
      "symbol": "ETH",
      "amount": "195",
      "value": "585000",
      "percentage": 25
    },
    {
      "symbol": "USDC",
      "amount": "351000",
      "value": "351000",
      "percentage": 15
    },
    {
      "symbol": "XMR",
      "amount": "1560",
      "value": "234000",
      "percentage": 10
    },
    {
      "symbol": "OTHER",
      "amount": "117000",
      "value": "117000",
      "percentage": 5
    }
  ],
  "performance": {
    "daily": 0.8,
    "weekly": 2.3,
    "monthly": 5.7,
    "yearly": 18.7
  },
  "yields": {
    "staking": 8.5,
    "defi": 12.0,
    "mining": 6.8
  }
}
```

#### GET /api/governance/proposals
Returns current DAO governance proposals.

**Response**:
```json
[
  {
    "id": "prop-001",
    "title": "Expand Monero Mining Operations",
    "description": "Proposal to allocate 15% of treasury funds to expand mining infrastructure",
    "proposer": "XMRT Executive AI",
    "status": "active",
    "votes": {
      "for": 847,
      "against": 123,
      "abstain": 45
    },
    "deadline": "2025-01-13T15:30:00.000Z",
    "created": "2025-01-03T15:30:00.000Z"
  },
  {
    "id": "prop-002",
    "title": "DeFi Protocol Integration",
    "description": "Add support for new yield farming opportunities in emerging protocols",
    "proposer": "XMRT Financial AI",
    "status": "active",
    "votes": {
      "for": 692,
      "against": 89,
      "abstain": 67
    },
    "deadline": "2025-01-11T15:30:00.000Z",
    "created": "2025-01-04T15:30:00.000Z"
  }
]
```

## 🔌 WebSocket API

### Connection
Connect to WebSocket at: `ws://localhost:3000` or `wss://your-domain.com`

### Events

#### Client → Server Events

##### chat
Send a chat message to an AI agent.

**Payload**:
```json
{
  "type": "chat",
  "agentId": "executive",
  "content": "What is the organization status?",
  "userId": "user-123"
}
```

##### status_request
Request current organization status.

**Payload**:
```json
{
  "type": "status_request"
}
```

#### Server → Client Events

##### welcome
Sent when WebSocket connection is established.

**Payload**:
```json
{
  "type": "welcome",
  "message": "Connected to XMRT AI Organization",
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

##### chat_response
Response from an AI agent to a chat message.

**Payload**:
```json
{
  "type": "chat_response",
  "agentId": "executive",
  "response": "The XMRT organization is operating at optimal efficiency...",
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

##### status_update
Response to status_request with current organization status.

**Payload**:
```json
{
  "type": "status_update",
  "status": {
    "name": "XMRT Fully Automated AI Organization",
    "status": "operational",
    "uptime": 2847600,
    "agents": {
      "total": 3,
      "active": 3,
      "inactive": 0
    }
  },
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

##### organization_update
Periodic updates about organization status (sent every 30 seconds).

**Payload**:
```json
{
  "type": "organization_update",
  "status": {
    "name": "XMRT Fully Automated AI Organization",
    "status": "operational",
    "performance": {
      "responseTime": 45,
      "throughput": 1250,
      "errorRate": 0.02
    }
  },
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

##### error
Error message for invalid requests or system errors.

**Payload**:
```json
{
  "type": "error",
  "message": "Unknown message type",
  "timestamp": "2025-01-06T15:30:00.000Z"
}
```

## 🔒 Authentication & Security

### CORS Configuration
The API supports CORS for cross-origin requests. In production, configure allowed origins:

```javascript
// Allowed origins
const allowedOrigins = [
  'https://yourdomain.com',
  'https://xmrt.io'
];
```

### Rate Limiting
API endpoints are rate-limited to prevent abuse:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Endpoints**: All `/api/*` routes

### Security Headers
The following security headers are automatically added:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 404  | Not Found |
| 429  | Too Many Requests |
| 500  | Internal Server Error |

## 🧪 Testing Examples

### cURL Examples

**Health Check**:
```bash
curl -X GET http://localhost:3000/health
```

**Get All Agents**:
```bash
curl -X GET http://localhost:3000/api/agents
```

**Chat with Executive AI**:
```bash
curl -X POST http://localhost:3000/api/chat/executive \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the current organization status?",
    "userId": "test-user"
  }'
```

**Get Organization Status**:
```bash
curl -X GET http://localhost:3000/api/organization/status
```

### JavaScript Examples

**Fetch Organization Status**:
```javascript
async function getOrganizationStatus() {
  try {
    const response = await fetch('/api/organization/status');
    const status = await response.json();
    console.log('Organization Status:', status);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Chat with AI Agent**:
```javascript
async function chatWithAgent(agentId, message) {
  try {
    const response = await fetch(`/api/chat/${agentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        userId: 'user-123'
      })
    });
    
    const result = await response.json();
    console.log('Agent Response:', result.response);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**WebSocket Connection**:
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
  console.log('Connected to XMRT AI Organization');
  
  // Send chat message
  ws.send(JSON.stringify({
    type: 'chat',
    agentId: 'executive',
    content: 'Hello, what is the organization status?',
    userId: 'user-123'
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};
```

## 📈 Performance Considerations

### Response Times
- **Health Check**: < 10ms
- **Agent List**: < 50ms
- **Chat Response**: 100-3000ms (includes AI processing)
- **Status Endpoints**: < 100ms

### Caching
- Organization status cached for 30 seconds
- Agent information cached for 5 minutes
- Static responses cached for 1 hour

### WebSocket Limits
- **Max Connections**: 1000 concurrent
- **Heartbeat Interval**: 30 seconds
- **Message Rate Limit**: 10 messages per second per connection

---

**API Documentation v1.0**
*Last updated: January 2025*

