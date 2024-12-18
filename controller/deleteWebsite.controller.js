const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const envurl = process.env.ENV_URL;

const axios = require("axios");

async function addWebsite(req, res, models) {
  try {
    if (req.body.subdomain == "" && !req.body.subdomain) {
      return res.status(400).json({ message: "Subdomain is required" });
    }

    let reqSubdomain = req.body.subdomain.toLowerCase();
    const response = await axios.get(
      `https://api.${envurl}/checkDuplicateSubdomain/${reqSubdomain}`,
      {
        headers: {
          "secret-key": process.env.SECRET_KEY,
        },
      }
    );
    const data = response.data;

    if (!data.exists) {
      // assuming the response is { exists: true/false }
      return res.status(404).json({ message: "Subdomain doesn't exist" });
    } else {
      const website = await models.user_website.destroy({
        where: {
          subdomain: reqSubdomain,
          user_id: req.body.user_id,
        },
      });

      await axios.delete(`https://api.${envurl}/deleteWebsite`, {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.SECRET_KEY,
        },
        data: {
          subdomain: website.subdomain,
        },
      });

      res.status(201).json(website);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
module.exports = addWebsite;
