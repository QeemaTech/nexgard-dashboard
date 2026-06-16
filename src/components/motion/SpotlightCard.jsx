import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { springSoft } from "../../motion/presets";

function SpotlightCard({ children, className = "" }) {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgba(37, 99, 235, 0.11), transparent 68%)`;

  function onMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      className={`spotlight-card group relative overflow-hidden ${className}`}
      onMouseMove={reduced ? undefined : onMouseMove}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={springSoft}
    >
      {!reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}

export default SpotlightCard;
