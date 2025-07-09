import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from '@/config';
import { xmrtAgents } from '@/agents/elizaAgent';
import { XMRTOrganization } from '@/utils/organization';

export class XMRTAPIServer {
  private app: express.Application;
  private server: any;
  private wss: WebSocketServer;
  private organization: XMRTOrganization;

  constructor() {
    this.app = express();
    this.organization = new XMRTOrganization();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupMiddleware(): void {
    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Security headers
    this.app.use((req, res, next) => {
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'DENY');
      res.header('X-XSS-Protection', '1; mode=block');
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        organization: this.organization.getStatus()
      });
    });

    // Organization status endpoint
    this.app.get('/api/organization/status', (req, res) => {
      res.json(this.organization.getStatus());
    });

    // AI Agents endpoints
    this.app.get('/api/agents', (req, res) => {
      res.json({
        agents: xmrtAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          capabilities: agent.capabilities,
          status: agent.status
        }))
      });
    });

    this.app.get('/api/agents/:agentId', (req, res) => {
      const agent = xmrtAgents.find(a => a.id === req.params.agentId);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json(agent);
    });

    // Chat endpoint for AI agent interaction
    this.app.post('/api/chat/:agentId', async (req, res) => {
      try {
        const { agentId } = req.params;
        const { message, userId } = req.body;

        const agent = xmrtAgents.find(a => a.id === agentId);
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }

        // Here we would integrate with the actual Eliza runtime
        // For now, we'll return a mock response
        const response = await this.organization.processAgentMessage(agentId, message, userId);
        
        res.json({
          agentId,
          response,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // XMRT Ecosystem integration endpoints
    this.app.get('/api/xmrt/ecosystem', (req, res) => {
      res.json({
        ecosystemUrl: config.xmrt.ecosystemUrl,
        services: [
          'XMART Token Management',
          'Monero Mining Pool',
          'CashDapp Banking',
          'DAO Governance',
          'DeFi Integration'
        ],
        status: 'operational'
      });
    });

    // Blockchain data endpoints
    this.app.get('/api/blockchain/status', async (req, res) => {
      try {
        const status = await this.organization.getBlockchainStatus();
        res.json(status);
      } catch (error) {
        console.error('Blockchain status error:', error);
        res.status(500).json({ error: 'Failed to fetch blockchain status' });
      }
    });

    // Financial data endpoints
    this.app.get('/api/finance/portfolio', async (req, res) => {
      try {
        const portfolio = await this.organization.getPortfolioStatus();
        res.json(portfolio);
      } catch (error) {
        console.error('Portfolio status error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio status' });
      }
    });

    // Governance endpoints
    this.app.get('/api/governance/proposals', async (req, res) => {
      try {
        const proposals = await this.organization.getGovernanceProposals();
        res.json(proposals);
      } catch (error) {
        console.error('Governance proposals error:', error);
        res.status(500).json({ error: 'Failed to fetch governance proposals' });
      }
    });

    // Static file serving for frontend
    this.app.use(express.static('public'));

    // Catch-all route for SPA
    this.app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });

    // Centralized error handling middleware
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(`Unhandled API Error: ${err.message}`, err.stack);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    });
  }

  private setupWebSocket(): void {
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws, req) => {
      console.log('WebSocket connection established');

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to XMRT AI Organization',
        timestamp: new Date().toISOString()
      }));

      // Handle incoming messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          switch (message.type) {
            case 'chat':
              const response = await this.organization.processAgentMessage(
                message.agentId,
                message.content,
                message.userId
              );
              ws.send(JSON.stringify({
                type: 'chat_response',
                agentId: message.agentId,
                response,
                timestamp: new Date().toISOString()
              }));
              break;

            case 'status_request':
              const status = this.organization.getStatus();
              ws.send(JSON.stringify({
                type: 'status_update',
                status,
                timestamp: new Date().toISOString()
              }));
              break;

            default:
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Unknown message type',
                timestamp: new Date().toISOString()
              }));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process message',
            timestamp: new Date().toISOString()
          }));
        }
      });

      // Handle connection close
      ws.on('close', () => {
        console.log('WebSocket connection closed');
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Broadcast organization updates to all connected clients
    setInterval(() => {
      const status = this.organization.getStatus();
      this.broadcast({
        type: 'organization_update',
        status,
        timestamp: new Date().toISOString()
      });
    }, 30000); // Every 30 seconds
  }

  private broadcast(message: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(message));
      }
    });
  }

  public start(): void {
    this.server.listen(config.server.port, config.server.host, () => {
      console.log(`🚀 XMRT AI Organization server running on http://${config.server.host}:${config.server.port}`);
      console.log(`📊 WebSocket server ready for real-time communication`);
      console.log(`🤖 AI Agents: ${xmrtAgents.length} active`);
      console.log(`🔗 XMRT Ecosystem: ${config.xmrt.ecosystemUrl}`);
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      console.log('🛑 XMRT AI Organization server stopped');
    }
  }
}

export default XMRTAPIServer;


