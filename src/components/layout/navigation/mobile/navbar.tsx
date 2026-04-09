"use client";

import SummaryNavLink from "@/components/layout/navigation/SummaryNavLink";
import Link from "next/link";
import { useState } from "react";

export function NavBarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <nav className="md:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="rounded-md border border-prussian_blue/30 px-3 py-2 text-prussian_blue"
        >
          ☰
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu overlay"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="mr-4 mt-4 self-end rounded-md px-2 py-1 text-xl text-prussian_blue"
            >
              ×
            </button>

            <div className="mt-2 flex w-full flex-col">
              <Link
                href="/"
                onClick={closeMenu}
                className="block w-full border-b border-prussian_blue/15 px-6 py-3 text-base font-medium text-prussian_blue transition active:bg-school_bus_yellow/30 active:text-ink_black focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prussian_blue"
              >
                Home
              </Link>
              <SummaryNavLink
                onClick={closeMenu}
                className="block w-full border-b border-prussian_blue/15 px-6 py-3 text-base font-medium text-prussian_blue transition active:bg-school_bus_yellow/30 active:text-ink_black focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prussian_blue"
              >
                Summary
              </SummaryNavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
