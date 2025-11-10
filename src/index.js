require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const db = require('./models');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./graphql');
const { colorize, createBox } = require('./utils/colors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static('public'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game DB API',
      version: '1.0.0',
      description: 'A comprehensive API for managing video game database',
    },
    servers: [
      {
        url: `http://localhost:${PORT}${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GraphQL Sandbox route
app.get('/graphql-sandbox', (req, res) => {
  res.sendFile('graphql-sandbox.html', { root: 'public' });
});

// API Routes
app.use(`${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`, routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Function to start server
async function startServer() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database models (in production, use migrations)
    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync({ alter: false });
      console.log(colorize.success('🗄️  Database models synchronized successfully!'));
    }

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Create Apollo Server with v4 configuration
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    // Start Apollo Server
    await apolloServer.start();

    // Apply GraphQL middleware
    app.use(
      process.env.GRAPHQL_PATH || '/graphql',
      cors(),
      bodyParser.json(),
      expressMiddleware(apolloServer, {
        context: async () => ({
          db
        }),
      })
    );

    // Start HTTP server
    await new Promise(resolve => httpServer.listen(PORT, resolve));

    // Colorful startup messages
    console.log('');
    console.log(colorize.rainbow('🎮 ================================= 🎮'));
    console.log(colorize.server('🚀 GAME DB SERVER STARTED SUCCESSFULLY! 🚀'));
    console.log(colorize.rainbow('🎮 ================================= 🎮'));
    console.log('');

    const serverInfo = [
      `${colorize.bold('🌐 Server:')} Running on port ${colorize.port(PORT)}`,
      '',
      `${colorize.bold('📚 Available Endpoints:')}`,
      `  🔗 REST API: ${colorize.url(`http://localhost:${PORT}${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`)}`,
      `  ⚡ GraphQL: ${colorize.url(`http://localhost:${PORT}${process.env.GRAPHQL_PATH || '/graphql'}`)}`,
      `  🛠️  Sandbox: ${colorize.url(`http://localhost:${PORT}/graphql-sandbox`)}`,
      `  📖 API Docs: ${colorize.url(`http://localhost:${PORT}/api-docs`)}`,
      '',
      `${colorize.success('✅ All systems operational!')}`
    ];

    console.log(createBox(serverInfo, '🎮 GAME DATABASE API'));
    console.log('');
  } catch (error) {
    console.log('');
    console.log(colorize.error('❌ ================================== ❌'));
    console.log(colorize.error('💥 FAILED TO START GAME DB SERVER! 💥'));
    console.log(colorize.error('❌ ================================== ❌'));
    console.log('');
    console.error(colorize.error(`🚨 Error: ${error.message}`));
    console.log('');
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;