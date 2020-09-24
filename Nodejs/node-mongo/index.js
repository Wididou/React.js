const MongoClient = require('mongodb').MongoClient; //to connect to mongo-db server
const assert = require('assert');

const url = 'mongodb://localhost:27017/'; //url where mongo db server is accessed
const dbname = 'conFusion'; //
const dboper = require('./operations');

MongoClient.connect(url, (err, client) => { //callback function
    assert.equal(err,null);
    console.log('Connected correctly to server');

    const db = client.db(dbname);
    //const collection = db.collection("dishes");

    dboper.insertDocument(db, { name: "Vadonut", description: "Test"}, "dishes", (result) => {
        console.log("Insert Document:\n", result.ops);

        dboper.findDocuments(db, "dishes", (docs) => {
            console.log("Found Documents:\n", docs);

            dboper.updateDocument(db,{name: "Vadonut"},{description: "Updated Test"},"dishes",
                (result) => {
                    console.log("Updated Document:\n", result.result);

                    dboper.findDocuments(db, "dishes", (docs) => {
                        console.log("Found Updated Documents:\n", docs);
                        
                        db.dropCollection("dishes", (result) => {
                            console.log("Dropped Collection: ", result);

                            client.close();
                        });
                    });
                });
        });
    });
    /*collection.insertOne({"name": "Uthappizza", "description": "test"}, (err, result) => {
        assert.equal(err,null);

        console.log("After Insert:\n");
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => { //documents
            assert.equal(err,null);
            
            console.log("Found:\n");
            console.log(docs);

            db.dropCollection("dishes", (err, result) => {
                assert.equal(err,null);
                client.close();
            });
        });
    });
    */
});