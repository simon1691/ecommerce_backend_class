import {fileURLToPath} from 'url';
import { dirname } from 'path';

import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// encriptacion de password
export const createHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const isValidPassword = (user,pass) => {
    console.log(user.password, pass)
    return bcrypt.compareSync(pass, user.password)
}

export default __dirname;