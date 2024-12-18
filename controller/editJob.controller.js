
function editJob (req,res,models) {
    try {
        const { id, is_public, job_hvor, job_dato, job_tid, job_med, job_billet , job_title} =
        req.body;

        const updatedJob = models.user_jobs.update({
            is_public,
            job_hvor,
            job_dato,
            job_tid,
            job_med,
            job_billet,
            job_title,
        }, {
            where: {
                id: id,
            }
        });

        res.json({
            success: true,
            message: "Job updated successfully!",            
        }).status(200);

    } catch (error) {
        console.log("error updating job:", error.message);
    }
}

module.exports = editJob;