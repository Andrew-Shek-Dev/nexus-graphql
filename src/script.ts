import {PrismaClient} from '@prisma/client';

const client = new PrismaClient();

(async()=>{
    
        const newLink = await client.link.create({
            data:{
                description:'Fullstack tutorial for GraphQL',
                url:"www.howtographql.com"
            }
        })
    const allLinks = await client.link.findMany();
    console.log(allLinks);

    await client.$disconnect();
})();