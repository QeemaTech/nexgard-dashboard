function TextArea({ label, error, className = "", ...props }) {
  return (
    <label className={`form-field block ${className}`}>
      {label ? <span className="form-label mb-2 block">{label}</span> : null}
      <textarea className="input-field font-mono text-sm" rows={3} {...props} />
      {error ? <span className="form-error mt-1 block">{error}</span> : null}
    </label>
  );
}

export default TextArea;
