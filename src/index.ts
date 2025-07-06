import { XMRTAPIServer } from '@/api/server';
import { config } from '@/config';

async function main() {
  console.log('🚀 Starting XMRT Fully Automated AI Organization...');
  console.log('📋 Configuration loaded');
  console.log(`🌐 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 XMRT Ecosystem: ${config.xmrt.ecosystemUrl}`);

  try {
    // Initialize and start the API server
    const server = new XMRTAPIServer();
    server.start();

    // Graceful shutdown handling
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      server.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start XMRT AI Organization:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  console.error('❌ Application startup failed:', error);
  process.exit(1);
});

