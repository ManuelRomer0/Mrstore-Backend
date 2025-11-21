import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import { error } from 'console';

@Injectable()
export class AppService implements OnModuleInit {
  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
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
  }
}
