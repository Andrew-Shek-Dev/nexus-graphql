import * as bcryptjs from 'bcryptjs';
const SLAT_ROUNDS = 10;

export async function hashPassword(plainPassword:string){
    return await bcryptjs.hash(plainPassword,SLAT_ROUNDS);
}

export async function checkPassword(plainPassword:string,hashPassword:string){
    return await bcryptjs.compare(plainPassword,hashPassword);
}