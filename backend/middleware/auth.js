const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try {
        next();
        const token = req.headers.authorization.split(' ') [1];
        const decodedToken = jwt.verify(token, '8uVGAuQuD7b2zmWzi0kgTJOSEHfZrIitUMDdjBUr1n_ZBHwV8CU_sgE8UrsBUVvzw8jWPe9p3kVDtekcUemA9WhmPlmR4HTMOKFCP-4bTeX4Un1cPET9kLLzIMUdieZV6lqKx8oxKflcp0UT86hK3T2IPqpAdA8');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
          
        }
    } catch(error){
        res.status(401).json({ error: error || 'Requête non authentifiée !'});
    }
};