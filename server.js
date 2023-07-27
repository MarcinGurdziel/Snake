const express = require("express");
const path = require("path");
const app = express();
const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");
const client = new MongoClient(uri);
const dbname = "Snake";
const collectionName = "Scores";
const accountCollection = client.db(dbname).collection(collectionName);
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log (`Connected to the ${dbname} database`);
  } catch (error) {
    console.log (error);
  }
};

app.get("/", (req, res) => {
  let usersData = [];
  const main = async () => {
    try {
      await connectToDatabase();
      let result = await accountCollection.find({});
      await result.forEach((doc) => usersData.push(doc));
      const sortedData = usersData.sort((a, b) => b.score - a.score);
      res.render("index", { data: sortedData });
    } catch (error) {
      console.log (error);
    } finally {
      await client.close();
    }
  };
  main();
});

app.post("/", (req, res) => {
  const newScore = {
    score: req.body.score,
    name: req.body.name,
  };
  const main = async () => {
    try {
      await connectToDatabase();
      let result = await accountCollection.insertOne(newScore);
      let result1 = await accountCollection.find({});
    } catch (error) {
      console.log (error);
    } finally {
      await client.close();
    }
  };
  main();
});

app.all("*", (req, res) => {
  res.status(404).send("<h1>404 Page not found</h1>");
});

app.listen(port, () => {
  console.log ("Server is listening on http://localhost:" + port + "/");
});
