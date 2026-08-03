import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, Snowflake, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { business } from "@/config/business";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Refurbished" },
  { to: "/book-service", label: "Book Service" },
  { to: "/book-installation", label: "Installation" },
  { to: "/sell", label: "Sell Appliance" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass-strong shadow-soft" : "bg-transparent",
      )}
    >
      <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Snowflake className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold leading-none text-foreground">
              {business.name}
            </span>
            <span className="mt-1 block truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Kochi, Kerala
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-0.5 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden rounded-full sm:inline-flex">
            <a href={business.phoneHref}>
              <Phone className="size-4" />
              Call Now
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="glass-strong border-t border-border xl:hidden">
          <nav className="container-x flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-xl px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary/70"
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-3 rounded-full">
              <a href={business.phoneHref}>
                <Phone className="size-4" />
                {business.phone}
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
