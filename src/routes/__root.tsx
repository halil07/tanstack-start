import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Todo List",
      },
      {
        name: "description",
        content: "Simple and efficient todo list app built with TanStack Start and Cloudflare D1",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
