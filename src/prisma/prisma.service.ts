import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      url: 'postgres://postgres:1002033791@mrstoredb.ct6wi8y6eq5g.us-east-2.rds.amazonaws.com:5432/mrstore_db?schema=public',
    });
    super({ adapter });
  }
}
