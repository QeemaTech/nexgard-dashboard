import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../common/Button";

const ICONS = { eye: Eye, pencil: Pencil, trash: Trash2 };

export function TableActions({ children, className = "" }) {
  return <div className={`table-actions ${className}`.trim()}>{children}</div>;
}

export function TableActionButton({
  children,
  icon,
  variant = "secondary",
  className = "",
  ...props
}) {
  const Icon = typeof icon === "string" ? ICONS[icon] : icon;

  return (
    <Button variant={variant} size="sm" className={`table-action-btn ${className}`.trim()} {...props}>
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      <span className="table-action-label">{children}</span>
    </Button>
  );
}

export default TableActions;
