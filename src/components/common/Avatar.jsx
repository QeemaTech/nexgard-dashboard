import { Camera } from "lucide-react";
import { getInitials, resolveMediaUrl } from "../../utils/mediaUrl";

function Avatar({
  name,
  image,
  size = "md",
  className = "",
  showUploadHint = false,
  onClick
}) {
  const src = resolveMediaUrl(image);
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-24 w-24 text-2xl",
    xl: "h-32 w-32 text-3xl"
  };

  const ringClass = onClick ? "cursor-pointer hover:opacity-90" : "";

  return (
    <div
      className={`avatar-ring relative shrink-0 overflow-hidden rounded-2xl p-0.5 ${sizes[size]} ${ringClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") onClick(event);
            }
          : undefined
      }
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {src ? (
          <img src={src} alt={name || "Avatar"} className="h-full w-full object-cover" />
        ) : (
          <span className="font-bold">{getInitials(name)}</span>
        )}
      </div>
      {showUploadHint ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
      ) : null}
    </div>
  );
}

export default Avatar;
