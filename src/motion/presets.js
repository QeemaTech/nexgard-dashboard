export const springSnappy = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 };

export const springSoft = { type: "spring", stiffness: 280, damping: 28, mass: 0.9 };

export const easeOut = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 }
};

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: { opacity: 1, scale: 1, y: 0 }
};

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0.04) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren
    }
  }
});

export const staggerItem = {
  hidden: fadeUp.hidden,
  show: {
    ...fadeUp.show,
    transition: springSoft
  }
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalPanel = {
  initial: scaleIn.hidden,
  animate: scaleIn.show,
  exit: { opacity: 0, scale: 0.97, y: 8 }
};
