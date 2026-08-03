import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { business, whatsappLink } from "@/config/business";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Cool Air Kochi | Phone, WhatsApp & Workshop Address" },
      {
        name: "description",
        content:
          "Reach Cool Air in Palarivattom, Kochi. Call, WhatsApp or email us for appliance repair, installation and refurbished appliance enquiries across Ernakulam.",
      },
      { property: "og:title", content: "Contact Cool Air Kochi" },
      {
        property: "og:description",
        content:
          "Phone, WhatsApp, email and workshop location for Cool Air appliance service in Kochi, Kerala.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const cards = [
    {
      icon: Phone,
      title: "Call us",
      value: business.phone,
      href: business.phoneHref,
      note: "Fastest way to reach a technician",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: business.phone,
      href: whatsappLink("Hi Cool Air, I have a question about my appliance."),
      note: "Send photos for a quick estimate",
    },
    {
      icon: Mail,
      title: "Email",
      value: business.email,
      href: `mailto:${business.email}`,
      note: "For quotes, AMC and bulk enquiries",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="We're a call away from your appliance problem"
        description={`${business.addressLine}, ${business.city}, ${business.state} ${business.pincode}. Walk in with small appliances or book a doorstep visit for the big ones.`}
      />

      <section className="section">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-3">
            {cards.map((card, index) => (
              <Reveal key={card.title} delay={index * 70}>
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glass card-hover flex h-full flex-col rounded-3xl p-7"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <card.icon className="size-6" />
                  </span>
                  <h2 className="mt-5 text-base font-semibold text-foreground">
                    {card.title}
                  </h2>
                  <p className="mt-1.5 break-words text-lg font-bold text-primary">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{card.note}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-7">
                <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
                  <MapPin className="size-5 text-primary" />
                  Workshop address
                </h2>
                <address className="mt-4 text-sm not-italic leading-relaxed text-muted-foreground">
                  {business.legalName}
                  <br />
                  {business.addressLine}
                  <br />
                  {business.city}, {business.state} {business.pincode}
                  <br />
                  {business.country}
                </address>

                <h3 className="mt-8 flex items-center gap-2.5 text-lg font-semibold text-foreground">
                  <Clock className="size-5 text-primary" />
                  Working hours
                </h3>
                <dl className="mt-4 space-y-2.5">
                  {business.hours.map((slot) => (
                    <div
                      key={slot.day}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <dt className="text-muted-foreground">{slot.day}</dt>
                      <dd className="font-medium text-foreground">{slot.time}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild className="rounded-full">
                    <a
                      href={business.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="size-4" />
                      Get directions
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/book-service">Book a service</Link>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full overflow-hidden rounded-3xl border border-border shadow-soft">
                <iframe
                  title="Cool Air workshop location on Google Maps"
                  src={business.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[420px] w-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-card/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Quick links"
            title="Know what you need? Skip the call."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { to: "/book-service", title: "Book a repair", text: "Doorstep diagnosis and repair slots." },
              { to: "/book-installation", title: "Book installation", text: "New AC, washing machine or purifier setup." },
              { to: "/sell", title: "Sell your appliance", text: "Get a fair offer within 24 hours." },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="card-hover rounded-3xl border border-border bg-card p-7"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
