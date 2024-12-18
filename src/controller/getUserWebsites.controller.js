async function getUserWebsites(req, res, models) {
  try {
    const userWebsites = await models.user_website.findAll({
      where: {
        user_id: req.params.userId,
      },
    });

    res.status(200).json(userWebsites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = getUserWebsites;
