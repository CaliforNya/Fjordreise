"use client";

import SummaryNavLink from "@/components/layout/navigation/SummaryNavLink";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function NavBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  const menuLayer =
    isOpen &&
    mounted &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasjon"
      >
        <button
          type="button"
          aria-label="Lukk meny"
          onClick={closeMenu}
          className="absolute inset-0 bg-black/40"
        />
        <div className="absolute right-0 top-0 flex h-full w-[min(100%,18rem)] flex-col bg-white shadow-xl">
          <button
            type="button"
            aria-label="Lukk meny"
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
      </div>,
      document.body
    );

  return (
    <>
      <nav className="md:hidden">
        <button
          type="button"
          aria-label="Åpne navigasjonsmeny"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
          className="rounded-md border border-prussian_blue/30 px-3 py-2 text-prussian_blue"
        >
          ☰
        </button>
      </nav>
      {menuLayer}
    </>
  );
}
