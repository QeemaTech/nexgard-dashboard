import { motion } from "motion/react";

export function PawPrintIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <ellipse cx="7" cy="8" rx="2.2" ry="2.8" />
      <ellipse cx="12" cy="6" rx="2.2" ry="2.8" />
      <ellipse cx="17" cy="8" rx="2.2" ry="2.8" />
      <ellipse cx="9.5" cy="12.5" rx="1.8" ry="2.2" />
      <ellipse cx="14.5" cy="12.5" rx="1.8" ry="2.2" />
      <path d="M12 14.5c-3.8 0-6.5 2.2-6.5 5.2 0 2.2 2.8 3.8 6.5 3.8s6.5-1.6 6.5-3.8c0-3-2.7-5.2-6.5-5.2z" />
    </svg>
  );
}

export function DogCursorSvg({ facingLeft = false, isMoving = false, isPointer = false, isClicking = false }) {
  const tailWag = isPointer ? [-22, 22, -22] : isMoving ? [-14, 14, -14] : [-10, 10, -10];
  const tailDuration = isPointer ? 0.28 : isMoving ? 0.38 : 0.55;

  return (
    <motion.svg
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pet-cursor-dog-svg h-[3.25rem] w-[3.25rem]"
      style={{ scaleX: facingLeft ? -1 : 1 }}
      animate={{
        y: isClicking ? [0, 4, -2, 0] : isMoving ? [0, -2.5, 0, -1.5, 0] : [0, -1, 0],
        rotate: isPointer ? [0, -3, 3, 0] : isMoving ? [0, -1.5, 1.5, 0] : 0,
        scale: isClicking ? [1, 0.9, 1.05, 1] : 1
      }}
      transition={{
        y: {
          duration: isMoving ? 0.45 : 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: isPointer ? 0.35 : 0.6,
          repeat: isPointer || isMoving ? Infinity : 0,
          ease: "easeInOut"
        },
        scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
      }}
      aria-hidden="true"
    >
      <motion.g
        style={{ transformOrigin: "34px 46px" }}
        animate={{ rotate: tailWag }}
        transition={{ duration: tailDuration, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M38 42c8 2 14 8 16 16 1.5 4-1 5-3 2-3-5-8-9-14-10-2-.5-2-4 1-8z"
          fill="#8B5E3C"
        />
        <path
          d="M40 44c6 1 10 5 12 11"
          stroke="#6B4423"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
      </motion.g>

      <ellipse cx="32" cy="50" rx="15" ry="12" fill="#C9956C" />
      <ellipse cx="32" cy="51" rx="13" ry="10.5" fill="#D4A574" />

      <motion.g
        animate={
          isMoving
            ? { y: [0, -1.5, 0, -1.5, 0], rotate: [0, -2, 0, 2, 0] }
            : { y: [0, -0.5, 0], rotate: 0 }
        }
        transition={{ duration: isMoving ? 0.35 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="32" cy="28" rx="14" ry="13" fill="#C9956C" />
        <ellipse cx="32" cy="29" rx="12.5" ry="11.5" fill="#E0B88A" />

        <motion.ellipse
          cx="18"
          cy="22"
          rx="6"
          ry="9"
          fill="#7A4E2A"
          animate={{ rotate: isMoving ? [-6, 4, -6] : [-2, 2, -2] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 28px" }}
        />
        <motion.ellipse
          cx="46"
          cy="22"
          rx="6"
          ry="9"
          fill="#7A4E2A"
          animate={{ rotate: isMoving ? [6, -4, 6] : [2, -2, 2] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "40px 28px" }}
        />

        <ellipse cx="26" cy="28" rx="2.4" ry="2.8" fill="#1e293b" />
        <ellipse cx="38" cy="28" rx="2.4" ry="2.8" fill="#1e293b" />
        <circle cx="27" cy="27" r="0.9" fill="#ffffff" />
        <circle cx="39" cy="27" r="0.9" fill="#ffffff" />

        <motion.ellipse
          cx="32"
          cy="33"
          rx="3.5"
          ry="2.8"
          fill="#4A2F1F"
          animate={{ scaleY: isClicking ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.25 }}
        />

        {isPointer ? (
          <motion.path
            d="M28 35.5c1.2 3 2.4 4.2 4 4.2s2.8-1.2 4-4.2"
            fill="#F87171"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            style={{ transformOrigin: "32px 35px" }}
          />
        ) : (
          <path
            d="M28 36.5c1 .6 2 .9 4 .9s3-.3 4-.9"
            stroke="#5C3D2E"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}
      </motion.g>

      <motion.g
        animate={
          isMoving
            ? {
                y: [0, -2, 0, -2, 0],
                rotate: [0, -4, 0, 4, 0]
              }
            : { y: 0, rotate: 0 }
        }
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "22px 58px" }}
      >
        <ellipse cx="22" cy="58" rx="4.5" ry="3.2" fill="#B8844E" />
        <ellipse cx="19" cy="55" rx="1.6" ry="2" fill="#8B5E3C" />
        <ellipse cx="22" cy="54" rx="1.6" ry="2" fill="#8B5E3C" />
        <ellipse cx="25" cy="55" rx="1.6" ry="2" fill="#8B5E3C" />
      </motion.g>

      <motion.g
        animate={
          isMoving
            ? {
                y: [0, -2, 0, -2, 0],
                rotate: [0, 4, 0, -4, 0]
              }
            : { y: 0, rotate: 0 }
        }
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut", delay: 0.16 }}
        style={{ transformOrigin: "42px 58px" }}
      >
        <ellipse cx="42" cy="58" rx="4.5" ry="3.2" fill="#B8844E" />
        <ellipse cx="39" cy="55" rx="1.6" ry="2" fill="#8B5E3C" />
        <ellipse cx="42" cy="54" rx="1.6" ry="2" fill="#8B5E3C" />
        <ellipse cx="45" cy="55" rx="1.6" ry="2" fill="#8B5E3C" />
      </motion.g>
    </motion.svg>
  );
}
