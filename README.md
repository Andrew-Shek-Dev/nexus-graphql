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