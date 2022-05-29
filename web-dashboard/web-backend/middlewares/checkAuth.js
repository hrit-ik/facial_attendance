const {verify, sign} = require('jsonwebtoken');
const checkAuth = (req, res, next) => {
    console.log(req)
    const token = req.cookies['jwt'];
    console.log(token)
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const {id, username} = verify(token, process.env.JWT_SECRET);
        req.user = {id, username};
        next();
    } catch(err) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports = checkAuth;