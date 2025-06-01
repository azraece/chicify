import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { logger } from '@/lib/logger';
import { config, ConfigError } from '@/lib/config';
import { validateRegistrationData, sanitizeRegistrationData, ValidationError } from '@/lib/validation';
import type { RegisterRequest, RegisterResponse, ErrorResponse, User } from '@/types/auth';

export async function POST(request: Request) {
  // Generate unique request ID for tracking
  const requestId = randomUUID();
  const requestLogger = logger.child({ requestId });
  
  requestLogger.info('Registration request started');
  
  let client: MongoClient | null = null;
  
  try {
    // Request body parsing
    requestLogger.debug('Parsing request body');
    let requestBody: RegisterRequest;
    
    try {
      const rawBody = await request.json();
      requestBody = sanitizeRegistrationData(rawBody);
      requestLogger.debug('Request data sanitized', { 
        email: requestBody.email, 
        hasPassword: !!requestBody.password, 
        name: requestBody.name 
      });
    } catch (parseError) {
      requestLogger.error('Failed to parse or sanitize request body', parseError);
      
      const errorResponse: ErrorResponse = {
        error: 'Geçersiz JSON formatı',
        details: 'Request body JSON olarak ayrıştırılamadı veya geçersiz veri formatı',
        code: 'INVALID_JSON'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Input validation
    requestLogger.debug('Starting comprehensive input validation');
    
    try {
      const validationResult = validateRegistrationData(requestBody);
      
      if (!validationResult.isValid) {
        requestLogger.warn('Validation failed', { errors: validationResult.errors });
        
        const errorResponse: ErrorResponse = {
          error: 'Veri doğrulama hatası',
          details: validationResult.errors.join(', '),
          code: 'VALIDATION_ERROR'
        };
        
        return NextResponse.json(errorResponse, { status: 400 });
      }
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        requestLogger.warn('Validation error occurred', { errors: validationError.errors });
        
        const errorResponse: ErrorResponse = {
          error: validationError.message,
          details: validationError.errors.join(', '),
          code: 'VALIDATION_ERROR'
        };
        
        return NextResponse.json(errorResponse, { status: 400 });
      }
      throw validationError; // Re-throw if it's not a ValidationError
    }

    // MongoDB connection with timeout
    requestLogger.debug('Connecting to MongoDB');
    
    try {
      client = await MongoClient.connect(config.mongodbUri, {
        connectTimeoutMS: 10000, // 10 seconds
        serverSelectionTimeoutMS: 10000, // 10 seconds
      });
      requestLogger.info('MongoDB connection successful');
    } catch (connectionError) {
      requestLogger.error('Failed to connect to MongoDB', connectionError);
      
      const errorResponse: ErrorResponse = {
        error: 'Veritabanı bağlantı hatası',
        details: 'Veritabanına bağlanılamadı',
        code: 'DB_CONNECTION_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const db = client.db();
    
    // Email kontrolü (case-insensitive)
    requestLogger.debug('Checking for existing user', { email: requestBody.email });
    
    let existingUser;
    try {
      existingUser = await db.collection('users').findOne({ 
        email: requestBody.email 
      });
    } catch (dbError) {
      requestLogger.error('Database query error during user check', dbError);
      await client.close();
      
      const errorResponse: ErrorResponse = {
        error: 'Veritabanı sorgulama hatası',
        details: 'Kullanıcı kontrolü yapılamadı',
        code: 'DB_QUERY_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    if (existingUser) {
      requestLogger.warn('User already exists', { email: requestBody.email });
      await client.close();
      
      const errorResponse: ErrorResponse = {
        error: 'Bu email zaten kayıtlı',
        details: 'Bu email adresi ile daha önce kayıt olunmuş',
        code: 'USER_EXISTS'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Şifre hashleme with increased rounds for better security
    requestLogger.debug('Hashing password');
    
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(requestBody.password, 12);
      requestLogger.debug('Password hashed successfully');
    } catch (hashError) {
      requestLogger.error('Password hashing failed', hashError);
      await client.close();
      
      const errorResponse: ErrorResponse = {
        error: 'Şifre işleme hatası',
        details: 'Şifre güvenlik işlemi başarısız',
        code: 'HASH_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }
    
    // Kullanıcı kaydetme
    requestLogger.debug('Saving user to database', { 
      email: requestBody.email, 
      name: requestBody.name 
    });
    
    try {
      const newUser: Omit<User, '_id'> = {
        email: requestBody.email,
        password: hashedPassword,
        name: requestBody.name,
        createdAt: new Date(),
        isActive: true,
        emailVerified: false
      };
      
      const result = await db.collection('users').insertOne(newUser);
      
      requestLogger.info('User registered successfully', { 
        userId: result.insertedId,
        email: requestBody.email,
        name: requestBody.name 
      });
      
    } catch (insertError) {
      requestLogger.error('Failed to insert user', insertError);
      await client.close();
      
      const errorResponse: ErrorResponse = {
        error: 'Kullanıcı kaydetme hatası',
        details: 'Veritabanına kayıt yapılamadı',
        code: 'DB_INSERT_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    await client.close();
    requestLogger.info('Registration process completed successfully', { 
      email: requestBody.email 
    });
    
    const successResponse: RegisterResponse = {
      message: 'Kayıt başarılı',
      details: 'Hesabınız başarıyla oluşturuldu'
    };
    
    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    // Handle configuration errors
    if (error instanceof ConfigError) {
      requestLogger.error('Configuration error', { missingKeys: error.missingKeys });
      
      const errorResponse: ErrorResponse = {
        error: 'Sunucu konfigürasyon hatası',
        details: `Eksik konfigürasyon: ${error.missingKeys.join(', ')}`,
        code: 'CONFIG_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    requestLogger.error('Unexpected error in registration', error);
    
    // Clean up connection if it exists
    if (client) {
      try {
        await client.close();
        requestLogger.debug('MongoDB connection closed after error');
      } catch (closeError) {
        requestLogger.error('Failed to close MongoDB connection', closeError);
      }
    }
    
    const errorResponse: ErrorResponse = {
      error: 'Kayıt işlemi başarısız',
      details: 'Beklenmeyen bir hata oluştu',
      code: 'INTERNAL_ERROR'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 