async function getAllJobsByWebsiteId(req, res, models) {
  try {
    const { website_id } = req.params;

    if (!website_id) {
      return res.status(400).json({ message: "Website ID is required." });
    }

    const jobs = await models.user_jobs.findAll({
      where: {
        website_id: website_id,
      },
      order: [
        ["job_dato", "ASC"], // Order by date first
        ["job_tid", "ASC"], // Then order by time if needed
      ],
    });

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this website." });
    }

    res.json(
      jobs.map((job) => ({
        ...job.get({ plain: true }), // Convert instance to plain object
        job_dato: formatDateString(job.job_dato), // Normalize and format date
      })),
    );
  } catch (error) {
    console.error("Error fetching jobs for website:", error);
    res.status(500).send("Internal Server Error");
  }
}

function formatDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number); // Split and convert to number to remove any leading zeros
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`; // Format to "YYYY-MM-DD"
}

module.exports = getAllJobsByWebsiteId;
