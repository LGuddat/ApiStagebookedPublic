async function deleteGalleryImage(req, res, models, cloudinary) {
  try {
    const image = await models.gallery.findOne({
      where: {
        user_id: req.body.user_id,
        public_id: req.body.public_id,
      },
    });

    if (!image) {
      return res.status(404).send("No image url could be found for that user.");
    }
  
    let result = await cloudinary.uploader.destroy(req.body.public_id);
    
    console.log("result: ", result.result);

    if (result.result !== "ok") {
      return res.status(500).send("Error with deleting image from Cloudinary");
    }
    const deleteResponse = await models.gallery.destroy({
      where: {
        user_id: req.body.user_id,
        public_id: req.body.public_id,
      },
    });

    if (deleteResponse) {
      return res.status(200).send("Image deleted");
    } else {
      return res.status(500).send("Error with deleting image from database");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
}

module.exports = deleteGalleryImage;
