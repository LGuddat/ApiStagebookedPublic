async function uploadGalleryImage(req, res, models) {
  try {
    if (!req.body.imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }
    if (!req.body.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!req.body.public_id) {
      return res.status(400).json({ message: "Public_id is required" });
    }

    imageUrl = req.body.imageUrl;
    userId = req.body.userId;
    public_id = req.body.public_id;

    await models.gallery.create({
      user_id: userId,
      image_url: imageUrl,
      public_id: public_id,
    });

    res.status(200).send("Image uploaded");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = uploadGalleryImage;
