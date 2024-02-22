import { RouteType } from "@multiversx/sdk-dapp/types";

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
  getUsers: "/api/getusers",
  tradedata: "/tradedata",
};

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: "Home",
    component: null,
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
  },
  {
    path: routeNames.library,
    title: 'Library of DataNfts',
    component: null,
    authenticatedRoute: true,
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

];

export const mappedRoutes = routes.map((route) => {
  const requiresAuth = Boolean(route.authenticatedRoute);

  return {
    path: route.path,
    authenticatedRoute: requiresAuth,
  };
});
