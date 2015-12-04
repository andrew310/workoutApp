var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({secret:'SuperSecretPassword'}));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//connect to database
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'test',
  password: 'default',
  database: 'test'
});



//set up the table
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workout", function(err){
    var createString = "CREATE TABLE workout(" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "reps INT," +
        "weight INT," +
        "workoutDate DATE," +
        "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      console.log("table reset");
      res.render('home',context);
    })
  });
});


//main page
app.get('/',function(req,res,next){
  var context = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }
  context.name = req.session.name;

  console.log(context.toDo);
  res.render('toDo',context);
});

app.post('/',function(req,res){
  var context = {};
  console.log(req.body)

  if(req.body['New List']){
    req.session.username = req.body.name;
  }

  context.username = req.session.username;
  //context.toDoCount = req.session.toDo.length;
  pool.query('SELECT * FROM workout', function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.results = rows;
    console.log(context);
    res.render('toDo', context);
  });
});


app.post('/addRow',function(req,res, next){
  res.type('text/plain');
  var context = {};
  console.log(req.body);
  pool.query("INSERT INTO workout (`name`, `reps`, `weight`, `workoutDate`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    //res.render('home',context);
    console.log("hi");

    req.body.id = result.insertId;
    console.log(req.body.id);
    res.send(req.body);
  });

});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
