import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, MapPin, Sparkles, Users, Wrench } from "lucide-react";
import technicianImage from "@/assets/technician.jpg";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCounter } from "@/components/StatCounter";
import { business } from "@/config/business";
import { stats } from "@/config/services";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Cool Air | Family-Run Appliance Experts in Kochi" },
      {
        name: "description",
        content:
          "Cool Air is a family-owned home appliance repair and refurbished sales business in Kochi, Kerala, serving Ernakulam households since 2022.",
      },
      { property: "og:title", content: "About Cool Air | Appliance Experts in Kochi" },
      {
        property: "og:description",
        content:
          "Meet the family behind Cool Air — honest appliance repair, installation and refurbished sales in Kochi.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Heart,
    title: "Family-run, not a call centre",
    text: "You speak to the same people every time. No ticket numbers, no scripts, no runaround.",
  },
  {
    icon: Wrench,
    title: "Repair before replace",
    text: "If an appliance can be repaired economically, we will tell you — even if selling you one earns us more.",
  },
  {
    icon: Award,
    title: "Genuine parts only",
    text: "We source original or OEM-grade spares and show you the old part we removed.",
  },
  {
    icon: Users,
    title: "Built on referrals",
    text: "Most of our work comes from neighbours recommending us. That keeps us honest.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="A Kochi family that keeps homes running"
        description="Cool Air started in 2022 as a two-person workshop in Palarivattom. Today we run two divisions — repair & service, and refurbished appliance sales — with the same promise we began with."
      />

      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-4xl border border-border shadow-lift">
              <img
                src={technicianImage}
                alt="Cool Air technician working on an appliance"
                loading="lazy"
                width={1400}
                height={1000}
                className="size-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Since 2022"
                title="From a single workshop to Ernakulam's trusted appliance partner"
              />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  What began with one technician, a toolbox and a scooter is now a small
                  team covering Kochi, Aluva, Kakkanad, Tripunithura and beyond. We handle
                  everything from a noisy washing machine drum to a full annual maintenance
                  contract for an apartment block.
                </p>
                <p>
                  Our refurbished division came from a simple observation: perfectly good
                  appliances were being scrapped for faults that cost a few hundred rupees
                  to fix. We buy them, restore them properly and resell them with warranty
                  so families can own reliable appliances without paying showroom prices.
                </p>
                <p>
                  Everything we do is built around one idea — treat every customer's home
                  the way we would treat our own.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">Visit our workshop</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/services">Explore services</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-14">
        <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four rules we never break"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <div className="glass card-hover flex h-full gap-5 rounded-3xl p-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <value.icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-card/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Coverage"
            title="Where we work"
            description="Doorstep service across these areas, with workshop support for everything else in Kerala."
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {business.serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
              >
                <MapPin className="size-4 text-primary" />
                {area}
              </span>
            ))}
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Outside these areas? Call us — we still might be able to help.
          </p>
        </div>
      </section>
    </>
  );
}
