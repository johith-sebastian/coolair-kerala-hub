import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { business, timeSlots } from "@/config/business";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/book-installation")({
  head: () => ({
    meta: [
      { title: "Appliance Installation & Uninstallation in Kochi | Cool Air" },
      {
        name: "description",
        content:
          "Book professional AC, washing machine, water purifier and chimney installation or uninstallation in Kochi with Cool Air's trained technicians.",
      },
      { property: "og:title", content: "Appliance Installation in Kochi | Cool Air" },
      {
        property: "og:description",
        content:
          "Installation, uninstallation and shifting of home appliances across Ernakulam, done safely.",
      },
    ],
  }),
  component: InstallationPage,
});

const productTypes = [
  "Split AC",
  "Window AC",
  "Cassette AC",
  "Washing Machine",
  "Refrigerator",
  "Water Purifier",
  "Chimney",
  "Dishwasher",
  "Other",
];

function InstallationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState("installation");
  const [productType, setProductType] = useState("");
  const [slot, setSlot] = useState(timeSlots[0]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const customer_name = String(data.get("customer_name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();

    if (!customer_name || customer_name.length > 100) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!productType) {
      toast.error("Please choose the appliance type.");
      return;
    }
    if (address.length < 10 || address.length > 400) {
      toast.error("Please enter a complete address.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: inserted, error } = await supabase
        .from("installation_requests")
        .insert({
          customer_name,
          phone,
          product_type: productType,
          service_type: serviceType,
          brand: String(data.get("brand") ?? "").trim() || null,
          address,
          preferred_date: String(data.get("preferred_date") ?? "") || null,
          preferred_time: slot,
          notes: String(data.get("notes") ?? "").trim().slice(0, 1000) || null,
        })
        .select("reference")
        .maybeSingle();

      if (error) throw error;
      setReference(inserted?.reference ?? "CA-INSTALL");
      form.reset();
      toast.success("Request received. We'll confirm shortly.");
    } catch (error) {
      console.error(error);
      toast.error("Could not submit your request. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <>
        <PageHero eyebrow="Request received" title="Installation slot requested" />
        <section className="section">
          <div className="container-x max-w-xl text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              Reference {reference}
            </h2>
            <p className="mt-3 text-muted-foreground">
              We'll call you shortly to confirm materials, pricing and the technician's
              arrival window.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full">
                <a href={business.phoneHref}>Call {business.phone}</a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setReference(null)}
              >
                Submit another request
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Installation & Uninstallation"
        title="Fitted properly, tested before we leave"
        description="Copper piping, brackets, levelling, drainage and a full test run — our installation team does the job the way the manufacturer intended."
      />

      <section className="section">
        <div className="container-x max-w-3xl">
          <form onSubmit={handleSubmit} className="glass space-y-6 rounded-4xl p-6 md:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="customer_name">
                <Input id="customer_name" name="customer_name" maxLength={100} required placeholder="Your name" />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                <Input id="phone" name="phone" type="tel" maxLength={15} required placeholder="98470 12345" />
              </Field>
              <Field label="Service needed" htmlFor="service_type">
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="service_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="uninstallation">Uninstallation</SelectItem>
                    <SelectItem value="shifting">Shifting (both)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Appliance type" htmlFor="product_type">
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger id="product_type">
                    <SelectValue placeholder="Select appliance" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Brand" htmlFor="brand" optional>
                <Input id="brand" name="brand" maxLength={60} placeholder="Daikin, Voltas…" />
              </Field>
              <Field label="Preferred date" htmlFor="preferred_date" optional>
                <Input id="preferred_date" name="preferred_date" type="date" />
              </Field>
            </div>

            <Field label="Preferred time" htmlFor="slot">
              <Select value={slot} onValueChange={setSlot}>
                <SelectTrigger id="slot"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Installation address" htmlFor="address">
              <Textarea id="address" name="address" rows={3} maxLength={400} required placeholder="House name, street, landmark, city" />
            </Field>

            <Field label="Notes for the technician" htmlFor="notes" optional>
              <Textarea id="notes" name="notes" rows={4} maxLength={1000} placeholder="Floor number, wall type, distance between indoor and outdoor unit…" />
            </Field>

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? "Submitting…" : "Request installation"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}
