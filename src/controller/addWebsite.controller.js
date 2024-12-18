const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

async function addWebsite(req, res, models) {
  try {
    let subdomain = req.body.subdomain;

    if (subdomain == "" || !subdomain) {
      return res.status(400).json({ message: "Subdomain is required" });
    }

    subdomain = subdomain.toLowerCase();

    const forbiddenWords = [
      "stagebooked",
      "www",
      "http",
      "https",
      "api",
      "admin",
      "dashboard",
      "backend",
      "image",
      "images",
      "betaling",
      "payment",
      "payments",
      "checkout",
    ];

    //error handling for all special characters
    if (subdomain.match(/[^a-zA-Z0-9-]/g)) {
      return res
        .status(400)
        .json({ message: "Subdomain cannot contain special characters" });
    }

    //Error handling of non english characters
    if (subdomain.match(/[^\x00-\x7F]+/g)) {
      return res
        .status(400)
        .json({ message: "Subdomain cannot contain non english characters" });
    }

    //Error handling for spaces
    if (subdomain.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Subdomain cannot contain spaces" });
    }

    //Error handling for length
    if (subdomain.length > 25) {
      return res
        .status(400)
        .json({ message: "Subdomain cannot be longer than 25 characters" });
    }

    //Error handling for forbidden words
    for (const word of forbiddenWords) {
      if (subdomain.includes(word)) {
        return res
          .status(400)
          .json({ message: `Subdomain cannot contain the word '${word}'` });
      }
    }

    let reqSubdomain = subdomain.toLowerCase();
    const response = await axios.get(
      `https://api.stagebooked.com/checkDuplicateSubdomain/${reqSubdomain}`,
      {
        headers: {
          "secret-key": process.env.SECRET_KEY,
        },
      }
    );
    const data = response.data;

    if (data.exists) {
      return res.status(409).json({ message: "Subdomain already exists" });
    } else {
      const website = {
        id: uuidv4(),
        subdomain: reqSubdomain,
        title: req.body.title,
        user_id: req.body.user_id,
        template_id: req.body.template_id,
        spotify_url: "",
        facebook_url: "",
        instagram_url: "",
        ticketmaster_url: "",
        image_url: req.body.image_url || "",
        booking_url: "",
        contact_email: req.body.contact_email || "",
      };

      await axios
        .post(
          `https://api.stagebooked.com/createWebsite`,
          {
            subdomain: website.subdomain,
            title: website.title,
            userId: website.user_id,
            template: website.template_id,
            websiteId: website.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "secret-key": process.env.SECRET_KEY,
            },
          }
        )
        .then(async () => {
          const websiteResponse = await models.user_website.create(website);
          res.status(201).json(websiteResponse);
        })
        .catch((error) => {
          console.error(error.message);
          res
            .status(500)
            .json({ message: "Server Error with adding to database" });
        });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { addWebsite };
