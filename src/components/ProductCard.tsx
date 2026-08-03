import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { business, whatsappLink } from "@/config/business";
import { discountPercent, formatINR } from "@/lib/format";
import type { Product } from "@/lib/queries";

const statusStyles: Record<string, string> = {
  available: "bg-success/15 text-success border-success/30",
  reserved: "bg-warning/20 text-warning-foreground border-warning/40",
  sold: "bg-muted text-muted-foreground border-border",
};

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  const image = product.images?.[0] ?? "/images/products/product-fridge.jpg";

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary/40"
      >
        <img
          src={image}
          alt={product.title}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <Badge
            variant="outline"
            className={`rounded-full capitalize ${statusStyles[product.status] ?? ""}`}
          >
            {product.status}
          </Badge>
          {off > 0 ? (
            <Badge className="rounded-full bg-primary text-primary-foreground">
              {off}% off
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {product.brands?.name ?? "Brand"} • {product.categories?.name ?? "Appliance"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-foreground">
          <Link to="/products/$slug" params={{ slug: product.slug }}>
            {product.title}
          </Link>
        </h3>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <div className="flex gap-1">
            <dt>Condition:</dt>
            <dd className="font-medium text-foreground">{product.condition}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Capacity:</dt>
            <dd className="font-medium text-foreground">{product.capacity ?? "—"}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Age:</dt>
            <dd className="font-medium text-foreground">
              {product.age_years ? `${product.age_years} yrs` : "—"}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>Model:</dt>
            <dd className="truncate font-medium text-foreground">
              {product.model ?? "—"}
            </dd>
          </div>
        </dl>

        {product.warranty_months > 0 ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <ShieldCheck className="size-4" />
            {product.warranty_months} months warranty
          </p>
        ) : null}

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatINR(product.price)}
          </span>
          {product.mrp && off > 0 ? (
            <span className="pb-0.5 text-sm text-muted-foreground line-through">
              {formatINR(product.mrp)}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" className="flex-1 rounded-full">
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              View Details
            </Link>
          </Button>
          <Button asChild size="icon" variant="outline" className="rounded-full">
            <a href={business.phoneHref} aria-label={`Call about ${product.title}`}>
              <Phone className="size-4" />
            </a>
          </Button>
          <Button asChild size="icon" variant="outline" className="rounded-full">
            <a
              href={whatsappLink(
                `Hi ${business.name}, I'm interested in the ${product.title} listed at ${formatINR(product.price)}. Is it still available?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${product.title}`}
            >
              <MessageCircle className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
