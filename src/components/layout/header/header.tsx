import Image from "next/image";
import { NavBarDesktop } from "@/components/layout/navigation/desktop/navbar";
import { NavBarMobile } from "../navigation/mobile/navbar";

export function Header() {
  return (
    <header className="w-full border-b border-white/40 bg-white/35 backdrop-blur-sm">
      <div className="content-wrapper flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-school_bus_yellow/80">
            <Image
              src="/logo.png"
              alt="Fjordreise App logo"
              width={80}
              height={80}
              priority
              className="h-14 w-14 object-contain"
            />
          </span>
          <span className="text-xl font-light text-prussian_blue md:text-2xl">
            Fjordreise App
          </span>
        </div>
        <NavBarDesktop />
        <NavBarMobile />
      </div>
    </header>
  );
}
