/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NODE_ENV } from '../constant/app.contants';
import { SnakeNamingStrategy } from "../../shared/strategy/snake-naming.strategy";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      namingStrategy: new SnakeNamingStrategy(),
      entities: ['dist/**/*.entity.{ts,js}'],
    //   migrations: ['dist/migrations/*.{ts,js}'],
    //   migrationsTableName: 'typeorm_migrations',
      logging: this.config.get("NODE_ENV") === NODE_ENV.DEVELOPMENT,
      synchronize: this.config.get("NODE_ENV") === NODE_ENV.DEVELOPMENT,
      logger: 'file'
    };
  }
}