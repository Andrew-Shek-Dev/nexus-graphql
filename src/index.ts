import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import {schema} from './schema';
import { context } from './context';

const app = express();
app.use(compression());
app.use(cors());

const server = new ApolloServer({
    schema,
    context
});
const PORT = 4000;

server.start().then(() => {
    server.applyMiddleware({ path: "/", app });
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    })
});