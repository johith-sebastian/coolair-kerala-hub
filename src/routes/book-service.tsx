import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
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
import { business, keralaDistricts, timeSlots } from "@/config/business";
import { supabase } from "@/integrations/supabase/client";
import { uploadCustomerFile, useCategories } from "@/lib/queries";

export const Route = createFileRoute("/book-service")({
  head: () => ({
    meta: [
      { title: "Book Appliance Repair in Kochi | Cool Air Service Request" },
      {
        name: "description",
        content:
          "Book a doorstep appliance repair slot with Cool Air Kochi. Share your appliance details and preferred time — we confirm on WhatsApp within an hour.",
      },
      { property: "og:title", content: "Book Appliance Repair in Kochi | Cool Air" },
      {
        property: "og:description",
        content:
          "Same-day appliance service booking across Kochi and Ernakulam with transparent estimates.",
      },
    ],
  }),
  component: BookServicePage,
});

function BookServicePage() {
  const { data: categories = [] } = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("Ernakulam");
  const [slot, setSlot] = useState<string>(timeSlots[0] ?? "");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const customer_name = String(data.get("customer_name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const problem_description = String(data.get("problem") ?? "").trim();

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
    if (address.length < 10 || address.length > 400) {
      toast.error("Please enter a complete address.");
      return;
    }
    if (problem_description.length < 10 || problem_description.length > 1000) {
      toast.error("Please describe the problem in a little more detail.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be smaller than 5 MB.");
      return;
    }

    setSubmitting(true);
    try {
      let image_url: string | null = null;
      if (file) image_url = await uploadCustomerFile(file, "bookings");

      const { data: inserted, error } = await supabase
        .from("bookings")
        .insert({
          customer_name,
          phone,
          whatsapp: String(data.get("whatsapp") ?? "").trim() || phone,
          email: String(data.get("email") ?? "").trim() || null,
          appliance_category: category,
          brand: String(data.get("brand") ?? "").trim() || null,
          model: String(data.get("model") ?? "").trim() || null,
          problem_description,
          address,
          district,
          pincode: String(data.get("pincode") ?? "").trim() || null,
          preferred_date: String(data.get("preferred_date") ?? "") || null,
          preferred_time: slot,
          image_url,
        })
        .select("reference")
        .maybeSingle();

      if (error) throw error;
      setReference(inserted?.reference ?? "CA-BOOKING");
      form.reset();
      setFile(null);
      toast.success("Booking received. We'll confirm shortly.");
    } catch (error) {
      console.error(error);
      toast.error("Could not submit your booking. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <>
        <PageHero eyebrow="Booking confirmed" title="We've got your request" />
        <section className="section">
          <div className="container-x max-w-xl text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              Reference {reference}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our team will call or WhatsApp you within an hour to confirm the technician
              and slot. Keep this reference handy.
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
                Book another service
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
        eyebrow="Repair & Service"
        title="Book a doorstep service slot"
        description="Fill in the details below. A photo of the appliance or its error code helps our technician arrive prepared."
      />

      <section className="section">
        <div className="container-x max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="glass space-y-6 rounded-4xl p-6 md:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="customer_name">
                <Input id="customer_name" name="customer_name" maxLength={100} required placeholder="Your name" />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                <Input id="phone" name="phone" type="tel" maxLength={15} required placeholder="98470 12345" />
              </Field>
              <Field label="WhatsApp number" htmlFor="whatsapp" optional>
                <Input id="whatsapp" name="whatsapp" type="tel" maxLength={15} placeholder="Same as phone" />
              </Field>
              <Field label="Email" htmlFor="email" optional>
                <Input id="email" name="email" type="email" maxLength={255} placeholder="you@example.com" />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
              <Field label="Brand" htmlFor="brand" optional>
                <Input id="brand" name="brand" maxLength={60} placeholder="LG, Samsung…" />
              </Field>
              <Field label="Model number" htmlFor="model" optional>
                <Input id="model" name="model" maxLength={80} placeholder="e.g. FHM1207ZDL" />
              </Field>
              <Field label="Preferred date" htmlFor="preferred_date" optional>
                <Input id="preferred_date" name="preferred_date" type="date" />
              </Field>
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
              <Field label="District" htmlFor="district">
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger id="district"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {keralaDistricts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Service address" htmlFor="address">
              <Textarea id="address" name="address" rows={3} maxLength={400} required placeholder="House name, street, landmark, city" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Pincode" htmlFor="pincode" optional>
                <Input id="pincode" name="pincode" maxLength={6} placeholder="682025" />
              </Field>
              <Field label="Appliance photo" htmlFor="photo" optional>
                <label
                  htmlFor="photo"
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50"
                >
                  <Upload className="size-4 shrink-0" />
                  <span className="truncate">{file ? file.name : "Upload a photo"}</span>
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </Field>
            </div>

            <Field label="Describe the problem" htmlFor="problem">
              <Textarea
                id="problem"
                name="problem"
                rows={4}
                maxLength={1000}
                required
                placeholder="e.g. AC runs but doesn't cool, water dripping from indoor unit"
              />
            </Field>

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? "Submitting…" : "Submit booking request"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We only use your details to service this request.
            </p>
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
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}
