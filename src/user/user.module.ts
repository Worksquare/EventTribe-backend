import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';


@Module({
    imports: [
      TypeOrmModule.forFeature([
        User,
      ]),
      ConfigModule.forRoot(),
    ],
    controllers: [UserController],
    providers: [UserService],
  })
  export class UserModule {}
  