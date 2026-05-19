import { useState, useEffect } from "react";
import { TopBar } from "./header/TopBar";
import { MainNav } from "./header/MainNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TopBar />
      <MainNav scrolled={scrolled} />
    </>
  );
}
