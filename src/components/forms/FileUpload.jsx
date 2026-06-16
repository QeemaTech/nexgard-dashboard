function FileUpload({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
          {label}
        </span>
      ) : null}
      <input type="file" className="input-field py-2 file:me-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 dark:file:bg-blue-950/50 dark:file:text-blue-300" {...props} />
      {error ? <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </label>
  );
}

export default FileUpload;
