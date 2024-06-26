import { RouteType } from "@multiversx/sdk-dapp/types";
import { HiShoppingBag, HiLockClosed, HiUser, HiLibrary } from 'react-icons/hi';

export const routeNames = {
  home: "/profile",
  statistics: "/statistics",
  unlock: "/unlock",
  profile: "/profile",
  library: "/library",
  apiDoc: "/api-doc",
  hello: "/api/hello/route",
  user: "/api/user",
  message: "/api/message",
  getUsers: "/api/getuses",
  tradedata: "/tradedata",
  products: "/products",
  blacklist: "/blacklist",
  admin: '/admin'
};

interface RouteWithTitleType extends RouteType {
  title: string;
  icon?: any;
  showInSidebar?: boolean;
  order?: number;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: "Home",
    component: null,
    authenticatedRoute: true,
  },
  {
    path: routeNames.statistics,
    title: "Statistics",
    component: null,
    authenticatedRoute: true,
  },
  {
    path: routeNames.profile,
    title: 'User Profile',
    component: null,
    authenticatedRoute: true,
    showInSidebar: true,
    icon: HiUser,
    order: 10,
  },
  {
    path: routeNames.library,
    title: 'Library',
    component: null,
    authenticatedRoute: true,
    showInSidebar: true,
    icon: HiLibrary,
    order: 9,
  },
  {
    path: routeNames.blacklist,
    title: 'Whitelist Users',
    component: null,
    authenticatedRoute: true,
    showInSidebar: false,
  },
  {
    path: routeNames.apiDoc,
    title: "api-doc",
    component: null,
  },
  {
    path: routeNames.tradedata,
    title: "Locki Data Dex",
    component: null,
  },
  {
    path: routeNames.unlock,
    title: "Unlock",
    component: null,
    showInSidebar: true,
    icon: HiLockClosed,
  },
  {
    path: routeNames.products,
    title: "Products",
    showInSidebar: true,
    icon: HiShoppingBag,
    component: null,
    authenticatedRoute: true,
    order: 1,
  },
  {
    path: routeNames.admin,
    title: "Admin",
    component: null,
    authenticatedRoute: true,
  },
];

export const mappedRoutes = routes.map((route) => {
  const requiresAuth = Boolean(route.authenticatedRoute);

  return {
    path: route.path,
    authenticatedRoute: requiresAuth,
  };
});
