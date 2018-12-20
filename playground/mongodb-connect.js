const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/teste-emiolo', (err,client) => {
    if(err){
       return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('teste-emiolo');

    // //inserting new object into table Users
    // db.collection('Users').insertOne({
    //     name: 'Gabriel Soares',
    //     age: 26,
    //     user: 'gsoares',
    //     pass: '123'
    // }, (err, result) => {
    //     if (err){
    //         return console.log('Unable to insert user ', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Fetching
    // db.collection('Users').find({ 
    //     _id: new ObjectID('5c1b9cdb057be0115efd6e29')
    // }).toArray().then((docs) => {
    //     console.log('Users');
    //     console.log(JSON.stringify(docs,undefined, 2));
    // }), (err) => {
    //     console.log('Unable to fetch users ', err);
    // }

    //Count
    db.collection('Users').find().count().then((count) => {
        console.log('Users: ', count);
    }), (err) => {
        console.log('Unable to fetch users ', err);
    }

  //  client.close();
});