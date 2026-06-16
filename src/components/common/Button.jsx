import { motion, useReducedMotion } from "motion/react";
import { springSnappy } from "../../motion/presets";

function Button({ children, type = "button", variant = "primary", size = "md", className = "", ...props }) {
  const reduced = useReducedMotion();
  const styles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    ghost: "btn-ghost"
  };

  const sizes = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg"
  };

  const classes = `inline-flex items-center justify-center gap-2 font-bold transition ${styles[variant]} ${sizes[size]} ${className}`;

  if (reduced) {
    return (
      <button type={type} className={classes} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
