import {extendType, nonNull, objectType, stringArg} from 'nexus';
import { resolve } from 'path';

export const AuthPayload = objectType({
    name:"AuthPayload",
    definition(builder){
        builder.nonNull.string("token");
        builder.nonNull.field("user",{
            type:"User"
        })
    }
});

export const AuthMutation = extendType({
    type:"Mutation",
    definition(builder){
        builder.nonNull.field("signup",{
            type:"AuthPayload",
            args:{
                email:nonNull(stringArg()),
                password:nonNull(stringArg()),
                name:nonNull(stringArg())
            },
            async resolve(parent,args,context){
                const {email,name} = args;
                //hash password
                const user = await context.prisma.user.create({
                    data:{email,name,password}
                })
            }
        })
    }
})