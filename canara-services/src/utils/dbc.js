var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

module.exports = {
    dbConn: function(){
        var url = process.env.MONGO;
        return new Promise((resolve, reject)=>{
            MongoClient.connect(url,{useUnifiedTopology: true},(err, db) => {
                if (err) reject(err);
                var dbc = db.db(process.env.DB);
                resolve(dbc)
            }); 
        });
    }
}