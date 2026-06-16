import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useVelocity
} from "motion/react";
import { DogCursorSvg, PawPrintIcon } from "./PetCursorIcons";

const SPRING = { stiffness: 380, damping: 28, mass: 0.42 };
const TRAIL_DISTANCE = 36;

function PetCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [pawBursts, setPawBursts] = useState([]);
  const [pawTrail, setPawTrail] = useState([]);

  const lastTrailRef = useRef({ x: 0, y: 0 });
  const moveTimeoutRef = useRef(null);
  const facingLeftRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, SPRING);
  const y = useSpring(mouseY, SPRING);
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  useMotionValueEvent(velocityX, "change", (vx) => {
    const vy = velocityY.get();
    const speed = Math.hypot(vx, vy);

    if (Math.abs(vx) > 40) {
      const nextFacing = vx < 0;
      facingLeftRef.current = nextFacing;
      setFacingLeft(nextFacing);
    }

    if (speed > 120) {
      setIsMoving(true);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = setTimeout(() => setIsMoving(false), 140);
    }
  });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const coarseOnly = window.matchMedia("(hover: none)").matches;
    const shouldEnable = finePointer && !coarseOnly && !reduced;
    setEnabled(shouldEnable);

    if (!shouldEnable) {
      document.body.classList.remove("pet-cursor-active");
      return undefined;
    }

    document.body.classList.add("pet-cursor-active");

    function onMove(event) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      const last = lastTrailRef.current;
      const dist = Math.hypot(event.clientX - last.x, event.clientY - last.y);

      if (dist >= TRAIL_DISTANCE) {
        const id = `${Date.now()}-${Math.random()}`;
        setPawTrail((prev) => [
          ...prev.slice(-6),
          {
            id,
            x: event.clientX,
            y: event.clientY,
            rotate: Math.random() * 40 - 20,
            flip: facingLeftRef.current
          }
        ]);
        lastTrailRef.current = { x: event.clientX, y: event.clientY };
      }
    }

    function onOver(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, label, summary, [data-pet-cursor="pointer"]'
      );
      setIsPointer(Boolean(interactive) && !target.closest("[data-pet-cursor='default']"));
    }

    function onDown() {
      setIsClicking(true);
      const cx = mouseX.get();
      const cy = mouseY.get();
      const bursts = [-22, 0, 22].map((offset, index) => ({
        id: `${Date.now()}-${index}-${Math.random()}`,
        x: cx + offset,
        y: cy + 8,
        rotate: offset * 0.8
      }));
      setPawBursts((prev) => [...prev.slice(-3), ...bursts]);
    }

    function onUp() {
      setIsClicking(false);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.classList.remove("pet-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [mouseX, mouseY, reduced]);

  useEffect(() => {
    if (!pawTrail.length) return undefined;
    const timer = window.setTimeout(() => {
      setPawTrail((prev) => prev.slice(1));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [pawTrail]);

  useEffect(() => {
    if (!pawBursts.length) return undefined;
    const timer = window.setTimeout(() => {
      setPawBursts([]);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [pawBursts]);

  if (!enabled) return null;

  return (
    <div className="pet-cursor-layer pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <AnimatePresence>
        {pawTrail.map((trail) => (
          <motion.div
            key={trail.id}
            className="pet-cursor-trail absolute text-amber-600/70 dark:text-amber-400/60"
            style={{ left: trail.x, top: trail.y }}
            initial={{ opacity: 0.55, scale: 0.35, x: "-50%", y: "-50%", rotate: trail.rotate }}
            animate={{ opacity: 0, scale: 0.9, y: "-30%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ display: "inline-block", transform: trail.flip ? "scaleX(-1)" : "none" }}>
              <PawPrintIcon className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {pawBursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="pet-cursor-burst absolute text-amber-700 dark:text-amber-300"
            style={{ left: burst.x, top: burst.y }}
            initial={{ opacity: 0.9, scale: 0.3, x: "-50%", y: "-50%", rotate: burst.rotate }}
            animate={{ opacity: 0, scale: 1.2, y: "-70%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <PawPrintIcon className="h-4 w-4" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="pet-cursor-main absolute top-0 left-0"
        style={{ x, y, translateX: "-50%", translateY: "-58%" }}
        animate={{
          scale: isClicking ? 0.92 : isPointer ? 1.08 : 1
        }}
        transition={{ type: "spring", stiffness: 520, damping: 26 }}
      >
        <motion.div
          className="pet-cursor-glow"
          animate={{
            scale: isPointer ? [1, 1.15, 1] : isMoving ? [1, 1.08, 1] : [1, 1.04, 1],
            opacity: isPointer ? 0.95 : 0.7
          }}
          transition={{ duration: isPointer ? 0.6 : 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <DogCursorSvg
          facingLeft={facingLeft}
          isMoving={isMoving}
          isPointer={isPointer}
          isClicking={isClicking}
        />
        {isPointer ? (
          <motion.span
            className="pet-cursor-heart absolute -top-1 start-1/2 -translate-x-1/2 text-sm"
            initial={{ opacity: 0, y: 4, scale: 0 }}
            animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
            transition={{ y: { duration: 0.8, repeat: Infinity }, scale: { duration: 0.2 } }}
          >
            🐾
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}

export default PetCursor;
