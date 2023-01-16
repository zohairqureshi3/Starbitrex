const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("token")
        if (!token) return res.status(403).send("Access denied.");
        const bearer = token.split(' ')
        const bearerToken = bearer[1]
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};