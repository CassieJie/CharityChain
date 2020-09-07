// 数据库操作
var MongoClient = require('mongodb').MongoClient;
// var  DbUrl = 'mongodb://localhost:27017/';
var  DbUrl = 'mongodb://xjmongodbaccount:CyaHvbFvJDMtbbDGvHBKiuHof09OEVCKt3tImpbPeb47XygM0qam4mx4EiW8iue91JElMAvfbCLzFCaBXuyvcg==@xjmongodbaccount.documents.azure.com:10255/mean-dev?ssl=true&sslverifycertificate=false'
var dbName = 'Accounts';


function __connectDb(callback){
    MongoClient.connect(DbUrl,{useNewUrlParser: true },function (err,client) {
        if(err){
            console.log('Connect database failed');
            return;
        }else{
            console.log('Connect database succeed');
            var db = client.db(dbName);
        }
        callback(db,client);
    })
}


// 暴露CaseID
// exports.CaseID=CaseID;

//数据库查找
/*
Db.find('engineer',{},function(err,data){

})
*/

exports.find = function(collectionname,json,callback) {

    __connectDb(function (db, client) {
        var result = db.collection(collectionname).find(json);
        result.toArray(function (error, data) {

            callback(error, data);
            client.close();
        })
    })
}

exports.findSort = function(collectionname,callback) {

    __connectDb(function (db, client) {
        var result = db.collection(collectionname).find().sort({sortDate:-1});
        result.toArray(function (error, data) {

            callback(error, data);
            client.close();
        })
    })
}


//增加数据
exports.insert = function(collectionname,json,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).insertOne(json,function(error,data){
            callback(error,data);
            client.close();
        })
    })
}

//修改数据
exports.update = function(collectionname,json1,json2,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){
            callback(error,data);
            client.close();
        })
    })
}


//删除数据
exports.deleteOne = function(collectionname,json,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).deleteOne(json,function(error,data){
            callback(error,data);
            client.close();
        })
    })
}