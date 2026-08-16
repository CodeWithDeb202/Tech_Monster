import { motion } from "framer-motion";
import "./DashboardHeader.css";

const DashboardHeader = () => {
  return (
    <motion.div
      id="dashboard-header"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <h1>Dashboard</h1>

        <p>
          Continue your learning journey and discover new Internships.
        </p>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;