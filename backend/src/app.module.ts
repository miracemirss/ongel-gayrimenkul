import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { LeadsModule } from './leads/leads.module';
import { CmsModule } from './cms/cms.module';
import { StorageModule } from './storage/storage.module';
import { FooterModule } from './footer/footer.module';
import { NavigationModule } from './navigation/navigation.module';
import { ContactModule } from './contact/contact.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting - Prevent brute force attacks
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Supabase connection: Use connection string or individual parameters
      ...(process.env.DATABASE_URL
        ? (() => {
            // Ensure SSL is enabled for Supabase connection strings
            let databaseUrl = process.env.DATABASE_URL;
            // Fix: Replace https:// with postgresql:// if present (common Supabase mistake)
            if (databaseUrl.startsWith('https://')) {
              databaseUrl = databaseUrl.replace('https://', 'postgresql://');
            }
            // Remove any existing sslmode parameters - we'll use TypeORM's ssl object instead
            databaseUrl = databaseUrl.replace(/[?&]sslmode=[^&]*/, '');
            // Clean up any trailing ? or & after removing sslmode
            databaseUrl = databaseUrl.replace(/[?&]$/, '');
            
            const isSupabase = databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com');
            
            return {
              url: databaseUrl,
              // Force SSL for Supabase (both direct and pooler connections)
              // rejectUnauthorized: false is required for Supabase's self-signed certificates
              ssl: isSupabase ? { rejectUnauthorized: false } : false,
            };
          })()
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'postgres',
            ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('supabase.co')
              ? { rejectUnauthorized: false }
              : false,
          }),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    ListingsModule,
    LeadsModule,
    CmsModule,
    StorageModule,
    FooterModule,
    NavigationModule,
    ContactModule,
    BlogModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

