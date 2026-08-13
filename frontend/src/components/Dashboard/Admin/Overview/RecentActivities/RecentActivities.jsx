import "./RecentActivities.css";

export default function RecentActivities({ activities = [] }) {
    console.log("Activities", activities);
    return (
        <div id="recentActivities">
            <h2>Recent Activities</h2>
            {
                activities.length === 0 ? (
                    <p>No Recent Activities</p>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity._id}
                            id="activityCard"
                        >

                            <img
                                src={activity.avatar}
                                alt={activity.fullName}
                            />

                            <div id="activityInfo">
                                <h4>{activity.fullName}</h4>
                                <p>{activity.description}</p>
                                <small>{activity.module}</small>
                            </div>
                            <span>
                                {new Date(activity.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )
            }
        </div>
    );
}