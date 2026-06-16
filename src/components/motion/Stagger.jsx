import { motion, useReducedMotion } from "motion/react";
import { staggerContainer, staggerItem } from "../../motion/presets";

function Stagger({ children, className = "", stagger = 0.06, delayChildren = 0.03 }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export { Stagger, StaggerItem };
