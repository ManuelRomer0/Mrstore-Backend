import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { exec } from 'child_process';
import { env } from 'prisma/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      url: env('DATABASE_URL'),
    });
    super({ adapter });
  }
}
