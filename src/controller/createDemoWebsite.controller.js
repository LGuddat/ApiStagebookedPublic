const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const envurl = process.env.ENV_URL;

async function createDemoWebsite(req, res, models) {
  try {
    reqSubdomain = req.body.subdomain.toLowerCase();
    console.log("subdomain: ", reqSubdomain);
    console.log("body: ", req.body);

    let data = checkDuplicate(reqSubdomain);

    if (data.exists) {
      // assuming the response is { exists: true/false }
      reqSubdomain = reqSubdomain + "demo";
      let newData = checkDuplicate(reqSubdomain)

      if (newData.exists) {
        return res.status(409).json({ message: "Subdomain already exists" });
      } 
      
    } else {
      const website = await models.user_testsite.create({
        id: uuidv4(),
        subdomain: reqSubdomain,
        title: req.body.title,
        template: req.body.template,
      });

      await axios.post(
        `https://api.${envurl}/createDemoWebsite`,
        {
          subdomain: reqSubdomain,
          title: req.body.title,
          template: req.body.template,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "secret-key": process.env.SECRET_KEY,
          },
        }
      );

      res.status(201).json(website);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }

  async function checkDuplicate(reqSubdomain) {
    const response = await axios.get(
      `https://api.${envurl}/checkDuplicateSubdomain/${reqSubdomain}`,
      {
        headers: {
          "secret-key": process.env.SECRET_KEY,
        },
      }
    );

    return response.data;
  }
}
module.exports = createDemoWebsite;
