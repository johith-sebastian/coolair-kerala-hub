import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { services } from "@/config/services";
import { whatsappLink } from "@/config/business";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Appliance Repair & Service in Kochi | Cool Air" },
      {
        name: "description",
        content:
          "AC service, refrigerator, washing machine, microwave, water purifier and dishwasher repair in Kochi. Installation, uninstallation and AMC plans by Cool Air technicians.",
      },
      { property: "og:title", content: "Appliance Repair & Service in Kochi | Cool Air" },
      {
        property: "og:description",
        content:
          "Doorstep appliance repair and maintenance across Ernakulam with genuine parts and transparent pricing.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Repair & Maintenance"
        title="Appliance service, done properly the first time"
        description="Our technicians handle diagnosis, repair, installation and annual maintenance for every major home appliance — at your doorstep across Kochi and Ernakulam."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/book-service">Book a Service</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
          >
            <a
              href={whatsappLink("Hi Cool Air, I need a service quote.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Get a quote
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 50}>
                <article className="card-hover flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                    <service.icon className="size-6" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <p className="text-sm text-muted-foreground">
                      From{" "}
                      <span className="text-base font-bold text-foreground">
                        {formatINR(service.from)}
                      </span>
                    </p>
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
                      <Link to="/book-service">
                        Book <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-card/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="How it works"
            title="Four simple steps from call to cool"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Tell us the problem",
                text: "Book online, call or WhatsApp a photo of the appliance and its error code.",
              },
              {
                step: "02",
                title: "Slot confirmation",
                text: "We confirm a visiting slot on WhatsApp with the technician's name and number.",
              },
              {
                step: "03",
                title: "Diagnosis & estimate",
                text: "The technician inspects on site and shares a fixed estimate before starting.",
              },
              {
                step: "04",
                title: "Repair & warranty",
                text: "Work completed with genuine parts, GST invoice and 90 days repair warranty.",
              },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 70}>
                <div className="glass h-full rounded-3xl p-7">
                  <span className="text-sm font-bold tracking-[0.2em] text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
