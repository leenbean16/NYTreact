let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let mongoose = require("mongoose");
let Note = require("./models/Note.js");
let Article = require("./models/Article.js");
let request = require("request");
let cheerio = require("cheerio");

mongoose.Promise = Promise;

let app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.disable('etag');
app.use(express.static("public"));

// mongoose.connect("mongodb://heroku_8pl7k4vk:j9a7m1l1uvji9uulcbvjenu1nj@ds139899.mlab.com:39899/heroku_8pl7k4vk");
mongoose.connect('mongodb://localhost/nyt', { useMongoClient: true })
let db = mongoose.connection;

let http = require('http'); // For serving a basic web page.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
// let uristring =
//     process.env.MONGOLAB_URI ||
//     process.env.MONGOHQ_URL ||
//     'mongodb://heroku_8pl7k4vk:j9a7m1l1uvji9uulcbvjenu1nj@ds139899.mlab.com:39899/heroku_8pl7k4vk';

// The http server will listen to an appropriate port, or default to
// port 3000.
let PORT = process.env.PORT || 3007;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
// mongoose.connect(uristring, function(err, res) {
//     if (err) {
//         console.log('ERROR connecting to: ' + uristring + '. ' + err);
//     } else {
//         console.log('Succeeded connected to: ' + uristring);
//     }
// });

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});
let result = [];
app.get("/scrape", function(req, res) {

    request("https://www.nytimes.com/", function(error, response, html) {
        let $ = cheerio.load(html);

        $("article h2").each(function(i, element) {

            let newArt = {
                id: i,
                title: $(this).children("a").text(),
                link: $(this).children("a").attr("href")
            };
            result.push(newArt);
        });
        console.log("Scraped");
        console.log(result);

        res.send(result);
    });
});

// all json articles
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.send(doc);
            console.log(Article);
        }
    });
});


// find an article by id
app.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
        .populate("note")
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
});

// find a note by id
app.get("/articles/note/:id", function(req, res) {
    Note.findOne({ "_id": req.params.id })
        .populate("note")
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
});


// find an article
app.post("/articles/:id", function(req, res) {
    let newNote = new Note(req.body);
    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });

        }
    });
});


// saved articles
app.get("/savednotes", function(req, res) {
    db.collection('notes').save(req.body, (err, result) => {
        Note.find({})
            .populate("note")
            .exec(function(error, doc) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(doc);
                }
            });
    });
});


app.get("/articles/note/delete/:id" + function(req, res) {
    Note.findByIdAndRemove({ "_id": req.body.id }, function(err, newdoc) {
        if (err) {
            res.send(err);
        } else {
            res.send(newdoc);
        }
    });

});

// delete note



// connection
app.listen(3007, function() {
    console.log("App running on port 3007!");
});