import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface XMRTConfig {
  server: {
    port: number;
    host: string;
    nodeEnv: string;
  };
  ai: {
    openaiApiKey?: string;
    anthropicApiKey?: string;
    googleApiKey?: string;
  };
  xmrt: {
    ecosystemUrl: string;
    apiBaseUrl: string;
  };
  blockchain: {
    ethereumRpcUrl: string;
    sepoliaRpcUrl: string;
    alchemyApiKey?: string;
    thirdwebClientId?: string;
  };
  contracts: {
    xmartTokenAddress?: string;
    moneroPoolAddress?: string;
    cashDappAddress?: string;
  };
  monero: {
    poolWallet?: string;
    rpcUrl: string;
  };
  database: {
    url?: string;
    redisUrl?: string;
  };
  security: {
    jwtSecret: string;
    encryptionKey: string;
  };
  apis: {
    coingeckoApiKey?: string;
    defipulseApiKey?: string;
  };
  logging: {
    level: string;
    format: string;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  websocket: {
    heartbeatInterval: number;
    maxConnections: number;
  };
}

export const config: XMRTConfig = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
  xmrt: {
    ecosystemUrl: process.env.XMRT_ECOSYSTEM_URL || 'https://xmrt.io',
    apiBaseUrl: process.env.XMRT_API_BASE_URL || 'https://api.xmrt.io',
  },
  blockchain: {
    ethereumRpcUrl: process.env.ETHEREUM_RPC_URL || '',
    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || '',
    alchemyApiKey: process.env.ALCHEMY_API_KEY,
    thirdwebClientId: process.env.THIRDWEB_CLIENT_ID,
  },
  contracts: {
    xmartTokenAddress: process.env.XMART_TOKEN_ADDRESS,
    moneroPoolAddress: process.env.MONERO_POOL_ADDRESS,
    cashDappAddress: process.env.CASH_DAPP_ADDRESS,
  },
  monero: {
    poolWallet: process.env.MONERO_POOL_WALLET,
    rpcUrl: process.env.MONERO_RPC_URL || 'http://localhost:18081',
  },
  database: {
    url: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
    encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production',
  },
  apis: {
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
    defipulseApiKey: process.env.DEFIPULSE_API_KEY,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  websocket: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000', 10),
    maxConnections: parseInt(process.env.WS_MAX_CONNECTIONS || '1000', 10),
  },
};

export default config;

