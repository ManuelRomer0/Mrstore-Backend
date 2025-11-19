import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
export interface LoginResponse {
  access_token: string;
}
@Module({
  imports: [PrismaModule,
    JwtModule.register({
    global: true,
    secret: process.env.SECRET,
    signOptions: { expiresIn: '24h' },
  }),],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}]
})
export class AuthModule {}
