var MongoClient = require('mongodb').MongoClient;

module.exports = {
    dbConn: function(){
        var url = 'mongodb://localhost:27017';
        return new Promise((resolve, reject)=>{
            MongoClient.connect(url,{useUnifiedTopology: true},(err, db) => {
                if (err) reject(err);
                var dbc = db.db("canara-bank-localization");
                resolve(dbc)
            }); 
        });
    }
}