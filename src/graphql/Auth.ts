import {extendType, nonNull, objectType, stringArg} from 'nexus';
import { hashPassword } from '../hash';
import jwtSimple from 'jwt-simple';
import {checkPassword} from '../hash';

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
    type: "Mutation",
    definition(builder) {
        builder.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                name: nonNull(stringArg())
            },
            async resolve(_, args, context) {
                const { email, name } = args;
                const password = await hashPassword(args.password);
                const user = await context.prisma.user.create({
                    data: { email, name, password }
                })
                const token = await jwtSimple.encode({ email, name }, "tecky-test-key");
                return { token, user };
            }
        })
        builder.nonNull.field("login",{
            type:"AuthPayload",
            args:{
                email:nonNull(stringArg()),
                password:nonNull(stringArg())
            },
           async resolve(_,args,context){
            const user = await context.prisma.user.findUnique({where:{email:args.email}});
            if (!user){
                throw new Error("No such user found")
            }
            const valid = await checkPassword(args.password,user.password);
            
            if (!valid){
                throw new Error("Invalid Error");
            }

            const token = jwtSimple.encode({id:user.id},"tecky-test-key");
            return {token,user};
           }
        })
    }
})