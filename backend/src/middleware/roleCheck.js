const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access only' });
    }
    next();
};

const isStoreOwner = (req, res, next) => {
    if (req.user.role !== 'store_owner') {
        return res.status(403).json({ message: 'Store Owner access only' });
    }
    next();
};

module.exports = { isAdmin, isStoreOwner };