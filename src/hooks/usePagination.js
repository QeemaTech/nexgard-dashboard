import { useMemo, useState } from "react";

function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const params = useMemo(
    () => ({
      page,
      limit
    }),
    [page, limit]
  );

  return {
    page,
    limit,
    setPage,
    setLimit,
    params
  };
}

export default usePagination;
