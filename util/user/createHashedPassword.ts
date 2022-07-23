import {randomBytes, pbkdf2} from 'crypto';


const createHasedPassword =  (password : string, dbSalt? : string) =>{
    try{
        let salt : string;
        if(dbSalt) salt = dbSalt;
        else salt = randomBytes(64).toString('base64');
        return new Promise((resolve,reject)=>
            pbkdf2(password,salt,9999,64,'sha512',(err,key)=>{
            if(err) reject(err)
             resolve({password : key.toString('base64'), salt})
        }))
        }catch(err){
            console.log(err)
    }
}

export default createHasedPassword;