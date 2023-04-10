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
        const userCollection = client.db("Uiu").collection("profile");
        const AnnouncmentCollection = client
          .db("Uiu")
          .collection("Announcment");
        const BlogCollection = client.db("Uiu").collection("blogs");
        const FaqCollection = client.db("Uiu").collection("Faq");

    
    
    // start


    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
    });

    app.put("/user/update/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: userInfo,
      };
      const result = await userCollection.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    // Blog Section

    app.post("/blog", async (req, res) => {
      const query = req.body;
      const blogPost = await BlogCollection.insertOne(query);
      res.send(blogPost);
    });

    app.get("/myBlog", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = BlogCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // FaQ Section

    app.post("/faq", async (req, res) => {
      const query = req.body;
      const faqPost = await FaqCollection.insertOne(query);
      res.send(faqPost);
    });

    app.get("/myfaq", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = FaqCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // announcment

    app.post("/announcment", async (req, res) => {
      const query = req.body;
      const announcment = await AnnouncmentCollection.insertOne(query);
      res.send(announcment);
    });

    app.get("/myAnnouncment", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = AnnouncmentCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // Payment System

    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;
      // console.log(service)
      const price = service.amount;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });




    // end
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
