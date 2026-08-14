import { motion } from "framer-motion";
import ContinueCard from "../ContinueCard/ContinueCard";
import "./ContinueLearning.css";

const ContinueLearning = ({ learningItems = [] }) => {

  const joinedCount = Array.isArray(learningItems)
    ? learningItems.length
    : 0;

  return (
    <section id="continue-learning">

      <motion.div
        id="section-title"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2>
          Continue Learning ({joinedCount})
        </h2>

        <p>
          Continue your enrolled courses and internships
        </p>
      </motion.div>

      {joinedCount === 0 ? (

        <div id="empty-internship">

          <h3>
            No Learning Content Yet
          </h3>

          <p>
            You haven't joined any course or internship yet.
            Explore the available learning programs below.
          </p>

        </div>

      ) : (

        <div id="continuelearning-grid">

          {learningItems.map((item, index) => (

            <motion.div
              key={`${item.type}-${item._id}`}
              initial={{
                opacity: 0,
                y: 80
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
            >

              <ContinueCard
                learning={item}
              />

            </motion.div>

          ))}

        </div>

      )}

    </section>
  );
};

export default ContinueLearning;