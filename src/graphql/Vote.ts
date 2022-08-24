import { User } from "@prisma/client";
import { objectType,extendType,nonNull,intArg } from "nexus";

export const Vote = objectType({
    name:"Vote",
    definition(builder){
        builder.nonNull.field("link",{type:"Link"});
        builder.nonNull.field("user",{type:"User"});
    }
})

export const VoteMutation = extendType({
    type:"Mutation",
    definition(builder) {
        builder.field("vote",{
            type:"Vote",
            args:{
                linkId:nonNull(intArg())
            },
            async resolve(_,args,context) {
                const {userId} = context;
                const {linkId} = args;
                if (!userId){
                    throw new Error("Cannot vote without logging in.");
                }
                const link = await context.prisma.link.update({
                    where:{id:linkId},
                    data:{
                        voters:{
                            connect:{id:userId}//add user入去
                        }
                    }
                })

                const user = await context.prisma.user.findUnique({where:{id:userId}});//攞current user返嚟
                return {
                    link,
                    user:user as User
                };
            } 
        });
    },
});