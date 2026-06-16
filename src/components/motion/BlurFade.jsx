import { motion, useReducedMotion } from "motion/react";
import { easeOut, fadeUpBlur } from "../../motion/presets";

const MOTION_TAGS = {
  div: motion.div,
  h1: motion.h1,
  p: motion.p,
  span: motion.span
};

function BlurFade({ as = "div", children, className = "", delay = 0, ...props }) {
  const reduced = useReducedMotion();
  const StaticTag = as;
  const MotionTag = MOTION_TAGS[as] || motion.div;

  if (reduced) {
    return (
      <StaticTag className={className} {...props}>
        {children}
      </StaticTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={fadeUpBlur.hidden}
      animate={fadeUpBlur.show}
      transition={{ duration: 0.45, ease: easeOut, delay }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export default BlurFade;
