function FormInput({ label, error, icon: Icon, className = "", ...props }) {
  return (
    <label className={`form-field block ${className}`}>
      {label ? <span className="form-label mb-2 block">{label}</span> : null}
      <div className="relative">
        {Icon ? (
          <Icon className="form-field-icon pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2" />
        ) : null}
        <input className={`input-field ${Icon ? "input-field-with-icon" : ""}`} {...props} />
      </div>
      {error ? <span className="form-error mt-1 block">{error}</span> : null}
    </label>
  );
}

export default FormInput;
