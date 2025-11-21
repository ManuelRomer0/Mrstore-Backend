import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: 'postgres://postgres:1002033791@mrstoredb.ct6wi8y6eq5g.us-east-2.rds.amazonaws.com:5432/mrstore_db?schema=public',
  },
});
