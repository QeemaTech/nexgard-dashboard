import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { springSoft } from "../../motion/presets";

function AnimatedListItem({ children, className = "", delay = 0, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className} data-index={index}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-index={index}
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.97 }}
      transition={{ ...springSoft, delay: delay + index * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedListItem;
