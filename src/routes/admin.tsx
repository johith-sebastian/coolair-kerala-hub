import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  LogOut,
  Package,
  Snowflake,
  Tag,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { business } from "@/config/business";
import { formatDate, formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type RequestStatus = Database["public"]["Enums"]["request_status"];

const STATUSES: RequestStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const statusTone: Record<RequestStatus, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  in_progress: "bg-accent/20 text-accent-foreground border-accent/40",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Cool Air Kochi" },
      {
        name: "description",
        content:
          "Internal Cool Air dashboard for managing service bookings, installation requests, sell requests and refurbished product listings.",
      },
      { property: "og:title", content: "Admin Dashboard | Cool Air Kochi" },
      { property: "og:description", content: "Cool Air internal operations dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .in("role", ["admin", "staff"])
        .maybeSingle();
      if (!active) return;
      setIsAdmin(Boolean(role));
      setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checking) {
    return (
      <div className="container-x space-y-4 py-20">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-foreground">No dashboard access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but has not been granted admin or staff rights. Ask
            an existing administrator to add your role.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button className="rounded-full" onClick={signOut}>
              Sign out
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-strong">
        <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Snowflake className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold text-foreground">
                {business.name} Admin
              </span>
              <span className="block truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Operations dashboard
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-x py-10">
        <Tabs defaultValue="bookings">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="bookings" className="gap-2">
              <Wrench className="size-4" /> Service bookings
            </TabsTrigger>
            <TabsTrigger value="installations" className="gap-2">
              <CalendarCheck className="size-4" /> Installations
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-2">
              <Tag className="size-4" /> Sell requests
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="size-4" /> Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="pt-6">
            <BookingsTable />
          </TabsContent>
          <TabsContent value="installations" className="pt-6">
            <InstallationsTable />
          </TabsContent>
          <TabsContent value="sell" className="pt-6">
            <SellTable />
          </TabsContent>
          <TabsContent value="products" className="pt-6">
            <ProductsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <h2 className="border-b border-border px-6 py-4 text-sm font-semibold text-foreground">
        {title}
      </h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: RequestStatus;
  onChange: (value: RequestStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as RequestStatus)}>
      <SelectTrigger className="h-8 w-[150px] text-xs capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s.replace("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function useStatusMutation(table: "bookings" | "installation_requests" | "sell_requests") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      const { error } = await supabase.from(table).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Could not update status"),
  });
}

function BookingsTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const mutation = useStatusMutation("bookings");

  if (isLoading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <Panel title={`Service bookings (${data.length})`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Appliance</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {row.reference}
                <span className="block text-xs text-muted-foreground">
                  {formatDate(row.created_at)}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {row.customer_name}
                <span className="block text-xs text-muted-foreground">{row.phone}</span>
                <span className="block text-xs text-muted-foreground">{row.district}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {row.appliance_category}
                <span className="block text-xs text-muted-foreground">
                  {row.brand ?? "—"} {row.model ?? ""}
                </span>
              </TableCell>
              <TableCell className="max-w-[320px]">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {row.problem_description}
                </p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(row.preferred_date)}
                <span className="block text-xs">{row.preferred_time ?? "—"}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`mb-2 rounded-full capitalize ${statusTone[row.status]}`}>
                  {row.status.replace("_", " ")}
                </Badge>
                <StatusSelect
                  value={row.status}
                  onChange={(status) => mutation.mutate({ id: row.id, status })}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-14 text-center text-muted-foreground">
                No service bookings yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Panel>
  );
}

function InstallationsTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "installation_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("installation_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const mutation = useStatusMutation("installation_requests");

  if (isLoading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <Panel title={`Installation requests (${data.length})`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {row.reference}
                <span className="block text-xs text-muted-foreground">
                  {formatDate(row.created_at)}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {row.customer_name}
                <span className="block text-xs text-muted-foreground">{row.phone}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap capitalize">
                {row.service_type}
                <span className="block text-xs text-muted-foreground">
                  {row.product_type} · {row.brand ?? "—"}
                </span>
              </TableCell>
              <TableCell className="max-w-[280px]">
                <p className="line-clamp-2 text-sm text-muted-foreground">{row.address}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(row.preferred_date)}
                <span className="block text-xs">{row.preferred_time ?? "—"}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`mb-2 rounded-full capitalize ${statusTone[row.status]}`}>
                  {row.status.replace("_", " ")}
                </Badge>
                <StatusSelect
                  value={row.status}
                  onChange={(status) => mutation.mutate({ id: row.id, status })}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-14 text-center text-muted-foreground">
                No installation requests yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Panel>
  );
}

function SellTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "sell_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sell_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const mutation = useStatusMutation("sell_requests");

  if (isLoading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <Panel title={`Sell requests (${data.length})`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Appliance</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {row.reference}
                <span className="block text-xs text-muted-foreground">
                  {formatDate(row.created_at)}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {row.customer_name}
                <span className="block text-xs text-muted-foreground">{row.phone}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {row.product_category}
                <span className="block text-xs text-muted-foreground">
                  {row.brand ?? "—"} · {row.condition ?? "—"} · {row.purchase_year ?? "—"}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {row.expected_price ? formatINR(row.expected_price) : "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.images?.length ?? 0}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`mb-2 rounded-full capitalize ${statusTone[row.status]}`}>
                  {row.status.replace("_", " ")}
                </Badge>
                <StatusSelect
                  value={row.status}
                  onChange={(status) => mutation.mutate({ id: row.id, status })}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-14 text-center text-muted-foreground">
                No sell requests yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Panel>
  );
}

function ProductsTable() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: { is_published?: boolean; status?: Database["public"]["Enums"]["product_status"] };
    }) => {
      const { error } = await supabase.from("products").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: () => toast.error("Could not update product"),
  });

  if (isLoading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <Panel title={`Products (${data.length})`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Published</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="max-w-[320px]">
                <p className="truncate font-medium text-foreground">{row.title}</p>
                <span className="text-xs text-muted-foreground">{row.model ?? "—"}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium">
                {formatINR(row.price)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm capitalize text-muted-foreground">
                {row.condition}
              </TableCell>
              <TableCell>
                <Select
                  value={row.status}
                  onValueChange={(v) =>
                    update.mutate({
                      id: row.id,
                      values: { status: v as Database["public"]["Enums"]["product_status"] },
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-[140px] text-xs capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["available", "reserved", "sold"].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Switch
                  checked={row.is_published}
                  aria-label={`Publish ${row.title}`}
                  onCheckedChange={(checked) =>
                    update.mutate({ id: row.id, values: { is_published: checked } })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-14 text-center text-muted-foreground">
                No products yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Panel>
  );
}
