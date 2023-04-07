const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akmwf4e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
async function run() {
  try {
    await client.connect();
    const eventBlogsCollection = client.db("Uiu").collection("EventBlogs");
    const recentEventsCollection = client.db("Uiu").collection("RecentEvents");
    const upcomingEventsCollection = client
      .db("Uiu")
      .collection("UpcomingEvents");
    const EventRegistrationCollection = client
      .db("Uiu")
      .collection("EventRegistration");

    // Get EventBlogs here
    app.get("/eventblogs", async (req, res) => {
      const quary = {};
      const cursor = eventBlogsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get All Recent Event
    app.get("/recentEvents", async (req, res) => {
      const quary = {};
      const cursor = recentEventsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get All Upcoming Events
    app.get("/upcomingEvents", async (req, res) => {
      const quary = {};
      const cursor = upcomingEventsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/eventRegistration", async (req, res) => {
      const quary = req.body;
      const registration = await EventRegistrationCollection.insertOne(quary);
      res.send(registration);
    });
    app.get("/eventRegistration", async (req, res) => {
      const quary = {};
      const cursor = EventRegistrationCollection.find(quary);
      const reg = await cursor.toArray();
      res.send(reg);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From UIU club and Forum ..!");
});

app.listen(port, () => {
  console.log(`UIU Club Forum listening on port ${port}`);
});
