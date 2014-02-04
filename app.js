
//module dependencies
var express = require('express')
  , http = require('http')
  , mysql = require('mysql')
  , path = require('path');
var app = express();
// all environments
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'dasdsdasdd56as5d56as6d4as564das' }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res) {
	res.render('index');
});
//connect to mysql database
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'nodedemo'
});
connection.connect();

	// create todo and send back all todos after creation
app.post("/api/facts", function (req, res) {
	var title = req.body.title,
	    content = req.body.content,
		author =req.body.author;
	connection.query('INSERT INTO facts (title, content, author) VALUES (? , ? , ?);', [title, content , author], function(err, docs) {
	if (err) res.json(err);
     res.send("Fact Inserted!");
	});
});

// Get all facts
app.get('/api/facts', function(req, res) {
	connection.query('select * from facts', function(err, docs) {
		if (err)
			res.send(err)
		res.json(docs);
		});
});

app.get("/Create", function (req, res) {
	res.render("new");
});
app.get("/home", function (req, res) {
	res.render("home");
});

app.delete('/api/facts/:id', function(req, res) {

		id = req.params.id;
		connection.query('DELETE FROM facts WHERE id="'+id+'"', function(err, docs) {
		if (err) res.json(err);
	     res.send("Fact deleted!");
		});

	});

app.put('/api/facts', function(req, res) {
	var title = req.body.title,
	    content = req.body.content,
		author =req.body.author,
		id = req.body.id;
		connection.query('UPDATE facts SET title = ?, content = ?, author = ? WHERE id = "'+id+'" ', [title, content , author], function(err, docs) {
		if (err) res.json(err);
	     res.send("Fact updated!");
		});
	});

app.post("/login", function (req, res) {
	var username=req.body.username,
		password=req.body.password;
	connection.query("SELECT * FROM users WHERE username = '"+ username +"' and password = '"+ password +"' limit 1", function(err, results) {
	if (err) throw err;
	if (results[0]) {
		        req.session.userInfo = results[0];
		        var username = req.session.userInfo.username;
                req.session.is_logged_in = true;
                res.redirect('/home');
            }
            else {
            	res.render("index",{ error:'Please enter valid details!' });
            }
	});
});

// Register new user and check if username already exist.
app.post("/signup", function (req, res) {
	var username=req.body.username,
		password=req.body.password,
	    email=req.body.email,
	    phone=req.body.phone,
	    location=req.body.location;
		connection.query("SELECT * FROM users WHERE username = '"+ username +"'", function(err, results) {
		if (err) throw err;
		if (results[0]) {
	              res.render("index",{ error_sign:'Username name already Exist!' });
	            }
	            else {
	               connection.query('INSERT INTO users (id,username, password, email, phone, location) VALUES (? , ? , ? , ? , ? , ? );', ['',username, password, email, phone, location], function(err, docs) {
				if (err) res.json(err);
			       res.redirect('/');
				 });
	         }
		});
});

// Logout user
app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.is_logged_in = false;
    req.session.destroy(function() {});
  }
  res.redirect('/');
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
