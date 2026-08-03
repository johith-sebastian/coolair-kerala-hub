import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Snowflake,
  Youtube,
} from "lucide-react";
import { business } from "@/config/business";

const serviceLinks = [
  { to: "/services", label: "AC Service & Repair" },
  { to: "/services", label: "Refrigerator Repair" },
  { to: "/services", label: "Washing Machine Repair" },
  { to: "/services", label: "Annual Maintenance Contract" },
] as const;

const companyLinks = [
  { to: "/products", label: "Refurbished Products" },
  { to: "/book-service", label: "Book a Service" },
  { to: "/book-installation", label: "Book Installation" },
  { to: "/sell", label: "Sell Your Appliance" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Snowflake className="size-5" />
            </span>
            <span className="text-lg font-bold text-foreground">{business.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A family-run appliance service and refurbished appliance store in Kochi,
            trusted by Kerala households since {business.foundedYear}.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={business.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Youtube className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Services
          </h3>
          <ul className="mt-4 space-y-2.5">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Reach Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {business.addressLine}, {business.city}, {business.state}{" "}
                {business.pincode}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={business.phoneHref} className="hover:text-foreground">
                {business.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${business.email}`} className="hover:text-foreground">
                {business.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {business.legalName}. All rights reserved.
          </p>
          <Link to="/auth" className="transition-colors hover:text-foreground">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
