import {objectType} from 'nexus';
import { Context } from '../context';

export const User = objectType({
    name:"User",
    definition(builder){
        builder.nonNull.int("id");
        builder.nonNull.string("name");
        builder.nonNull.string("email");
        builder.nonNull.list.nonNull.field("links",{
            type:"Link",
            resolve(parent,args,context:Context){
                return context.prisma.user.findUnique({where:{id:parent.id}}).links();
            }
        })
        builder.nonNull.list.nonNull.field("votes",{
            type:"Link",
            resolve(parent,args,context){
                const {userId} = context;
                return context.prisma.user.findUnique({where:{id:userId}}).votes();
            }
        })
    }
})