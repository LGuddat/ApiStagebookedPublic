const dotenv = require("dotenv");
dotenv.config();

const envurl = process.env.ENV_URL;
const axios = require("axios");

async function editWebsite(req, res, models) {
  try {
    if (req.body.subdomain == "" && !req.body.subdomain) {
      return res.status(400).json({ message: "Subdomain is required" });
    }
    let reqSubdomain = req.body.subdomain.toLowerCase();

    const userWebsite = await models.user_website.findOne({
      where: { user_id: req.body.user_id },
    });

    if (!userWebsite) {
      return res.status(404).json({ message: "Website not found in database" });
    }

    const oldSubdomain = userWebsite.subdomain;

    // Check if subdomain is being updated and is not a duplicate
    if (reqSubdomain && reqSubdomain !== oldSubdomain) {
      const response = await axios.get(
        `https://api.${envurl}/checkDuplicateSubdomain/${reqSubdomain}`,
        {
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 409,
          headers: {
            "secret-key": process.env.SECRET_KEY,
          },
        }
      );

      if (response.status === 409) {
        return res.status(409).json({ message: "Subdomain is a duplicate" });
      }

      // Update subdomain in the database
      userWebsite.subdomain = reqSubdomain;
    }

    // Update other fields as necessary
    userWebsite.title = req.body.title;
    userWebsite.template_id = req.body.template;
    userWebsite.spotify_url = req.body.spotify_url;
    userWebsite.facebook_url = req.body.facebook_url;
    userWebsite.instagram_url = req.body.instagram_url;
    userWebsite.ticketmaster_url = req.body.ticketmaster_url;
    userWebsite.booking_url = req.body.booking_url;
    userWebsite.contact_email = req.body.contact_email;
    userWebsite.phone_number = req.body.phone_number;
    userWebsite.description = req.body.description;
    userWebsite.has_description = req.body.has_description;

    const jobs = models.user_jobs.findOne({
      where: { user_id: req.body.user_id },
    });

    let hasJob;
    if (jobs) {
      hasJob = true;
    } else {
      hasJob = false;
    }

    const gallery = await models.gallery.findAll({
      where: { user_id: req.body.user_id, is_favorite: true },
    });

    console.log("gallery", gallery);

    let hasGallery = gallery.length > 0;

    await axios.put(
      `https://api.${envurl}/updateWebsite`,
      {
        id: userWebsite.id,
        oldSubdomain: oldSubdomain,
        newSubdomain: userWebsite.subdomain,
        title: userWebsite.title,
        imageUrl: userWebsite.image_url,
        user_id: userWebsite.user_id,
        template: userWebsite.template_id,
        spotify_url: userWebsite.spotify_url,
        facebook_url: userWebsite.facebook_url,
        instagram_url: userWebsite.instagram_url,
        ticketmaster_url: userWebsite.ticketmaster_url,
        booking_url: userWebsite.booking_url,
        contact_email: userWebsite.contact_email,
        phone_number: userWebsite.phone_number,
        description: userWebsite.description,
        has_description: userWebsite.has_description,
        hasJob: hasJob,
        hasGallery: hasGallery,
        gallery_images: gallery ? gallery : null,
        website_id: userWebsite.id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.SECRET_KEY,
        },
      }
    );

    await userWebsite.save();

    res.status(200).json(userWebsite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" + error.message });
  }
}

module.exports = editWebsite;
