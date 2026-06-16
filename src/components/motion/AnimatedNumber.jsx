import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import formatNumber from "../../utils/formatNumber";
import { easeOut } from "../../motion/presets";

function AnimatedNumber({ value, className = "" }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(Number(value) || 0);
  const fromRef = useRef(Number(value) || 0);

  useEffect(() => {
    const target = Number(value) || 0;

    if (reduced) {
      setDisplay(target);
      fromRef.current = target;
      return undefined;
    }

    const controls = animate(fromRef.current, target, {
      duration: 0.85,
      ease: easeOut,
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });

    fromRef.current = target;
    return () => controls.stop();
  }, [value, reduced]);

  return <span className={className}>{formatNumber(display)}</span>;
}

export default AnimatedNumber;
