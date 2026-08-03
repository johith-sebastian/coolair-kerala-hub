import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { business } from "@/config/business";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Sign In | Cool Air Kochi" },
      {
        name: "description",
        content:
          "Sign in to the Cool Air admin dashboard to manage service bookings, installation requests and refurbished product listings.",
      },
      { property: "og:title", content: "Staff Sign In | Cool Air Kochi" },
      {
        property: "og:description",
        content: "Cool Air team access for managing bookings and listings.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  async function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(data.get("email") ?? "").trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: String(data.get("full_name") ?? "").trim() },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. Check your email to confirm before signing in.");
  }

  return (
    <main className="grid min-h-screen place-items-center gradient-hero px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary-foreground/15 text-primary-foreground">
            <Snowflake className="size-5" />
          </span>
          <span className="text-xl font-bold text-primary-foreground">
            {business.name}
          </span>
        </Link>

        <div className="glass-strong rounded-4xl p-7 md:p-9">
          <h1 className="text-2xl font-bold text-foreground">Team access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage bookings, requests and product listings.
          </p>

          <Tabs defaultValue="signin" className="mt-7">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} placeholder="you@coolairkochi.in" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" name="full_name" required maxLength={100} placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup_email">Email</Label>
                  <Input id="signup_email" name="email" type="email" required maxLength={255} placeholder="you@coolairkochi.in" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup_password">Password</Label>
                  <Input id="signup_password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Admin rights are granted by an existing administrator.{" "}
            <Link to="/" className="font-medium text-primary hover:underline">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
