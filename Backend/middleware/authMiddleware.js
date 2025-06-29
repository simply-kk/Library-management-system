const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = (role) => async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized. Please log in." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) return res.status(404).json({ message: "User not found." });
        if (user.role !== role) return res.status(403).json({ message: `Access denied. Requires ${role} role.` });

        req.user = user; // This is crucial - make sure this line exists
        next();
    } catch (error) {
        // ... error handling
    }
};

module.exports = { protect };