const dotenv = require("dotenv");
dotenv.config();

async function deleteUser(req, res, models) {
  try {
    const userId = req.body.data.id;

    await models.user_jobs.destroy({
      where: {
        user_id: userId,
      },
    });

    await models.user_website.destroy({
      where: {
        user_id: userId,
      },
    });

    console.log("webhook worked")
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = deleteUser;