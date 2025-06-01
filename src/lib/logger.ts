export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
  requestId?: string;
  userId?: string;
}

class Logger {
  private currentLevel: LogLevel;

  constructor() {
    this.currentLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatLog(level: string, message: string, data?: any, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data || undefined,
      requestId: context?.requestId,
      userId: context?.userId
    };
  }

  debug(message: string, data?: any, context?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const logEntry = this.formatLog('DEBUG', message, data, context);
      console.log(`[DEBUG] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }

  info(message: string, data?: any, context?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      const logEntry = this.formatLog('INFO', message, data, context);
      console.log(`[INFO] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }

  warn(message: string, data?: any, context?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      const logEntry = this.formatLog('WARN', message, data, context);
      console.warn(`[WARN] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }

  error(message: string, error?: any, context?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const logEntry = this.formatLog('ERROR', message, error, context);
      console.error(`[ERROR] ${logEntry.timestamp} - ${message}`, error || '');
      
      // In production, you might want to send errors to a monitoring service
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to monitoring service (Sentry, DataDog, etc.)
      }
    }
  }

  // Method to create a child logger with context
  child(context: { requestId?: string; userId?: string }) {
    return {
      debug: (message: string, data?: any) => this.debug(message, data, context),
      info: (message: string, data?: any) => this.info(message, data, context),
      warn: (message: string, data?: any) => this.warn(message, data, context),
      error: (message: string, error?: any) => this.error(message, error, context)
    };
  }
}

export const logger = new Logger(); 