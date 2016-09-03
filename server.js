var MongoClient = require('mongodb').MongoClient;
var co = require('co');
var assert = require('assert');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var swig = require('swig');
var path = require('path');
var io   = require('socket.io')(server);
var url = 'mongodb://admin:admin@ds019956.mlab.com:19956/todo_db';

//function select() {
const todos = co(function*() {
	  // Connection URL
	  var db = yield MongoClient.connect(url);
	  console.log("Connected correctly to server");

	  // Get the collection
	  var col = db.collection('todos');
	  // Insert a single document
	  //var r = yield col.insertMany([{a:1}, {a:1}, {a:1}]);
	  //assert.equal(3, r.insertedCount);

	  // Get first two documents that match the query
	  var docs = yield col.find().limit(2).toArray();
	  assert.equal(2, docs.length);
	  console.log(docs);
	  db.close();

   	 return docs;

	}).catch(function(err) {
	  console.log(err.stack);
	});
	
	
    //}

//const todos = select();

console.log(todos);

io.on('connection', function(socket) {
			
	socket.emit('select', todos );
	socket.on('client event', function (data) {
	  console.log(data);
	});
	socket.on("todo", data => {
		//var mData = jsonToMap(data);
		console.log(data);	
		console.log(data['id']);		
		//console.log(mData.get('id') + " , " + mData.get('text'));
	//	console.log("id: " + data.get('id') + " text: " + data.get('text')); 
	 
	
        /*
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully");
		db.close();
		});*/
/*
	co(function*() {
		var db = yield MongoClient.connect('mongodb://admin:admin@ds019956.mlab.com:19956/todo_db');
		console.log("Connected correctly to server");

		
		var r = db.collection('todos').insertOne({
			a:1, 
			b: function() { return 'hello'; } }, 
			{ w: 'majority', 
			  wtimeout: 1000,
			  serializeFunctions: true, 
			  forceServerObjectId: true });
					
			assert.equal(1, r.insertedCount);
			db.close();
		}).catch(function(err){
			console.log(err.stack);
		});*/

		co(function*() {
		  // Connection URL
		  var db = yield MongoClient.connect(url);
		  console.log("Connected correctly to server");

		  // Insert a single document
		  var r = yield db.collection('todos').insertOne(data
								/*{
			id: data['id']
		      , text: data['text']
		    }*/, {
			w: 'majority'
		      , wtimeout: 10000
		      , serializeFunctions: true
		      , forceServerObjectId: true
		    });

		  assert.equal(1, r.insertedCount);
		  db.close();
		}).catch(function(err) {
		  console.log(err.stack);
		});
	});
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');

server.listen(8080);
app.use(express.static(path.join(__dirname, 'client')));

/*
app.get('/', function(req, res) {
	res.render('index');
});*/


