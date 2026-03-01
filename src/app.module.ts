import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { RedisModule } from './redis/redis.module';
import { TasksModule } from './tasks/tasks.module';
import { DatabaseModule } from './database/database.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm')),
    }),
    DatabaseModule,
    RedisModule,
    TasksModule,
    AuditLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
