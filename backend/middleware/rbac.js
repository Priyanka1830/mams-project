const jwt = require('jsonwebtoken');

// Role hierarchy enforcement
const checkRoleAndScope = (allowedRoles = [], enforceBaseCheck = true) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'UNAUTHORIZED: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_military_key_2026');
      req.user = decoded; // Contains { id, username, role, base_id }

      // 1. Role Verification
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'FORBIDDEN: Insufficient role permissions' });
      }

      // 2. Base Scope Boundary Check (Admins bypass)
      const targetBaseId = req.query.base_id || req.body.base_id;
      if (
        enforceBaseCheck && 
        decoded.role !== 'ADMIN' && 
        targetBaseId && 
        parseInt(targetBaseId, 10) !== decoded.base_id
      ) {
        return res.status(403).json({ 
          error: 'SCOPE_VIOLATION: Operations outside your assigned base are strictly forbidden' 
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'UNAUTHORIZED: Invalid token' });
    }
  };
};

module.exports = { checkRoleAndScope };