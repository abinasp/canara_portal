const jwt = require('jsonwebtoken');
const JWT_SECRET = "THIS IS MY JWT SECRET"

module.exports={
    generateToken: function(user){
        return jwt.sign({
            data: user
        },JWT_SECRET);
    },

    isValidToken: function(){
        return (req,res,next) => {
            try{
                const { access_token } = req.headers;
                if(!access_token){
                    throw new Error('Header is not present');
                }
                const decode = jwt.verify(access_token, JWT_SECRET);
                if(!decode){
                    throw new Error("Invalid user");
                }
                req.body.user = decode.data;
                next()
            }catch(error){
                console.log(error);
                res.json({
                    success: false,
                    message: "Auth failed",
                    error: error.message
                })
            }
        }
    }
}