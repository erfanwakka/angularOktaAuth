import { Request, Response, NextFunction} from 'express';
export interface IGetUserAuthInfoRequest extends Request {
    user: { uid: any; email: any; } // or any other type
}
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
    clientId: '0oan7h66gLgXlvKKg4x6',
    issuer: 'https://dev-989080.okta.com'
});

export async function oktaAuth(req:IGetUserAuthInfoRequest, res:Response, next:NextFunction) {
    try {
        const token = (req as any).token;
        if (!token) {
            return res.status(401).send('Not Authorised');
        }
        const jwt = await oktaJwtVerifier.verifyAccessToken(token);
        req.user = {
            uid: jwt.claims.uid,
            email: jwt.claims.sub
        };
        next();
    }
    catch (err) {
        return res.status(401).send(err.message);
    }
}
