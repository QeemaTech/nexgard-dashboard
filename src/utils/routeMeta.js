import { SIDEBAR_ITEMS } from "./constants";

const DETAIL_ROUTES = [
  {
    test: (pathname) => /^\/app\/users\/[^/]+$/.test(pathname),
    sectionKey: "nav.users",
    titleKey: "pages.userDetails.title"
  },
  {
    test: (pathname) => /^\/app\/products\/[^/]+$/.test(pathname),
    sectionKey: "nav.products",
    titleKey: "pages.productDetails.title"
  },
  {
    test: (pathname) => /^\/app\/qrcodes\/[^/]+$/.test(pathname),
    sectionKey: "nav.qrcodes",
    titleKey: "pages.qrcodeDetails.title"
  }
];

function findNavChild(pathname) {
  for (const item of SIDEBAR_ITEMS) {
    if (!item.children?.length) continue;
    const child = item.children.find(
      (entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`)
    );
    if (child) {
      return { sectionKey: item.labelKey, titleKey: child.labelKey };
    }
  }
  return null;
}

export function getRouteMeta(pathname, t) {
  const detailRoute = DETAIL_ROUTES.find((route) => route.test(pathname));
  if (detailRoute) {
    return {
      title: t(detailRoute.titleKey),
      section: t(detailRoute.sectionKey)
    };
  }

  const navChild = findNavChild(pathname);
  if (navChild) {
    return {
      title: t(navChild.titleKey),
      section: t(navChild.sectionKey)
    };
  }

  const match =
    SIDEBAR_ITEMS.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`)) ||
    SIDEBAR_ITEMS.find((item) => item.path.startsWith(pathname.split("/").slice(0, 3).join("/")));

  if (match) {
    const title = t(match.labelKey);
    return { title, section: title };
  }

  const segment = pathname.split("/").filter(Boolean).pop() || "overview";
  const title = segment.replace(/-/g, " ");
  return { title, section: title };
}
