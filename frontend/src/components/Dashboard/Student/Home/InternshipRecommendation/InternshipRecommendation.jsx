import "./InternshipRecommendation.css";

import { useNavigate } from 'react-router-dom';

import { motion } from "framer-motion";

import {
  HiArrowRight,
  HiBookOpen,
  HiStar,
  HiPlayCircle,
} from "react-icons/hi2";

const InternshipRecommendation = ({ internships = [] }) => {
  const navigate = useNavigate();

  return (

    <motion.section
      id="internship-recommendation-section"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .7 }}
    >

      {/* Header */}

      <div id="internship-recommendation-header">
        <div>
          <h2>
            <HiBookOpen />
            Recommended Internships
          </h2>

          <p>
            Internships selected specially for you.
          </p>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05
          }}
          id="view-btn"
          onClick={() => navigate('/student/dashboard')}
        >
          View All
          <HiArrowRight />
        </motion.button>
      </div>

      {/* Cards */}

      <div id="internship-recommendation-slider">

        {
          internships.map((internship, index) => (
            <motion.div
              key={internship._id || index}
              id="internship-recommendation-card"
              initial={{
                opacity: 0,
                y: 50
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * .15
              }}
              whileHover={{
                y: -12,
                rotateX: 5,
                rotateY: -5
              }}
            >

              {/* Image */}

              <div id="internship-recommendation-card-image">
                <img
                  src={internship.thumbnail}
                  alt={internship.title}
                />
              </div>

              {/* Content */}

              <div id="internship-recommendation-card-content">
                <span id="internship-recommendation-card-category">
                  {internship.category}
                </span>
                <span id="internship-recommendation-card-category">
                  {internship.level}
                </span>
                <h3>
                  {internship.title}
                </h3>

                <div id="internship-recommendation-card-meta">
                  <span>
                    <HiStar />
                    {internship.rating || 0}
                  </span>
                  <span>
                    {internship.totalNotes} lessons
                  </span>
                </div>

                <motion.button
                  whileHover={{
                    x: 6
                  }}
                  id="internship-recommendation-continue-btn"
                  onClick={() =>
                    navigate(
                      `/student/lessions/${internship.slug || internship._id || "frontend-dev"}`
                    )
                  }
                >
                  <HiPlayCircle />
                  Continue
                </motion.button>
              </div>
            </motion.div>
          ))
        }
      </div>
    </motion.section>
  );

};

export default InternshipRecommendation;