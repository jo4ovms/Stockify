import { motion } from "framer-motion";
import PropTypes from "prop-types";
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

PageTransition.propTypes = {
  children: PropTypes.node,
};

export default PageTransition;
