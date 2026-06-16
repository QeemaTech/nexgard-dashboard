import Button from "../common/Button";

export const MODAL_FORM_GRID = "grid gap-4 md:grid-cols-2";

export function modalFieldClass(field) {
  if (field?.fullWidth || field?.type === "textarea") {
    return "md:col-span-2";
  }
  return "";
}

export default function ModalForm({
  id,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  children,
  className = MODAL_FORM_GRID
}) {
  return (
    <form id={id} onSubmit={onSubmit} className="flex min-h-0 flex-col">
      <div className={className}>{children}</div>
      <div className="panel-muted sticky bottom-0 -mx-6 mt-6 border-t px-6 py-4">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}

export function ModalFooter({ children }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
