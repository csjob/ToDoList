// mongodb connections
const mongoClient = require('mongodb').MongoClient;

//object creation for status
const status = {
    db: null,
}

module.exports.connect = function(done) {
    const url = 'mongodb://localhost:27017/';
    const dbName = 'todolist';

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err);
        status.db = data.db(dbName);
        done();
    
    })
   
}

module.exports.getDb = function() {
    return status.db;
}