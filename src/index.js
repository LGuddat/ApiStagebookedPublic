const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");

const cors = require("cors");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const PORT = 3000;

//Clerk authentication
const {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
} = require("@clerk/clerk-sdk-node");

//Private authentication
const privateAuth = require("./middleware/privateAuth.js");

//Import functions from controller
const addJob = require("./controller/addJob.controller.js");
const getJobsByWebsiteId = require("./controller/getJobById.controller.js");
const editJob = require("./controller/editJob.controller.js");
const deleteJob = require("./controller/deleteJob.controller.js");
const buildHtmlList = require("./controller/buildHtmlList.controller.js");
const getWebsiteImage = require("./controller/getWebsiteImage.controller.js");
const deleteUser = require("./controller/deleteUser.controller.js");
const updateUserSteps = require("./controller/updateUserSteps.controller.js");
const contactForm = require("./controller/contactForm.controller.js");
const newUser = require("./controller/newUser.controller.js");
const uploadGalleryImage = require("./controller/uploadGalleryImage.controller.js");
const getGalleryImages = require("./controller/getGalleryImages.controller.js");
const deleteGalleryImage = require("./controller/deleteGalleryImage.controller.js");
const getAllJobsByWebsiteId = require("./controller/getAllJobsById.controller.js");

// 1. Import sequelize connection and model initialization function
const sequelize = require("./models/connect"); // Adjust this path
const initModels = require("./models/init-models.js"); // Adjust this path

// 2. Initialize your models
const models = initModels(sequelize);

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://stagebooked.com",
      "https://www.stagebooked.com",
      "https://stagebooked.com/",
      "https://www.stagebooked.com/",
      "http://localhost:5500",
      "http://178.128.196.37",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
    ];

    if (
      !origin ||
      whitelist.indexOf(origin) !== -1 ||
      /https?:\/\/.*\.stagebooked\.com$/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.log(`Access denied to IP: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jobs/:website_id?", async (req, res) => {
  getJobsByWebsiteId(req, res, models);
});

app.get("/allJobs/:website_id?", async (req, res) => {
  getAllJobsByWebsiteId(req, res, models);
});

app.get("/htmlJobs/:id", async (req, res) => {
  buildHtmlList(req, res, models);
});

app.post("/addJob", async (req, res) => {
  addJob(req, res, models);
});

app.put("/updateJob", async (req, res) => {
  editJob(req, res, models);
});

app.delete("/deleteJob", async (req, res) => {
  deleteJob(req, res, models);
});

app.get("/getWebsiteImage/:userId", async (req, res) => {
  getWebsiteImage(req, res, models);
});

app.post("/deleteUser", privateAuth, async (req, res) => {
  deleteUser(req, res, models);
});

app.post("/userStepsUpdate", async (req, res) => {
  updateUserSteps(req, res, models);
});

app.post("/contact", async (req, res) => {
  contactForm(req, res, models);
});

app.post("/newUser", async (req, res) => {
  newUser(req, res, models);
});

app.post("/uploadGalleryImage", async (req, res) => {
  uploadGalleryImage(req, res, models);
});

app.get("/getGalleryImages/:userId", async (req, res) => {
  getGalleryImages(req, res, models);
});

app.delete("/deleteGalleryImage", async (req, res) => {
  deleteGalleryImage(req, res, models, cloudinary);
});

app.post("/domainRequest", async (req, res) => {
  try {
    console.log("request body", req.body);
    const { domain, user_id, email } = await req.body;

    const response = await models.domainrequest.create({
      domain: domain,
      user_id: user_id,
      email: email,
    });

    console.log(response);

    if (!response) {
      return res.status(400).json({ message: "Domain request failed" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.use("/droplet", require("./routes/droplet.js"));

app.use("/payment", ClerkExpressWithAuth, require("./routes/payment.js"));

app.use("/domain", require("./routes/domain.js"));

app.use("/links", require("./routes/links.js"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
