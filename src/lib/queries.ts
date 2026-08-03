import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products"> & {
  brands: Pick<Tables<"brands">, "id" | "name" | "slug"> | null;
  categories: Pick<Tables<"categories">, "id" | "name" | "slug"> | null;
};
export type Category = Tables<"categories">;
export type Brand = Tables<"brands">;
export type Testimonial = Tables<"testimonials">;
export type Booking = Tables<"bookings">;
export type InstallationRequest = Tables<"installation_requests">;
export type SellRequest = Tables<"sell_requests">;

const PRODUCT_SELECT =
  "*, brands:brand_id(id,name,slug), categories:category_id(id,name,slug)";

export function productsQuery(options?: { featured?: boolean; limit?: number }) {
  return {
    queryKey: ["products", options ?? {}],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (options?.featured) query = query.eq("is_featured", true);
      if (options?.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  };
}

export function useProducts(options?: { featured?: boolean; limit?: number }) {
  return useQuery(productsQuery(options));
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Product | null;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Uploads a customer file and returns the storage path (private bucket). */
export async function uploadCustomerFile(file: File, folder: string) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("customer-uploads")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return path;
}
