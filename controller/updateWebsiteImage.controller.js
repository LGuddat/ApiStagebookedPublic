const dotenv = require("dotenv");
dotenv.config();

const envurl = process.env.ENV_URL;

const axios = require("axios");

async function updateWebsiteImage(req, res, models) {
  try {
    const subdomainRecord = await models.user_website.findOne({
      where: {
        user_id: req.body.userId,
      },
    });

    const subdomain = subdomainRecord.dataValues.subdomain;

    const url = `https://api.${envurl}/checkDuplicateSubdomain/${subdomain}`;
    const response = await axios.get(url, {
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 409;
      },
    });

    if (response.status === 409) {
      // assuming the response is { exists: true/false }


      await axios.put(
        `https://api.${envurl}/updateImageUrl`,
        {
          subdomain: subdomain,
          imageUrl: req.body.imageUrl,
          mobile_image_url: req.body.mobile_image_url
        },
        {
          headers: {
            "Content-Type": "application/json",
            "secret-key": process.env.SECRET_KEY,
          },
        }
      );

      const reqbody =
      {
        image_url: req.body.imageUrl,
      }

      if (mobile_image_url) {
        reqbody.mobile_image_url = mobile_image_url
      }

      models.user_website.update(
      reqbody,
        {
          where: {
            user_id: req.body.userId,
          },
        }
      );

      res.status(200).json("Image updated");
    } else {
      return res
        .status(404)
        .json({ message: "Subdomain doesn't exist in droplet" });
    }
  } catch (error) {
    console.error(
      `Request failed with status: ${error.response?.status}, response: ${error.response?.data}`
    );
    console.error(error.message);
    console.error(`Request failed with status: ${error.response?.status}, response: ${error.response?.data}`);
  }
}
module.exports = updateWebsiteImage;
