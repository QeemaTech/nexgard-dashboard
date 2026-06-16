function DataTableToolbar({ children, className = "" }) {
  return <div className={`data-table-toolbar ${className}`.trim()}>{children}</div>;
}

export default DataTableToolbar;
