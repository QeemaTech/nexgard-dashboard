import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function RouteProgressBar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-1 overflow-hidden bg-transparent">
      <div className="route-progress-bar h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500" />
    </div>
  );
}

export default RouteProgressBar;
