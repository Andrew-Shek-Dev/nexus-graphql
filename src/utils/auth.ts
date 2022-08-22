import {Request} from 'express';
import {Bearer} from 'permit';
import jwtSimple from 'jwt-simple';

export interface AuthPayload{
    //userId:number
    id:number
}

export const permit = new Bearer({
    query:"access_token"
})

export function loginGuard(req:Request):AuthPayload{
    const token = permit.check(req);
    if (!token){
        throw new Error("No token found");
    }
    return jwtSimple.decode(token,"tecky-test-key") as AuthPayload;
}