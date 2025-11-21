import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { exec } from 'child_process';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg(
      {
        url: process.env.DATABASE_URL,
      },
      {
        onConnectionError: (error) => {
          console.error('Database connection error:', error);
          exec('npm run prisma:migrate', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing migration: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Migration stderr: ${stderr}`);
              return;
            }
            console.log(`Migration stdout: ${stdout}`);
          });
        },
      },
    );
    super({ adapter });
  }
}
