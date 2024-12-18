async function addJob(req, res, models) {
  try {
    // Extract data from the request body
    const {
      user_id,
      is_public,
      job_hvor,
      job_dato,
      job_tid,
      job_med,
      job_billet,
      job_title,
      job_by,
      website_id,
    } = req.body;

    const website = await models.user_website.findByPk(website_id);
    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const newJob = await website.createJob({
      user_id,
      is_public,
      job_hvor,
      job_dato,
      job_tid,
      job_med,
      job_billet,
      job_title,
      job_by,
    })

    res.json({
      success: true,
      message: "Job added successfully!",
      job: newJob,
    });
    
  } catch (error) {
    console.log("Error adding job:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add job.",
      error: error.message,
    });
  }
}

module.exports = addJob;
