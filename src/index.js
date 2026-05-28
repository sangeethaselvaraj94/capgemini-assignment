require('dotenv').config({ quiet: true });

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter.middleware');
const errorHandler = require('./middleware/error.middleware');
const AppError = require('./utils/app-error');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

require('./config/database');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

app.use((req, res, next) => {
  logger.info('%s %s', req.method, req.originalUrl);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, res) => res.json({ status: 'success', message: 'OK' }));

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

const port = process.env.PORT || 3000;

const loadSslOptions = () => {
  const certPath = process.env.SSL_CERT_PATH;
  const keyPath = process.env.SSL_KEY_PATH;

  if (!certPath || !keyPath) {
    return null;
  }

  try {
    return {
      cert: fs.readFileSync(path.resolve(certPath), 'utf8'),
      key: fs.readFileSync(path.resolve(keyPath), 'utf8'),
      passphrase: process.env.SSL_PASSPHRASE || undefined,
    };
  } catch (error) {
    logger.error('Failed to load SSL certificate or key: %s', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %s', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception: %s', error.stack || error.message);
  process.exit(1);
});

if (require.main === module) {
  const sslOptions = loadSslOptions();

  if (sslOptions) {
    https.createServer(sslOptions, app).listen(port, () => {
      logger.info('HTTPS server started on port %d', port);
    });
  } else {
    app.listen(port, () => {
      logger.info('Server started on port %d', port);
    });
  }
}

module.exports = app;
