import { motion, useReducedMotion } from "motion/react";
import { easeOut, pageTransition } from "../../motion/presets";

function AnimatedPage({ children, className = "" }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={{ duration: 0.38, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
