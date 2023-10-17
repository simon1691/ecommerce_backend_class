import { verifyJWT } from "../utils.js"


export const validateUser = async (req, res, next ) => {
    let user = verifyJWT(req.cookies['jwtCookieToken'])
    console.log(user)
    if (user && user.role === 'user') {
        return next()
    }
    return res.status(401).send({message: 'as Admin you do not have permission to access this resource'})
}

export const validateAdmin = async (req, res, next ) => {
    let user = verifyJWT(req.cookies['jwtCookieToken'])
    console.log(user)
    if (user && user.role === 'admin') {
        return next()
    }
    return res.status(401).send({message: 'as User you do not have permission to access this resource'})
}