async function newUser(req, res, models) {
  const userId = req.body.data.id;

  try {
    //create sample two sample jobs for the new user:
    await models.user_jobs.create({
      user_id: userId,
      is_public: true,
      job_hvor: "Koncert hus",
      job_dato: "2021-12-24",
      job_tid: "20:00",
      job_med: "The Rolling Stones",
      job_title: "Koncert",
    });

    await models.user_jobs.create({
      user_id: userId,
      is_public: true,
      job_hvor: "Stort teater",
      job_dato: "2021-12-25",
      job_tid: "21:00",
      job_med: "Ballet dansere",
      job_title: "Teater",
    });

    console.log("webhook worked");
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = newUser;
