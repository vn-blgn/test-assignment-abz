const jwt = require('jsonwebtoken');

exports.checkToken = async(req, res, next) => {
    try {
        if (req.url === '/' || req.url === '/registration') {
            next();
        } else {
            const token = req.cookies.token;
            const decodedData = jwt.verify(token, process.env.PRIVATEKEY);
            if (decodedData) {
                req.decodedData = decodedData;
                next();
            } else {
                res.status(403).redirect('/api');
            };
        };
    } catch (error) {
        console.log(error);
        res.redirect('/api');
    };
};