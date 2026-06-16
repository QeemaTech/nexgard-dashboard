import { useRef } from "react";

function GlareHover({
  children,
  className = "",
  style = {},
  glareColor = "#ffffff",
  glareOpacity = 0.35,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false
}) {
  const overlayRef = useRef(null);

  function toRgba(color, opacity) {
    const hex = color.replace("#", "");
    if (/^[\dA-Fa-f]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    if (/^[\dA-Fa-f]{3}$/.test(hex)) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }

  const rgba = toRgba(glareColor, glareOpacity);

  function animateIn() {
    const element = overlayRef.current;
    if (!element) return;
    element.style.transition = "none";
    element.style.backgroundPosition = "-100% -100%, 0 0";
    element.style.transition = `${transitionDuration}ms ease`;
    element.style.backgroundPosition = "100% 100%, 0 0";
  }

  function animateOut() {
    const element = overlayRef.current;
    if (!element) return;
    if (playOnce) {
      element.style.transition = "none";
      element.style.backgroundPosition = "-100% -100%, 0 0";
      return;
    }
    element.style.transition = `${transitionDuration}ms ease`;
    element.style.backgroundPosition = "-100% -100%, 0 0";
  }

  return (
    <div
      className={`glare-hover relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
          backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-100% -100%, 0 0"
        }}
      />
    </div>
  );
}

export default GlareHover;
