import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import {Request} from 'express';
import { loginGuard } from "./utils/auth";

export interface Context {
    prisma:PrismaClient
    userId?:number
}

export const context=({req}:{req:Request}):Context=>{
    const token = req && req.headers.authorization?loginGuard(req):null
    return {
        prisma
        userId:token?.userId
    }
};