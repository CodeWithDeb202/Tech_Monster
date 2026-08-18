import { formatCountdown } from "../../utils/taskUtils";

const TaskDeadlineCard = ({
    deadline,
    now,
    expired,
}) => {
    return (
        <div
            className={`task-deadline-card ${
                expired ? "expired" : ""
            }`}
        >
            <div>
                <span>Deadline</span>

                <strong>
                    {formatCountdown(
                        deadline?.expiresAt,
                        now
                    )}
                </strong>
            </div>

            <p>
                {expired
                    ? "Submission is disabled. Contact support for an extension."
                    : deadline?.expiresAt
                    ? "Submit within 48 hours of unlock."
                    : "This task starts when it unlocks."}
            </p>
        </div>
    );
};

export default TaskDeadlineCard;