async function buildHtmlList(req, res, models) {
  const { id } = req.params; // Assuming 'id' is the correct identifier for your query

  try {
    // Access the 'user_jobs' model from the 'models' object
    const userJobs = await models.user_jobs.findAll({
      where: { user_id: id }, // Make sure this condition matches your requirements
    });

    let htmlList = '<div class="event-item-container">';

    // Generate HTML for each job
    userJobs.forEach((job) => {
      if (job.is_public == 1) {
        htmlList += `
                <div class="event-item">
                    <div class="event-item-part first">
                        <p class="event-item-heading"><span class="color-text">${job.job_dato}</span></p>
                        <p class="event-item-text">${job.job_tid}</p>
                    </div>
                    <div class="event-item-part middle">
                        <p class="event-item-heading">${job.job_title}</p>
                        <div style="display: flex; gap: 30px">
                            <p class="event-item-text">${job.job_hvor}</p>
                            <p class="event-item-text">${job.job_med}</p>
                        </div>
                    </div>
                    <div class="event-item-part last">
                        <a href="${job.job_billet}" target="_blank" class="event-item-button">
                        Billetter</a>
                    </div>
                </div>
            `;
      }
    });
    htmlList += "</div>";
    // Send the generated HTML as the response
    res.status(200).send(htmlList);
  } catch (error) {
    console.error("Error in buildHtmlList: ", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = buildHtmlList;
