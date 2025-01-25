"use client";

import ResponsiveAppBar from "./components/ResponsiveAppBar";

export default function UserLayout({ children }) {
  return (
    <section>
      <ResponsiveAppBar />
      {children}
    </section>
  );
}
