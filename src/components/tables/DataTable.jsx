import { motion, useReducedMotion } from "motion/react";
import EmptyState from "../common/EmptyState";
import PaginationControls from "./PaginationControls";
import { springSoft } from "../../motion/presets";

function getCellClassName(col) {
  const classes = ["table-cell", "px-4", "py-3.5", "sm:px-5", "sm:py-4", "lg:px-6"];

  if (col.key === "actions" || col.sticky) {
    classes.push("table-sticky-actions", "whitespace-nowrap");
  } else if (col.wrap) {
    classes.push("max-w-xs", "whitespace-normal", "break-words");
  } else {
    classes.push("whitespace-nowrap");
  }

  if (col.align === "center") classes.push("text-center");
  else if (col.align === "end") classes.push("text-end");
  else classes.push("text-start");

  if (col.className) classes.push(col.className);

  return classes.join(" ");
}

function getRowKey(row, rowIndex, keyField) {
  const value = row?.[keyField];
  if (value !== undefined && value !== null && value !== "") {
    return String(value);
  }
  return `row-${rowIndex}`;
}

function DataTable({ columns, rows, keyField = "id", meta, onPageChange }) {
  const reduced = useReducedMotion();

  if (!rows?.length) {
    return <EmptyState />;
  }

  const RowTag = reduced ? "tr" : motion.tr;

  return (
    <motion.div
      className="data-table-shell card-surface overflow-hidden"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
    >
      <div className="data-table-scroll overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="data-table w-full min-w-[720px] border-collapse text-sm">
          <thead className="table-header">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`table-head-cell ${col.key === "actions" || col.sticky ? "table-sticky-actions" : ""} whitespace-nowrap px-4 py-3.5 text-start text-[10px] font-bold uppercase tracking-[0.14em] sm:px-5 sm:py-4 sm:text-[11px] lg:px-6 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body divide-y table-divider">
            {rows.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex, keyField);

              return (
              <RowTag
                key={rowKey}
                className="table-row"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...springSoft,
                  delay: reduced ? 0 : Math.min(rowIndex, 14) * 0.04
                }}
              >
                {columns.map((col) => (
                  <td key={`${rowKey}-${col.key}`} className={getCellClassName(col)}>
                    {col.render ? col.render(row) : row[col.key] ?? (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                ))}
              </RowTag>
              );
            })}
          </tbody>
        </table>
      </div>

      {meta ? (
        <div className="data-table-footer border-t border-default px-4 py-3 sm:px-6 sm:py-4">
          <PaginationControls meta={meta} onPageChange={onPageChange} />
        </div>
      ) : null}
    </motion.div>
  );
}

export default DataTable;
