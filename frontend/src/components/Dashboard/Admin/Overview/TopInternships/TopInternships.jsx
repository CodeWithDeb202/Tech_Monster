import "./TopInternships.css";

export default function TopInternships({

    internships = []

}) {

    return (

        <div id="topInternships">
            <h2>
                Top Internships
            </h2>

            {
                internships.map((item) => (
                    <div
                        id="topInternshipCard"
                        key={item._id}
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                        />

                        <div id="topInternshipInfo">
                            <h3>
                                {item.title}
                            </h3>
                            <p>
                                👨‍🎓 {item.joinedStudents} Students
                            </p>
                            <p>
                                📋 {item.totalTasks} Tasks
                            </p>
                        </div>

                        <div id="topInternshipRight">
                            <span>
                                {item.level}
                            </span>
                            {
                                item.isPublished ?
                                    <small id="published">
                                        Published
                                    </small>

                                    :

                                    <small id="draft">
                                        Draft
                                    </small>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}