const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.PRIVATE_SECRET_KEY;

const privateAuth = (req, res, next) => {
    const secretKeyHeader  = req.headers['secret-key'];

    if (secretKeyHeader === secretKey) {
        // Secret key matches, proceed to the next middleware
        next();
    } else {
        // Secret key does not match, return unauthorized status
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = privateAuth;
