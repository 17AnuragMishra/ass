  const jwt = require('jsonwebtoken');

  const authMiddleware = (req, res, next) => {
    try {
      // Check for token in the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
      }

      // Extract token
      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId }; // Attach user ID to request

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
  };

  module.exports = authMiddleware;
