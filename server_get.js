const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://iqbalsingh:iqbal9988@cluster0.cpxazrb.mongodb.net";
const client = new MongoClient(uri);

let db;
let collection;

function connectToMongoDB() {
      try {
            client.connect();
            console.log("Connected to MongoDB");

            // Accessing database and collection
            db = client.db("Collection_Users"); // Use your correct database name here
            collection = db.collection("Users"); // Use your correct collection name here
      } catch (error) {
            console.error("Error connecting to MongoDB:", error);
      }
}

// Call the connect function when the server starts
connectToMongoDB();

const addTwoNumber = (n1, n2) => {
      return n1 + n2;
};

app.get("/addTwoNumber", (req, res) => {
      const n1 = parseInt(req.query.n1);
      const n2 = parseInt(req.query.n2);
      const result = addTwoNumber(n1, n2);
      res.json({ statusCode: 200, data: result });
});

// Sign up endpoint
app.post("/signup", async (req, res) => {
      if (!collection) {
            return res
                  .status(500)
                  .json({ message: "MongoDB connection not established" });
      }

      const { email, password } = req.body;

      try {
            // Check if user with the given email already exists
            const existingUser = await collection.findOne({ email });

            if (existingUser) {
                  // If user exists, check if the password matches
                  if (existingUser.password === password) {
                        res.json({
                              statusCode: 200,
                              message: "Welcome Back",
                        });
                  } else {
                        res.status(400).json({
                              statusCode: 400,
                              message: "Incorrect password",
                        });
                  }
            } else {
                  // If user does not exist, create a new user
                  const result = await collection.insertOne({
                        email,
                        password,
                  });
                  res.json({
                        statusCode: 200,
                        message: "User signed up successfully",
                        id: result.insertedId,
                  });
            }
      } catch (error) {
            console.error("Error signing up:", error);
            res.status(500).json({
                  statusCode: 500,
                  message: "Error signing up",
                  error: error.message,
            });
      }
});

// Get data endpoint
app.get("/getData", (req, res) => {
      if (!collection) {
            return res
                  .status(500)
                  .json({ message: "MongoDB connection not established" });
      }
      collection
            .find({})
            .toArray()
            .then((documents) => {
                  // console.log("Documents fetched:", documents);
                  res.json({ statusCode: 200, data: documents });
            })
            .catch((error) => {
                  console.error("Error fetching documents:", error);
                  res.status(500).json({
                        statusCode: 500,
                        message: "Error fetching documents",
                        error: error.message,
                  });
            });
});

// Display HTML content
app.get("/Display", (req, res) => {
      const n1 = "<html><body><H1>HELLO THERE </H1></body></html>";
      res.set("Content-Type", "text/html");
      res.send(Buffer.from(n1));
});

console.log(addTwoNumber(19, 12));
const port = 3040;
app.listen(port, () => {
      console.log("Server is listening on port " + port);
});

//http://localhost:3040/addTwoNumber?n1=19&n2=12
