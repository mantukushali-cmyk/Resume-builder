import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // 1. Check if header exists and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // 2. Extract the actual token (remove 'Bearer ')
        const token = authHeader.split(' ')[1];

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach userId to request object
        req.userId = decoded.userId;

        // 5. CRITICAL: Call next() to move to the controller
        next(); 
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

export default protect;