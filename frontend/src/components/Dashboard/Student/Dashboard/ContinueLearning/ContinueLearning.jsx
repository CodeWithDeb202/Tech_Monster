import { motion } from "framer-motion";
import ContinueCard from "../ContinueCard/ContinueCard";
import "./ContinueLearning.css";

const ContinueLearning = ({ internships = [] }) => {
  const joinedCount = Array.isArray(internships) ? internships.length : 0;

  return (
    <section id="continue-learning">

      <motion.div
        id="section-title"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2>Continue Learning ({joinedCount})</h2>
        <p>Your joined internships</p>
      </motion.div>

      {internships.length === 0 ? (
        <div id="empty-internship">
          <h3>No Internship Joined Yet</h3>
          <p>
            You haven't joined any internship yet. Explore available
            internships below and start your learning journey.
          </p>
        </div>
      ) : (
        <div id="continuelearning-grid">
          {internships.map((internship, index) => (
            <motion.div
              key={internship._id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <ContinueCard internship={internship} />
            </motion.div>
          ))}
        </div>
      )}

    </section>
  );
};

export default ContinueLearning;