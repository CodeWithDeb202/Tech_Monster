import cron from "node-cron";

import Submission from "../../modules/submissions/models/Submission.js";
import { emitToUser } from "../infrastructure/socket/socket.js";

const submissionDeadlineJob = () => {
    cron.schedule("*/5 * * * *", async () => {
        const now = new Date();

        const expired = await Submission.find({
            status: { $in: ["unlocked", "rejected"] },
            expiresAt: { $lte: now }
        });

        if (!expired.length) return;

        await Submission.updateMany(
            { _id: { $in: expired.map((submission) => submission._id) } },
            {
                $set: {
                    status: "expired",
                    expiredAt: now
                }
            }
        );

        expired.forEach((submission) => {
            emitToUser(submission.student, "taskExpired", {
                submission: {
                    ...submission.toObject(),
                    status: "expired",
                    expiredAt: now
                },
                taskKey: `${submission.moduleId}_${submission.taskId}`
            });
        });
    });
};

export default submissionDeadlineJob;
