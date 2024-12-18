async function getGalleryImages(req, res, models) {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    userId = req.params.userId;
    const images = await models.gallery.findAll({
      where: { user_id: userId },
    });
    res.status(200).json(images);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = getGalleryImages;
