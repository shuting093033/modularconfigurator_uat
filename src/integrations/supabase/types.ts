export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      actual_costs: {
        Row: {
          actual_quantity: number | null
          actual_total_cost: number | null
          actual_unit_cost: number | null
          assembly_id: string | null
          component_id: string | null
          cost_date: string
          created_at: string
          estimate_item_id: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          project_id: string
          purchase_order_number: string | null
          updated_at: string
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          actual_quantity?: number | null
          actual_total_cost?: number | null
          actual_unit_cost?: number | null
          assembly_id?: string | null
          component_id?: string | null
          cost_date: string
          created_at?: string
          estimate_item_id?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          project_id: string
          purchase_order_number?: string | null
          updated_at?: string
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          actual_quantity?: number | null
          actual_total_cost?: number | null
          actual_unit_cost?: number | null
          assembly_id?: string | null
          component_id?: string | null
          cost_date?: string
          created_at?: string
          estimate_item_id?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          project_id?: string
          purchase_order_number?: string | null
          updated_at?: string
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actual_costs_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actual_costs_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actual_costs_estimate_item_id_fkey"
            columns: ["estimate_item_id"]
            isOneToOne: false
            referencedRelation: "estimate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actual_costs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          conversation_data: Json
          created_at: string
          estimate_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_data: Json
          created_at?: string
          estimate_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_data?: Json
          created_at?: string
          estimate_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      assemblies: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          installation_sequence: number | null
          labor_hours: number | null
          name: string
          total_labor_cost: number | null
          total_material_cost: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          installation_sequence?: number | null
          labor_hours?: number | null
          name: string
          total_labor_cost?: number | null
          total_material_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          installation_sequence?: number | null
          labor_hours?: number | null
          name?: string
          total_labor_cost?: number | null
          total_material_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      assembly_components: {
        Row: {
          assembly_id: string
          component_id: string
          created_at: string
          id: string
          notes: string | null
          quantity: number
          selected_quality_tier_id: string | null
          unit: string
          user_id: string | null
        }
        Insert: {
          assembly_id: string
          component_id: string
          created_at?: string
          id?: string
          notes?: string | null
          quantity: number
          selected_quality_tier_id?: string | null
          unit: string
          user_id?: string | null
        }
        Update: {
          assembly_id?: string
          component_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          quantity?: number
          selected_quality_tier_id?: string | null
          unit?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assembly_components_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assembly_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          category_type: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_category_id: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      change_orders: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          change_order_number: string
          cost_impact: number | null
          created_at: string
          description: string
          id: string
          project_id: string
          requested_by: string
          schedule_impact_days: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          change_order_number: string
          cost_impact?: number | null
          created_at?: string
          description: string
          id?: string
          project_id: string
          requested_by: string
          schedule_impact_days?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          change_order_number?: string
          cost_impact?: number | null
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          requested_by?: string
          schedule_impact_days?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      components: {
        Row: {
          category: string
          certifications: string[] | null
          cooling_requirements: Json | null
          created_at: string
          description: string | null
          environmental_specs: Json | null
          id: string
          installation_notes: string | null
          labor_hours: number | null
          lead_time_days: number | null
          maintenance_schedule: Json | null
          material_waste_factor: number | null
          name: string
          physical_dimensions: Json | null
          power_requirements: Json | null
          regional_availability: string[] | null
          skill_level: string | null
          technical_specs: Json | null
          unit: string
          updated_at: string
          user_id: string | null
          vendor_info: Json | null
          warranty_years: number | null
        }
        Insert: {
          category: string
          certifications?: string[] | null
          cooling_requirements?: Json | null
          created_at?: string
          description?: string | null
          environmental_specs?: Json | null
          id: string
          installation_notes?: string | null
          labor_hours?: number | null
          lead_time_days?: number | null
          maintenance_schedule?: Json | null
          material_waste_factor?: number | null
          name: string
          physical_dimensions?: Json | null
          power_requirements?: Json | null
          regional_availability?: string[] | null
          skill_level?: string | null
          technical_specs?: Json | null
          unit: string
          updated_at?: string
          user_id?: string | null
          vendor_info?: Json | null
          warranty_years?: number | null
        }
        Update: {
          category?: string
          certifications?: string[] | null
          cooling_requirements?: Json | null
          created_at?: string
          description?: string | null
          environmental_specs?: Json | null
          id?: string
          installation_notes?: string | null
          labor_hours?: number | null
          lead_time_days?: number | null
          maintenance_schedule?: Json | null
          material_waste_factor?: number | null
          name?: string
          physical_dimensions?: Json | null
          power_requirements?: Json | null
          regional_availability?: string[] | null
          skill_level?: string | null
          technical_specs?: Json | null
          unit?: string
          updated_at?: string
          user_id?: string | null
          vendor_info?: Json | null
          warranty_years?: number | null
        }
        Relationships: []
      }
      estimate_assemblies: {
        Row: {
          assembly_id: string
          assembly_name: string
          created_at: string
          estimate_id: string
          id: string
          quantity: number
          total_labor_cost: number
          total_labor_hours: number
          total_material_cost: number
        }
        Insert: {
          assembly_id: string
          assembly_name: string
          created_at?: string
          estimate_id: string
          id?: string
          quantity?: number
          total_labor_cost?: number
          total_labor_hours?: number
          total_material_cost?: number
        }
        Update: {
          assembly_id?: string
          assembly_name?: string
          created_at?: string
          estimate_id?: string
          id?: string
          quantity?: number
          total_labor_cost?: number
          total_labor_hours?: number
          total_material_cost?: number
        }
        Relationships: []
      }
      estimate_items: {
        Row: {
          component_id: string
          component_name: string
          created_at: string
          estimate_assembly_id: string | null
          estimate_id: string
          id: string
          quality_tier_description: string | null
          quality_tier_id: string
          quality_tier_name: string
          quality_tier_unit_cost: number
          quantity: number
          total_cost: number
          unit: string
        }
        Insert: {
          component_id: string
          component_name: string
          created_at?: string
          estimate_assembly_id?: string | null
          estimate_id: string
          id?: string
          quality_tier_description?: string | null
          quality_tier_id: string
          quality_tier_name: string
          quality_tier_unit_cost: number
          quantity?: number
          total_cost: number
          unit: string
        }
        Update: {
          component_id?: string
          component_name?: string
          created_at?: string
          estimate_assembly_id?: string | null
          estimate_id?: string
          id?: string
          quality_tier_description?: string | null
          quality_tier_id?: string
          quality_tier_name?: string
          quality_tier_unit_cost?: number
          quantity?: number
          total_cost?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_assembly_id_fkey"
            columns: ["estimate_assembly_id"]
            isOneToOne: false
            referencedRelation: "estimate_assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string
          id: string
          name: string
          total_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          total_cost?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          total_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_estimates: {
        Row: {
          created_at: string
          estimate_id: string
          id: string
          is_baseline: boolean | null
          phase_name: string | null
          project_id: string
        }
        Insert: {
          created_at?: string
          estimate_id: string
          id?: string
          is_baseline?: boolean | null
          phase_name?: string | null
          project_id: string
        }
        Update: {
          created_at?: string
          estimate_id?: string
          id?: string
          is_baseline?: boolean | null
          phase_name?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_estimates_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          budget_allocation: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          project_id: string
          sort_order: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget_allocation?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          project_id: string
          sort_order?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget_allocation?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          project_id?: string
          sort_order?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          capacity_mw: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          project_type: string | null
          start_date: string | null
          status: string | null
          target_completion_date: string | null
          total_budget: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity_mw?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          project_type?: string | null
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity_mw?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          project_type?: string | null
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quality_tiers: {
        Row: {
          component_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          unit_cost: number
        }
        Insert: {
          component_id: string
          created_at?: string
          description?: string | null
          id: string
          name: string
          unit_cost: number
        }
        Update: {
          component_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "quality_tiers_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_cost_factors: {
        Row: {
          component_id: string
          cost_multiplier: number | null
          created_at: string | null
          id: string
          labor_rate_adjustment: number | null
          logistics_cost_factor: number | null
          material_cost_adjustment: number | null
          region_code: string
          region_name: string
          updated_at: string | null
        }
        Insert: {
          component_id: string
          cost_multiplier?: number | null
          created_at?: string | null
          id?: string
          labor_rate_adjustment?: number | null
          logistics_cost_factor?: number | null
          material_cost_adjustment?: number | null
          region_code: string
          region_name: string
          updated_at?: string | null
        }
        Update: {
          component_id?: string
          cost_multiplier?: number | null
          created_at?: string | null
          id?: string
          labor_rate_adjustment?: number | null
          logistics_cost_factor?: number | null
          material_cost_adjustment?: number | null
          region_code?: string
          region_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_labor_rates: {
        Row: {
          created_at: string
          id: string
          labor_rate_per_hour: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          labor_rate_per_hour?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          labor_rate_per_hour?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_components_text: {
        Args: { search_query: string }
        Returns: {
          id: string
          name: string
          category: string
          description: string
          unit: string
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
