import { motion } from "framer-motion";
import { Clock3, ArrowRight } from "lucide-react";
import "./CourseCard.css";
import { toast } from 'react-toastify';

import api from "../../../../../services/api/axios";
import { API } from "../../../../../services/api/endpoints";

const CourseCard = ({ internship, refreshDashboard, index }) => {
  const handleJoin = async () => {
    try {

      await api.post(
        API.INTERNSHIPS.JOIN(internship._id)
      );

      await refreshDashboard();

      toast.success("Internship joined successfully");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to join internship"
      );

    }
  };

  return (
    <motion.div
      id="allIntenrship-student-side-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.2,
      }}
    >
      {/* Top Banner */}
      <div id="allIntenrship-student-side-card-banner">
        <img src={internship?.thumbnail} alt={internship?.title} />
      </div>
      <div id="allIntenrship-student-side-card-banner-text" className={internship?.enrolled ? "enrolled" : ""}>
        {internship?.enrolled ? "Enrolled" : "New"}
      </div>

      {/* Title */}
      <div id="internships-info">
        <h3>{internship?.title}</h3>

        <p>{internship?.description}</p>
        <p>Level : <span>{internship?.level}</span></p>

        <div id="internships-meta">
          <p>
            Total Tasks : &nbsp;
            <span>{internship?.totalTasks}</span>
          </p>

          <p>
            Total Notes : &nbsp;
            <span>{internship?.totalNotes}</span>
          </p>

          <p>
            <Clock3 size={15} />
            <span> {internship?.duration}</span>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleJoin}
        >
          Enroll Now
          <ArrowRight size={18} />
        </motion.button>
      </div>

    </motion.div>
  );
};

export default CourseCard;