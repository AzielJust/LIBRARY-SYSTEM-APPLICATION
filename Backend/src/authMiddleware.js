import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import {getUserById} from '../controllers/user.controller.js'
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({success:false, message: "No Token Provided"});
    }
    
    try {
        const data = jwt.verify(authHeader, config.jwtSecret);
        const user = await getUserById(data.id); 
        
        if (!user) {
            return res.status(401).json({success:false, message: "User not found"});
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({success:false, message: "Invalid Token"});
    }
    
}

export default authMiddleware;