import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { business, whatsappLink } from "@/config/business";
import { discountPercent, formatINR } from "@/lib/format";
import { useProduct, useProducts } from "@/lib/queries";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Refurbished Appliance | Cool Air Kochi` },
        {
          name: "description",
          content: `Buy a tested refurbished ${name} from Cool Air Kochi. Warranty, delivery and installation available across Ernakulam.`,
        },
        { property: "og:title", content: `${name} | Cool Air Kochi` },
        {
          property: "og:description",
          content: `Refurbished ${name} inspected and warranted by Cool Air, Kochi.`,
        },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: all = [] } = useProducts({ limit: 8 });
  const [active, setActive] = useState(0);

  if (isLoading) {
    return (
      <div className="section container-x grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-4xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section container-x text-center">
        <h1 className="text-3xl font-bold text-foreground">Appliance not found</h1>
        <p className="mt-3 text-muted-foreground">
          This listing may have been sold. Browse the rest of our stock.
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/products">Back to catalogue</Link>
        </Button>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["/images/products/product-fridge.jpg"];
  const off = discountPercent(product.price, product.mrp);
  const related = all.filter((p) => p.id !== product.id).slice(0, 3);

  const specs = [
    ["Brand", product.brands?.name],
    ["Category", product.categories?.name],
    ["Model", product.model],
    ["Capacity", product.capacity],
    ["Condition", product.condition],
    ["Age", product.age_years ? `${product.age_years} years` : null],
    ["Warranty", product.warranty_months ? `${product.warranty_months} months` : "No warranty"],
    ["Availability", product.status],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <>
      <div className="container-x pt-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to all appliances
        </Link>
      </div>

      <section className="section pt-8">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-4xl border border-border bg-secondary/40 shadow-lift">
              <img
                src={images[active]}
                alt={product.title}
                width={1024}
                height={768}
                className="aspect-[4/3] w-full object-contain p-8"
              />
            </div>
            {images.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`size-20 overflow-hidden rounded-2xl border bg-secondary/40 p-2 transition-colors ${
                      i === active ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-contain" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full capitalize">
                {product.status}
              </Badge>
              {product.warranty_months > 0 ? (
                <Badge className="rounded-full bg-success/15 text-success">
                  {product.warranty_months} months warranty
                </Badge>
              ) : null}
              {off > 0 ? (
                <Badge className="rounded-full">{off}% off</Badge>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {product.brands?.name} • {product.categories?.name}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-bold text-foreground">
                {formatINR(product.price)}
              </span>
              {product.mrp && off > 0 ? (
                <span className="pb-1.5 text-lg text-muted-foreground line-through">
                  {formatINR(product.mrp)}
                </span>
              ) : null}
            </div>

            {product.description ? (
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : null}

            <dl className="mt-8 grid gap-x-6 gap-y-3 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium capitalize text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, text: "Tested for 48 hours before listing" },
                { icon: Truck, text: "Delivery across Ernakulam" },
                { icon: CheckCircle2, text: "Installation available on request" },
                { icon: Phone, text: "Post-sale service support" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <a
                  href={whatsappLink(
                    `Hi ${business.name}, I'm interested in the ${product.title} (${formatINR(product.price)}). Is it available?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Enquire on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={business.phoneHref}>
                  <Phone className="size-4" />
                  Call {business.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section bg-card/40">
          <div className="container-x">
            <SectionHeading eyebrow="You may also like" title="More refurbished picks" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
