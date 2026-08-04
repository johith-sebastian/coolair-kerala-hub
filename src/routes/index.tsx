import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import heroImage from "@/assets/hero-ac.jpg";
import technicianImage from "@/assets/technician.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCounter } from "@/components/StatCounter";
import { business, brandNames, whatsappLink } from "@/config/business";
import { highlights, services, stats } from "@/config/services";
import { useProducts, useTestimonials } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Cool Air Kochi | Appliance Repair, Service & Refurbished Appliances",
      },
      {
        name: "description",
        content:
          "Cool Air is Kochi's trusted family-run home appliance service since 2020. AC, fridge, washing machine repair, installation, AMC and quality refurbished appliances with warranty.",
      },
      {
        property: "og:title",
        content: "Cool Air Kochi | Appliance Repair, Service & Refurbished Appliances",
      },
      {
        property: "og:description",
        content:
          "Repair, buy, sell and install home appliances in Kochi. Experienced technicians, doorstep service and warranty-backed refurbished appliances.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: featured = [] } = useProducts({ featured: true, limit: 3 });
  const { data: testimonials = [] } = useTestimonials();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modern split air conditioner cooling a room"
            width={1600}
            height={1200}
            className="size-full object-cover opacity-40"
          />
        </div>
        <div className="absolute -right-20 top-1/4 size-96 animate-float rounded-full bg-accent/20 blur-3xl" />
        <div className="container-x relative flex min-h-[88vh] flex-col justify-center py-20">
          <div className="max-w-2xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
              <Sparkles className="size-3.5" />
              Serving Kerala since {business.foundedYear}
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] text-primary-foreground md:text-7xl">
              Cool Air
            </h1>
            <p className="mt-4 text-lg font-semibold tracking-[0.22em] text-primary-foreground/85 md:text-xl">
              REPAIR • BUY • SELL • INSTALL
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Trusted home appliance experts serving Kerala since 2020. Doorstep repair,
              professional installation and hand-picked refurbished appliances backed by
              real warranty.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link to="/book-service">
                  Book Service
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Link to="/products">View Products</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
                <a
                  href={whatsappLink("Hi Cool Air, I need help with my home appliance.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Cool Air"
            title="Service that feels premium, priced for real families"
            description="Four years of appliance work across Kochi has taught us one thing: people come back for honesty, not discounts."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="glass card-hover h-full rounded-3xl p-7">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card/50 py-14">
        <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Services"
            title="Every appliance in your home, handled by one team"
            description="From an AC that stopped cooling to a full annual maintenance plan — we cover it all with genuine parts."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, index) => (
              <Reveal key={service.slug} delay={index * 60}>
                <Link
                  to="/book-service"
                  className="card-hover flex h-full flex-col rounded-3xl border border-border bg-card p-7"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                    <service.icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Book now <ArrowRight className="size-4" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/services">See all services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section bg-card/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Refurbished Store"
            title="Hand-picked appliances, restored to perform"
            description="Every unit is stripped, serviced, tested and photographed before it reaches this page."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/products">
                Browse full catalogue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TECHNICIAN BAND */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-4xl border border-border shadow-lift">
              <img
                src={technicianImage}
                alt="Cool Air technician servicing an air conditioner at a customer's home"
                loading="lazy"
                width={1400}
                height={1000}
                className="size-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Doorstep Support"
                title="A technician at your door, usually the same day"
                description="Call or WhatsApp us with the problem. We share an honest estimate before starting work, carry genuine spares, and clean up before we leave."
              />
              <ul className="mt-8 space-y-3.5">
                {[
                  "Free diagnosis with every paid repair",
                  "90 days warranty on major repair work",
                  "Service across Ernakulam and nearby districts",
                  "GST invoice and service report for every job",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <ShieldCheck className="size-3.5" />
                    </span>
                    <span className="text-sm text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <a href={business.phoneHref}>
                    <Phone className="size-4" />
                    {business.phone}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/book-installation">Book Installation</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section bg-card/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Rated 4.9 by Kochi households"
            description="Real reviews from customers across Kakkanad, Edappally, Aluva, Vyttila and Tripunithura."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <figure className="glass card-hover flex h-full flex-col rounded-3xl p-7">
                  <Quote className="size-7 text-primary/40" />
                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.message}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-foreground">
                      {item.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.location} · {item.service_type}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Brands We Support"
            title="Trained on every major appliance brand"
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brandNames.map((brand, index) => (
              <Reveal key={brand} delay={index * 30}>
                <div className="grid h-20 place-items-center rounded-2xl border border-border bg-card text-base font-semibold tracking-tight text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                  {brand}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-4xl gradient-hero px-8 py-14 text-center md:px-16 md:py-20">
            <div className="absolute -left-10 -top-10 size-56 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
                Appliance trouble? Let's fix it today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Book a service slot online, or send us a WhatsApp message with a photo of
                the appliance for a quick estimate.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link to="/book-service">Book a Service</Link>
                </Button>
                <Button asChild size="lg" className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
                  <a
                    href={whatsappLink("Hi Cool Air, I'd like a quick estimate.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
