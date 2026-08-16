import { motion } from "framer-motion";
import CourseCard from "../CourseCard/CourseCard";
import "./AllInternship.css";



const AllInternship = ({ internships = [], refreshDashboard }) => {
  const allCount = Array.isArray(internships) ? internships.length : 0;

  return (
    <section id="all-courses">

      <motion.div
        id="course-heading"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2>All Internships ({allCount})</h2>
        <p>Explore every available Internships</p>
      </motion.div>

      <div id="course-grid">
        {internships.map((internship, index) => (
            <CourseCard
              key={internship._id || internship.slug}
              index={index}
              internship={internship}
              type="internship"
              refreshDashboard={refreshDashboard}
            />
        ))}

      </div>

    </section>
  );
};

export default AllInternship;
