import { Context } from '../context';
import {extendType, nonNull, objectType, stringArg} from 'nexus';
import { NexusGenObjects } from '../nexus-typegen';

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
        builder.nonNull.list.nonNull.field("feed",{
            type:"Link",
            resolve(parent,args,context:Context){
                return context.prisma.link.findMany();
            }
        })
    }
});

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
            const newLink = context.prisma.link.create({
                data:{description,url}
            })
            return newLink;
          }
        })
    }
});