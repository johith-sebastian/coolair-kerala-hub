export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string
          admin_notes: string | null
          appliance_category: string
          brand: string | null
          created_at: string
          customer_name: string
          district: string
          email: string | null
          id: string
          image_url: string | null
          model: string | null
          phone: string
          pincode: string | null
          preferred_date: string | null
          preferred_time: string | null
          problem_description: string
          reference: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          appliance_category: string
          brand?: string | null
          created_at?: string
          customer_name: string
          district: string
          email?: string | null
          id?: string
          image_url?: string | null
          model?: string | null
          phone: string
          pincode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          problem_description: string
          reference?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          appliance_category?: string
          brand?: string | null
          created_at?: string
          customer_name?: string
          district?: string
          email?: string | null
          id?: string
          image_url?: string | null
          model?: string | null
          phone?: string
          pincode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          problem_description?: string
          reference?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      installation_requests: {
        Row: {
          address: string
          brand: string | null
          created_at: string
          customer_name: string
          id: string
          notes: string | null
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          product_type: string
          reference: string
          service_type: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          address: string
          brand?: string | null
          created_at?: string
          customer_name: string
          id?: string
          notes?: string | null
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          product_type: string
          reference?: string
          service_type?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          address?: string
          brand?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          notes?: string | null
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          product_type?: string
          reference?: string
          service_type?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          accessories: string[]
          age_years: number | null
          brand_id: string | null
          capacity: string | null
          category_id: string | null
          condition: string
          condition_report: string | null
          created_at: string
          delivery_available: boolean
          description: string | null
          features: string[]
          id: string
          images: string[]
          installation_available: boolean
          is_featured: boolean
          is_published: boolean
          model: string | null
          mrp: number | null
          price: number
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at: string
          warranty_months: number
        }
        Insert: {
          accessories?: string[]
          age_years?: number | null
          brand_id?: string | null
          capacity?: string | null
          category_id?: string | null
          condition?: string
          condition_report?: string | null
          created_at?: string
          delivery_available?: boolean
          description?: string | null
          features?: string[]
          id?: string
          images?: string[]
          installation_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          model?: string | null
          mrp?: number | null
          price: number
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at?: string
          warranty_months?: number
        }
        Update: {
          accessories?: string[]
          age_years?: number | null
          brand_id?: string | null
          capacity?: string | null
          category_id?: string | null
          condition?: string
          condition_report?: string | null
          created_at?: string
          delivery_available?: boolean
          description?: string | null
          features?: string[]
          id?: string
          images?: string[]
          installation_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          model?: string | null
          mrp?: number | null
          price?: number
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          title?: string
          updated_at?: string
          warranty_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sell_requests: {
        Row: {
          address: string | null
          brand: string | null
          comments: string | null
          condition: string | null
          created_at: string
          customer_name: string
          expected_price: number | null
          id: string
          images: string[]
          model: string | null
          offered_price: number | null
          phone: string
          product_category: string
          purchase_year: number | null
          reference: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          brand?: string | null
          comments?: string | null
          condition?: string | null
          created_at?: string
          customer_name: string
          expected_price?: number | null
          id?: string
          images?: string[]
          model?: string | null
          offered_price?: number | null
          phone: string
          product_category: string
          purchase_year?: number | null
          reference?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          brand?: string | null
          comments?: string | null
          condition?: string | null
          created_at?: string
          customer_name?: string
          expected_price?: number | null
          id?: string
          images?: string[]
          model?: string | null
          offered_price?: number | null
          phone?: string
          product_category?: string
          purchase_year?: number | null
          reference?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          is_published: boolean
          location: string | null
          message: string
          rating: number
          service_type: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          is_published?: boolean
          location?: string | null
          message: string
          rating?: number
          service_type?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          is_published?: boolean
          location?: string | null
          message?: string
          rating?: number
          service_type?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      product_status: "available" | "reserved" | "sold"
      request_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
      product_status: ["available", "reserved", "sold"],
      request_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
