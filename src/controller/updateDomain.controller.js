async function updateDomain(req, res, models) {
  try {
    if (!req.body.domain) {
      return res.status(400).json({ message: "Domain is required" });
    }
    if (!req.body.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    domain = req.body.domain;
    userId = req.body.userId;

    await models.user_websites.update(
      { domain: domain },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Domain updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
}
