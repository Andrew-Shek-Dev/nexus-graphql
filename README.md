# Trial : Nexus, Primas and GraphQL
```bash
yarn init -y
yarn add typescript ts-node @types/node nodemon @types/nodemon
npx tsc --init
yarn add apollo-server graphql nexus
```

Create src/schema.ts  and src/index.ts

Under schema.ts
```typescript
import {makeSchema} from 'nexus';
import { join } from 'path';

export const schema = makeSchema({
    types:[],
    outputs:{
        schema: join(__dirname,"schema.graphql"),
        typegen:join(__dirname,"nexus-typegen.ts")
    }
});
```

Generate schema.graphql and nexus-typegen.ts
```bash
npx ts-node --transpile-only src/schema
```


Complier the typescript to javascript code because the size can be reduced significantly for deployment:
```tsconfig.json

```

```bash
 yarn run tsc
```

Create nodemon.json
```json
{
    "restartable": "rs",
    "ignore": [".git", "node_modules/", "dist/", "coverage/"],
    "watch": ["src/"],
    "execMap": {
      "ts": "node -r ts-node/register"
    },
    "env": {
      "NODE_ENV": "development"
    },
    "ext": "js,json,ts"
  }
```

Run the application with nodemon with complied javascript code.
```bash
npx nodemon dist/index.js
```

For simplified work, add the script under package.json
```json
"scripts": {
    "generate": "ts-node --transpile-only src/schema.ts",
    "build": "yarn run generate && tsc",
    "dev":"yarn run build && nodemon --config nodemon.json dist/index.js"
  },
```

Next, install Prisma (open source database toolkit and ORM)
```bash
yarn add prisma --save-dev
yarn add @prisma/client dotenv @types/dotenv
```

Install Prisma VSCode Extension

Initial Prisma
```bash
npx prisma init
```

Updating schema.prisma....

Setup DB Connection and User
(Ref: https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#shadow-database-user-permissions)
(Ref: https://dba.stackexchange.com/questions/33285/granting-a-user-account-permission-to-create-databases-in-postgresql)
```bash
createuser hacker_news_admin
psql
alter user hacker_news_admin with encrypted password '123456';
alter user hacker_news_admin createdb;
```

Update .env for new user and database
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://<user name>:<password>@localhost:5432/<database name>?schema=public"
```

Start the database migration
```bash
npx prisma migrate dev --name "init" 
```