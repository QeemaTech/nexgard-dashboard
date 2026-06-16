function BorderBeam({ children, className = "", duration = 6, borderWidth = 1 }) {
  return (
    <div
      className={`border-beam-wrap ${className}`}
      style={{ "--beam-duration": `${duration}s`, "--beam-width": `${borderWidth}px` }}
    >
      <div className="border-beam-ring" aria-hidden="true" />
      <div className="border-beam-content">{children}</div>
    </div>
  );
}

export default BorderBeam;
