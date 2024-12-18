const dotenv = require("dotenv");
dotenv.config();
const envurl = process.env.ENV_URL;
const axios = require("axios");

async function updateAllWebsites(req, res, models) {
  try {
    // Fetch all websites
    const websites = await models.user_website.findAll();

    // Update each website
    const updates = websites.map(async (userWebsite) => {
      // Update template or any other fields necessary
      userWebsite.template_id = req.body.template; // Set new template for all websites
      // Additional updates can be added here if needed

      // Prepare data for external API request
      const jobs = await models.user_jobs.findOne({
        where: { user_id: userWebsite.user_id },
      });

      const hasJob = !!jobs;

      const gallery = await models.gallery.findAll({
        where: { user_id: userWebsite.user_id, is_favorite: true },
      });

      const hasGallery = gallery.length > 0;

      // Make external API request to update VPS
      await axios.put(
        `https://api.${envurl}/updateWebsite`,
        {
          id: userWebsite.id,
          newSubdomain: userWebsite.subdomain, // Assuming subdomain is not changing
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
          gallery_images: gallery ? gallery.map((g) => g.url) : null,
          website_id: userWebsite.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "secret-key": process.env.SECRET_KEY,
          },
        },
      );

      // Save updates to the database
      await userWebsite.save();
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    res.status(200).json({ message: "All websites updated successfully." });
  } catch (error) {
    console.error("Error updating websites:", error);
    res.status(500).json({ message: "Server Error" + error.message });
  }
}

module.exports = updateAllWebsites;
