import Image from "next/image";
import { NavBarDesktop } from "@/components/layout/navigation/desktop/navbar";
import { NavBarMobile } from "../navigation/mobile/navbar";

export function Header() {
  return (
    <header className="container flex items-center justify-between">
      <span className="inline-flex h-20 w-20 items-center justify-center">
        <Image
          src="/logo.png"
          alt="Fjordreise logo"
          width={80}
          height={80}
          priority
          className="h-20 w-20 object-contain"
        />
      </span>
      <NavBarDesktop />
      <NavBarMobile />
    </header>
  );
}
