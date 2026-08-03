import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, IndianRupee, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
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
import { business } from "@/config/business";
import { supabase } from "@/integrations/supabase/client";
import { uploadCustomerFile, useCategories } from "@/lib/queries";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell Your Old Appliance in Kochi | Cool Air Buys Used Appliances" },
      {
        name: "description",
        content:
          "Sell your used AC, fridge, washing machine or microwave in Kochi. Share photos with Cool Air and get a fair cash offer within 24 hours, with free pickup.",
      },
      { property: "og:title", content: "Sell Your Old Appliance in Kochi | Cool Air" },
      {
        property: "og:description",
        content:
          "Fair offers and free pickup for used home appliances across Ernakulam.",
      },
    ],
  }),
  component: SellPage,
});

const conditions = ["Excellent", "Good", "Fair", "Needs repair", "Not working"];

function SellPage() {
  const { data: categories = [] } = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("Good");
  const [files, setFiles] = useState<File[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 4);
    setFiles(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const customer_name = String(data.get("customer_name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!customer_name || customer_name.length > 100) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!category) {
      toast.error("Please choose the appliance type.");
      return;
    }
    if (files.some((f) => f.size > 5 * 1024 * 1024)) {
      toast.error("Each photo must be smaller than 5 MB.");
      return;
    }

    setSubmitting(true);
    try {
      const images: string[] = [];
      for (const file of files) {
        images.push(await uploadCustomerFile(file, "sell-requests"));
      }

      const expected = String(data.get("expected_price") ?? "").trim();
      const year = String(data.get("purchase_year") ?? "").trim();

      const { data: inserted, error } = await supabase
        .from("sell_requests")
        .insert({
          customer_name,
          phone,
          product_category: category,
          brand: String(data.get("brand") ?? "").trim() || null,
          model: String(data.get("model") ?? "").trim() || null,
          condition,
          purchase_year: year ? Number(year) : null,
          expected_price: expected ? Number(expected) : null,
          address: String(data.get("address") ?? "").trim() || null,
          comments: String(data.get("comments") ?? "").trim().slice(0, 1000) || null,
          images,
        })
        .select("reference")
        .maybeSingle();

      if (error) throw error;
      setReference(inserted?.reference ?? "CA-SELL");
      form.reset();
      setFiles([]);
      toast.success("Details received. We'll send you an offer soon.");
    } catch (error) {
      console.error(error);
      toast.error("Could not submit your details. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <>
        <PageHero eyebrow="Submitted" title="Your appliance is under review" />
        <section className="section">
          <div className="container-x max-w-xl text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              Reference {reference}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our team reviews the photos and details, then calls you with an offer —
              usually within 24 hours. Pickup is free if you accept.
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
                Sell another appliance
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
        eyebrow="Sell to us"
        title="Turn an unused appliance into cash"
        description="Working or not, we buy ACs, refrigerators, washing machines and more across Kochi. Share a few photos and we'll make you a fair offer."
      />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="Three steps, no haggling" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { step: "01", title: "Share details", text: "Fill the form with photos and the appliance's condition." },
              { step: "02", title: "Get an offer", text: "We assess and call you with a transparent price within 24 hours." },
              { step: "03", title: "Free pickup", text: "Accept and we collect from your home and pay on the spot." },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 70}>
                <div className="glass h-full rounded-3xl p-7">
                  <span className="text-sm font-bold tracking-[0.2em] text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl">
            <form onSubmit={handleSubmit} className="glass space-y-6 rounded-4xl p-6 md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="customer_name">
                  <Input id="customer_name" name="customer_name" maxLength={100} required placeholder="Your name" />
                </Field>
                <Field label="Phone number" htmlFor="phone">
                  <Input id="phone" name="phone" type="tel" maxLength={15} required placeholder="98470 12345" />
                </Field>
                <Field label="Appliance type" htmlFor="category">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select appliance" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Condition" htmlFor="condition">
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Brand" htmlFor="brand" optional>
                  <Input id="brand" name="brand" maxLength={60} placeholder="LG, Whirlpool…" />
                </Field>
                <Field label="Model" htmlFor="model" optional>
                  <Input id="model" name="model" maxLength={80} placeholder="Model number" />
                </Field>
                <Field label="Year of purchase" htmlFor="purchase_year" optional>
                  <Input id="purchase_year" name="purchase_year" type="number" min={1990} max={2030} placeholder="2019" />
                </Field>
                <Field label="Expected price" htmlFor="expected_price" optional>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="expected_price"
                      name="expected_price"
                      type="number"
                      min={0}
                      max={500000}
                      className="pl-9"
                      placeholder="8000"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Pickup address" htmlFor="address" optional>
                <Textarea id="address" name="address" rows={3} maxLength={400} placeholder="House name, street, landmark, city" />
              </Field>

              <div className="space-y-2">
                <Label htmlFor="photos">
                  Photos
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (up to 4)
                  </span>
                </Label>
                <label
                  htmlFor="photos"
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50"
                >
                  <Upload className="size-4 shrink-0" />
                  Add photos of the appliance
                </label>
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => addFiles(e.target.files)}
                />
                {files.length ? (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {files.map((file, i) => (
                      <li
                        key={`${file.name}-${i}`}
                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <Field label="Anything else we should know?" htmlFor="comments" optional>
                <Textarea id="comments" name="comments" rows={4} maxLength={1000} placeholder="Faults, missing accessories, service history…" />
              </Field>

              <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {submitting ? "Submitting…" : "Get my offer"}
              </Button>
            </form>
          </div>
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
