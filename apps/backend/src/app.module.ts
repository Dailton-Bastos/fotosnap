import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DATABASE_CONNECTION } from './database/database-connection';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [configService.getOrThrow<string>('UI_URL')],
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
