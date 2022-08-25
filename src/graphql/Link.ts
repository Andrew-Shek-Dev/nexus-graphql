import { Context } from '../context';
import {arg, enumType, extendType, inputObjectType, intArg, list, nonNull, objectType, stringArg} from 'nexus';
import { Prisma } from '@prisma/client';
//import { NexusGenObjects } from '../nexus-typegen';

export const Link = objectType({
    name:"Link",
    definition(builder){
        builder.nonNull.int("id");
        builder.nonNull.string("description");
        builder.nonNull.string("url");
        builder.field("postedBy",{
            type:"User",
            resolve(parent,_,context){
                return context.prisma.link.findUnique({where:{id:parent.id}}).postedBy()
            }
        });
        builder.nonNull.list.nonNull.field("voters",{
            type:"User",
            resolve(parent,args,context){
                return context.prisma.link.findUnique({where:{id:parent.id}}).voters();
            }
        });
    }
});

//Demo Purpose - Temporary Storage
// let links: NexusGenObjects["Link"]/*Link Interface*/[]/*Link[]*/= [
//     {
//         id: 1,
//         url: "www.howtographql.com",
//         description: "Fullstack tutorial for GraphQL",
//     },
//     {
//         id: 2,
//         url: "graphql.org",
//         description: "GraphQL official website",
//     },
// ];

//
export const LinkQuery = extendType({
    type:"Query",
    definition(builder){
        builder.nonNull.field("feed",{
            type:"Feed",
            args:{
                filter: stringArg(),
                skip:intArg(),
                take:intArg(),
                orderBy:arg({type:list(nonNull(LinkOrderByInput))})
            },
            async resolve(_,args,context:Context){
                const where = args.filter?{
                    OR:[
                        {description:{contains:args.filter}},
                        {url:{contains:args.filter}}
                    ]
                }:{};
                const links = context.prisma.link.findMany({
                    where,
                    skip:args?.skip as number | undefined,
                    take:args?.take as number | undefined,
                    orderBy:args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined
                });
                const count = await context.prisma.link.count({where});
                const id = `main-feed:${JSON.stringify(args)}`;
                return {
                    links,
                    count,
                    id
                }
            }
        });
    }
});

export const LinkOrderByInput = inputObjectType({
    name:"LinkOrderByInput",
    definition(builder) {
        builder.field("description",{type:Sort});
        builder.field("url",{type:Sort});
    },
});

export const Sort = enumType({
    name:"Sort",
    members:["asc","desc"]
})

export const Feed = objectType({
    name:"Feed",
    definition(builder){
        builder.nonNull.list.nonNull.field("links",{type:Link});
        builder.nonNull.int("count");
        builder.id("id");
    }
})

export const LinkMutation = extendType({
    type:"Mutation",
    definition(builder){
        builder.nonNull.field("post",{
          type:"Link",
          args:{
            description:nonNull(stringArg()),
            url:nonNull(stringArg())
          },
          resolve(parent,args,context:Context){
            const {description,url} = args;
            // let idCount = links.length + 1;
            // const link =  {
            //     id:idCount,
            //     description,
            //     url
            // };
            // links.push(link);
            const {userId} = context;
            if (!userId)
            {
                throw new Error("Cannot post without logging in.");
            }

            const newLink = context.prisma.link.create({
                data:{
                    description,
                    url,
                    postedBy:{
                        connect:{
                            id:userId
                        }
                    }
                }
            })
            return newLink;
          }
        })
    }
});