import {makeSchema} from 'nexus';
import { join } from 'path';
import * as types from './graphql';

export const schema = makeSchema({
    types,
    outputs:{
        //Ref : https://nexusjs.org/docs/adoption-guides/nextjs-users#sdl-and-type-generation
        //For typical project __dirname is no problem
        // schema: join(__dirname,"schema.graphql"),
        // typegen:join(__dirname,"nexus-typegen.ts")
        //For Next.js project, __dirname is used in specific usage, so process.cwd() replace it
        schema: join(process.cwd(),"src/schema.graphql"),
        typegen:join(process.cwd(),"src/nexus-typegen.ts")
    },
    contextType:{
        module:join(process.cwd(),"src/context.ts"),
        export:"Context"
    }
});