import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}