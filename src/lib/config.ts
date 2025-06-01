import { logger } from './logger';

export interface AppConfig {
  mongodbUri: string;
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

export class ConfigError extends Error {
  constructor(message: string, public missingKeys: string[]) {
    super(message);
    this.name = 'ConfigError';
  }
}

export const validateEnvironment = (): AppConfig => {
  const missingKeys: string[] = [];
  
  // Check required environment variables
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    missingKeys.push('MONGODB_URI');
  }

  const nodeEnv = process.env.NODE_ENV || 'development';

  if (missingKeys.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingKeys.join(', ')}`;
    logger.error('Environment validation failed', { missingKeys });
    throw new ConfigError(errorMessage, missingKeys);
  }

  // Validate MongoDB URI format
  if (mongodbUri && !mongodbUri.startsWith('mongodb')) {
    logger.error('Invalid MongoDB URI format', { mongodbUri: mongodbUri.substring(0, 20) + '...' });
    throw new ConfigError('Invalid MongoDB URI format', ['MONGODB_URI']);
  }

  const config: AppConfig = {
    mongodbUri: mongodbUri!,
    nodeEnv,
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development'
  };

  logger.info('Environment validation successful', {
    nodeEnv: config.nodeEnv,
    hasMongoUri: !!config.mongodbUri
  });

  return config;
};

// Validate environment on module load
export const config = validateEnvironment(); 