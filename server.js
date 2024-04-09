var express = require("express")
var app = express()
let port = process.env.port || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://shravanreddypulagam:qGUA8Y5YvP6BTH0h@cluster0.gpqpvno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let collection;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function runDB() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        collection = client.db().collection('data');
        console.log(collection);
    } catch (ex) {
        console.error(ex);
    }
}
async function postCard(card) {
    try {
        const result = await collection.insertOne(card);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function getAllCards() {
    try {
        const cats = await collection.find({}).toArray();
        return cats;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/api/card', async (req, res) => {
    try {
        const card = req.body;
        const result = await postCard(card);
        res.json({ statusCode: 201, data: result, message: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
});



app.get('/api/cards', async (req, res) => {
    try {
        const result = await getAllCards();
        res.json({ statusCode: 200, data: result, message: 'get all cards successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log('express server started');
    runDB();
});

