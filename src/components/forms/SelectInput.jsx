function SelectInput({ label, options = [], error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
          {label}
        </span>
      ) : null}
      <select className="input-field" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </label>
  );
}

export default SelectInput;
