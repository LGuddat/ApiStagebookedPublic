async function deleteJob(req,res,models) {
    try {
        const { id } = req.body;

        const deletedJob = models.user_jobs.destroy({
            where: {
                id: id,
            }
        });

        res.json({
            success: true,
            message: "Job deleted successfully!",            
        }).status(204);

    } catch (error) {
        console.log("error deleting job:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete job.",
            error: error.message,
        });
    }
}

module.exports = deleteJob;