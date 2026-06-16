function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`skeleton-shimmer skeleton-block animate-pulse rounded-2xl ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
