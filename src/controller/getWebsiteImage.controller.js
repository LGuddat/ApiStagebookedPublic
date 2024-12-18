async function getWebsiteImage(req, res, models) {
  try {
    const { userId } = req.params;
    const website = await models.user_website.findOne({
      where: { user_id: userId },
    });
    if (website) {
      res.status(200).send(website.image_url);
    } else {
      res.status(404).json({ message: "Website not found in database" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" + error.message });
  }
}

module.exports = getWebsiteImage;
