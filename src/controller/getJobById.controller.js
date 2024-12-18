const Sequelize = require("sequelize");
const { models } = require("../models/connect");

async function getJobsByWebsiteId(req, res, models) {
  try {
    const { website_id } = req.params;

    if (!website_id) {
      return res.status(400).json({ message: "Website ID is required." });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set hours to midnight UTC

    const jobs = await models.user_jobs.findAll({
      where: {
        website_id: website_id,
      },
      order: [
        ["job_dato", "ASC"],
        ["job_tid", "ASC"],
      ],
    });

    const validJobs = jobs.filter((job) => {
      const formattedDate = job.job_dato
        .split("-")
        .map((num) => num.padStart(2, "0"))
        .join("-");
      const jobDate = new Date(`${formattedDate}T00:00:00Z`); // Ensure it's treated as a UTC date
      if (isNaN(jobDate.getTime())) {
        console.error(`Invalid job date encountered: ${job.job_dato}`);
        return false;
      }
      return jobDate >= today;
    });

    if (validJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this website." });
    }

    res.json(
      validJobs.map((job) => ({
        ...job.get({ plain: true }),
        job_dato: formatDateString(job.job_dato),
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

module.exports = getJobsByWebsiteId;
