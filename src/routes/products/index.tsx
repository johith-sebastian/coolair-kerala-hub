import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrands, useCategories, useProducts } from "@/lib/queries";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Refurbished Home Appliances in Kochi | Cool Air Store" },
      {
        name: "description",
        content:
          "Buy tested refurbished ACs, refrigerators, washing machines and more in Kochi. Warranty-backed second hand appliances at honest prices from Cool Air.",
      },
      { property: "og:title", content: "Refurbished Home Appliances in Kochi | Cool Air" },
      {
        property: "og:description",
        content:
          "Second hand appliances restored, tested and sold with warranty. Delivery across Ernakulam.",
      },
    ],
  }),
  component: ProductsPage,
});

const SORTS = {
  newest: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
} as const;

function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState<keyof typeof SORTS>("newest");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.categories?.slug !== category) return false;
      if (brand !== "all" && p.brands?.slug !== brand) return false;
      if (condition !== "all" && p.condition !== condition) return false;
      if (!term) return true;
      return [p.title, p.model, p.brands?.name, p.categories?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return 0;
    });
  }, [products, search, category, brand, condition, sort]);

  const conditions = useMemo(
    () => Array.from(new Set(products.map((p) => p.condition).filter(Boolean))),
    [products],
  );

  const reset = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setCondition("all");
    setSort("newest");
  };

  return (
    <>
      <PageHero
        eyebrow="Refurbished Sales"
        title="Quality second-hand appliances, restored and warranted"
        description="Every appliance we sell is inspected, deep cleaned, repaired with genuine spares and tested for at least 48 hours before listing."
      />

      <section className="section">
        <div className="container-x">
          <div className="glass rounded-3xl p-5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
              <div className="space-y-1.5">
                <Label htmlFor="product-search">Search</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="product-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by model, brand…"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any condition</SelectItem>
                    {conditions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Sort by</Label>
                <Select
                  value={sort}
                  onValueChange={(v) => setSort(v as keyof typeof SORTS)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORTS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="size-4" />
                {isLoading
                  ? "Loading appliances…"
                  : `${filtered.length} appliance${filtered.length === 1 ? "" : "s"} available`}
              </p>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={reset}>
                Reset filters
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[520px] rounded-3xl" />
                ))
              : filtered.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index, 5) * 60}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>

          {!isLoading && filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border p-14 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                No appliances match these filters
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing a filter — new stock is added every week.
              </p>
              <Button className="mt-6 rounded-full" onClick={reset}>
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
