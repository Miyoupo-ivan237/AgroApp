const adminMiddleware = (req, res, next) => {
    // This middleware assumes that the 'authenticate' middleware 
    // has already run and attached the 'user' object to 'req'.
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    
    return res.status(403).json({ error: 'Access Denied: Admin privileges required.' });
};

module.exports = adminMiddleware;
