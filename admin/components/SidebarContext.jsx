"use client";
import { createContext, useContext, useState, useMemo } from "react";

const SidebarContext = createContext({
  open: false,
  openSidebar: () => {},
  closeSidebar: () => {},
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      open,
      openSidebar: () => setOpen(true),
      closeSidebar: () => setOpen(false),
      toggleSidebar: () => setOpen((v) => !v),
    }),
    [open]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

