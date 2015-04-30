var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    app = express(),
    server = http.createServer(app).listen(3000),
    socketIO = require("socket.io"),
    io = socketIO(server);

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

// http.createServer(app).listen(3000);


io.on('connection', function(socket) { // client connected
    console.log("user connected");
    socket.on("disconnect", function() { // client disconnected
        console.log("user disconnected");
    });

    socket.on("addToDo", function(content) { // recieve data from client
        socket.broadcast.emit("add", content);
        console.log(" a ToDo item is added");
    });
});


app.get("/todos.json", function(req, res) {
    ToDo.find({}, function(err, toDos) {
        res.json(toDos);
    });
});

app.post("/todos", function(req, res) {
    console.log(req.body);
    var newToDo = new ToDo({
        "description": req.body.description,
        "tags": req.body.tags
    });
    newToDo.save(function(err, result) {
        if (err !== null) {
            // the element did not get saved!
            console.log(err);
            res.send("ERROR");
        } else {
            // our client expects *all* of the todo items to be returned, so we'll do
            // an additional request to maintain compatibility
            ToDo.find({}, function(err, result) {
                if (err !== null) {
                    // the element did not get saved!
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});

// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */