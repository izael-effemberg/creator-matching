export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      creator_account_metric_snapshots: {
        Row: {
          account_id: string
          content_count: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          impressions: number | null
          ingested_at: string
          observed_at: string
          profile_views: number | null
          raw_metrics: Json | null
          reach: number | null
          source_id: string | null
          total_comments: number | null
          total_likes: number | null
          total_saves: number | null
          total_shares: number | null
          total_views: number | null
        }
        Insert: {
          account_id: string
          content_count?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions?: number | null
          ingested_at?: string
          observed_at: string
          profile_views?: number | null
          raw_metrics?: Json | null
          reach?: number | null
          source_id?: string | null
          total_comments?: number | null
          total_likes?: number | null
          total_saves?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Update: {
          account_id?: string
          content_count?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions?: number | null
          ingested_at?: string
          observed_at?: string
          profile_views?: number | null
          raw_metrics?: Json | null
          reach?: number | null
          source_id?: string | null
          total_comments?: number | null
          total_likes?: number | null
          total_saves?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_account_metric_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "creator_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_account_metric_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_growth_metrics: {
        Row: {
          account_id: string
          audience_decay_flag: boolean
          avg_daily_follower_growth: number | null
          calculated_at: string
          calculation_version: string
          content_growth_correlation: number | null
          follower_growth_absolute: number | null
          follower_growth_pct: number | null
          growth_acceleration: number | null
          growth_velocity: number | null
          id: string
          viral_growth_flag: boolean
          window: Database["public"]["Enums"]["metric_window"]
          window_end: string
          window_start: string
        }
        Insert: {
          account_id: string
          audience_decay_flag?: boolean
          avg_daily_follower_growth?: number | null
          calculated_at?: string
          calculation_version: string
          content_growth_correlation?: number | null
          follower_growth_absolute?: number | null
          follower_growth_pct?: number | null
          growth_acceleration?: number | null
          growth_velocity?: number | null
          id?: string
          viral_growth_flag?: boolean
          window: Database["public"]["Enums"]["metric_window"]
          window_end: string
          window_start: string
        }
        Update: {
          account_id?: string
          audience_decay_flag?: boolean
          avg_daily_follower_growth?: number | null
          calculated_at?: string
          calculation_version?: string
          content_growth_correlation?: number | null
          follower_growth_absolute?: number | null
          follower_growth_pct?: number | null
          growth_acceleration?: number | null
          growth_velocity?: number | null
          id?: string
          viral_growth_flag?: boolean
          window?: Database["public"]["Enums"]["metric_window"]
          window_end?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_growth_metrics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "creator_platform_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_languages: {
        Row: {
          commercial_language: boolean
          confidence: number | null
          content_language: boolean
          content_share_pct: number | null
          creator_id: string
          id: string
          language_code: string
          proficiency:
            | Database["public"]["Enums"]["language_proficiency"]
            | null
        }
        Insert: {
          commercial_language?: boolean
          confidence?: number | null
          content_language?: boolean
          content_share_pct?: number | null
          creator_id: string
          id?: string
          language_code: string
          proficiency?:
            | Database["public"]["Enums"]["language_proficiency"]
            | null
        }
        Update: {
          commercial_language?: boolean
          confidence?: number | null
          content_language?: boolean
          content_share_pct?: number | null
          creator_id?: string
          id?: string
          language_code?: string
          proficiency?:
            | Database["public"]["Enums"]["language_proficiency"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_languages_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_locations: {
        Row: {
          city: string | null
          country_code: string | null
          creator_id: string
          id: string
          international_campaigns_available: boolean | null
          location_type: Database["public"]["Enums"]["creator_location_type"]
          metro_area: string | null
          relevance_score: number | null
          remote_campaign_available: boolean | null
          source_confidence: number | null
          state_region: string | null
          travel_available: boolean | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          creator_id: string
          id?: string
          international_campaigns_available?: boolean | null
          location_type: Database["public"]["Enums"]["creator_location_type"]
          metro_area?: string | null
          relevance_score?: number | null
          remote_campaign_available?: boolean | null
          source_confidence?: number | null
          state_region?: string | null
          travel_available?: boolean | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          creator_id?: string
          id?: string
          international_campaigns_available?: boolean | null
          location_type?: Database["public"]["Enums"]["creator_location_type"]
          metro_area?: string | null
          relevance_score?: number | null
          remote_campaign_available?: boolean | null
          source_confidence?: number | null
          state_region?: string | null
          travel_available?: boolean | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_locations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_platform_accounts: {
        Row: {
          access_scope: Database["public"]["Enums"]["platform_access_scope"]
          account_status: Database["public"]["Enums"]["platform_account_status"]
          account_type: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          creator_id: string
          display_name: string | null
          external_platform_id: string | null
          id: string
          is_creator_authorized: boolean
          is_primary_account: boolean
          last_sync_status: Database["public"]["Enums"]["platform_sync_status"]
          last_synced_at: string | null
          platform: Database["public"]["Enums"]["creator_platform"]
          profile_url: string
          raw_metadata: Json | null
          updated_at: string
          username: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          access_scope?: Database["public"]["Enums"]["platform_access_scope"]
          account_status?: Database["public"]["Enums"]["platform_account_status"]
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          creator_id: string
          display_name?: string | null
          external_platform_id?: string | null
          id?: string
          is_creator_authorized?: boolean
          is_primary_account?: boolean
          last_sync_status?: Database["public"]["Enums"]["platform_sync_status"]
          last_synced_at?: string | null
          platform: Database["public"]["Enums"]["creator_platform"]
          profile_url: string
          raw_metadata?: Json | null
          updated_at?: string
          username?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          access_scope?: Database["public"]["Enums"]["platform_access_scope"]
          account_status?: Database["public"]["Enums"]["platform_account_status"]
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          creator_id?: string
          display_name?: string | null
          external_platform_id?: string | null
          id?: string
          is_creator_authorized?: boolean
          is_primary_account?: boolean
          last_sync_status?: Database["public"]["Enums"]["platform_sync_status"]
          last_synced_at?: string | null
          platform?: Database["public"]["Enums"]["creator_platform"]
          profile_url?: string
          raw_metadata?: Json | null
          updated_at?: string
          username?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_platform_accounts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          adult_status: Database["public"]["Enums"]["adult_status"]
          bio: string | null
          created_at: string
          creator_status: Database["public"]["Enums"]["creator_status"]
          creator_tier: Database["public"]["Enums"]["creator_tier"] | null
          creator_type: Database["public"]["Enums"]["creator_type"]
          data_quality_score: number | null
          deleted_at: string | null
          display_name: string
          first_seen_at: string
          headline: string | null
          id: string
          is_claimed: boolean
          is_verified_creator: boolean
          last_seen_at: string | null
          legal_name: string | null
          primary_market: string | null
          profile_completeness: number | null
          profile_image_url: string | null
          slug: string
          stage_name: string | null
          timezone: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          adult_status?: Database["public"]["Enums"]["adult_status"]
          bio?: string | null
          created_at?: string
          creator_status?: Database["public"]["Enums"]["creator_status"]
          creator_tier?: Database["public"]["Enums"]["creator_tier"] | null
          creator_type?: Database["public"]["Enums"]["creator_type"]
          data_quality_score?: number | null
          deleted_at?: string | null
          display_name: string
          first_seen_at?: string
          headline?: string | null
          id?: string
          is_claimed?: boolean
          is_verified_creator?: boolean
          last_seen_at?: string | null
          legal_name?: string | null
          primary_market?: string | null
          profile_completeness?: number | null
          profile_image_url?: string | null
          slug: string
          stage_name?: string | null
          timezone?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          adult_status?: Database["public"]["Enums"]["adult_status"]
          bio?: string | null
          created_at?: string
          creator_status?: Database["public"]["Enums"]["creator_status"]
          creator_tier?: Database["public"]["Enums"]["creator_tier"] | null
          creator_type?: Database["public"]["Enums"]["creator_type"]
          data_quality_score?: number | null
          deleted_at?: string | null
          display_name?: string
          first_seen_at?: string
          headline?: string | null
          id?: string
          is_claimed?: boolean
          is_verified_creator?: boolean
          last_seen_at?: string | null
          legal_name?: string | null
          primary_market?: string | null
          profile_completeness?: number | null
          profile_image_url?: string | null
          slug?: string
          stage_name?: string | null
          timezone?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          access_scope: Database["public"]["Enums"]["data_source_access_scope"]
          confidence: number | null
          created_at: string
          external_id: string | null
          id: string
          observed_at: string | null
          provider: string | null
          raw_payload_hash: string | null
          raw_payload_location: string | null
          retrieved_at: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          source_url: string | null
          terms_context: string | null
        }
        Insert: {
          access_scope?: Database["public"]["Enums"]["data_source_access_scope"]
          confidence?: number | null
          created_at?: string
          external_id?: string | null
          id?: string
          observed_at?: string | null
          provider?: string | null
          raw_payload_hash?: string | null
          raw_payload_location?: string | null
          retrieved_at?: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          source_url?: string | null
          terms_context?: string | null
        }
        Update: {
          access_scope?: Database["public"]["Enums"]["data_source_access_scope"]
          confidence?: number | null
          created_at?: string
          external_id?: string | null
          id?: string
          observed_at?: string | null
          provider?: string | null
          raw_payload_hash?: string | null
          raw_payload_location?: string | null
          retrieved_at?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"]
          source_url?: string | null
          terms_context?: string | null
        }
        Relationships: []
      }
      evidence_items: {
        Row: {
          confidence: number | null
          created_at: string
          entity_id: string
          entity_type: string
          evidence_text: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          expires_at: string | null
          field_name: string | null
          id: string
          observed_at: string
          raw_value: Json | null
          source_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          entity_id: string
          entity_type: string
          evidence_text?: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          expires_at?: string | null
          field_name?: string | null
          id?: string
          observed_at?: string
          raw_value?: Json | null
          source_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          evidence_text?: string | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          expires_at?: string | null
          field_name?: string | null
          id?: string
          observed_at?: string
          raw_value?: Json | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      creator_account_is_visible: {
        Args: { p_account_id: string }
        Returns: boolean
      }
      creator_is_visible: { Args: { p_creator_id: string }; Returns: boolean }
      is_workspace_member: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      adult_status: "adult" | "minor" | "unknown"
      creator_location_type:
        | "current_residence"
        | "origin"
        | "market_served"
        | "travel_market"
        | "frequent_market"
      creator_platform:
        | "instagram"
        | "tiktok"
        | "youtube"
        | "linkedin"
        | "twitch"
        | "x"
        | "facebook"
        | "pinterest"
        | "newsletter"
        | "podcast"
        | "website"
        | "other"
      creator_status:
        | "prospect"
        | "active"
        | "managed"
        | "inactive"
        | "archived"
      creator_tier: "nano" | "micro" | "mid" | "macro" | "mega" | "celebrity"
      creator_type: "individual" | "duo" | "group" | "company" | "virtual"
      data_source_access_scope:
        | "public"
        | "authorized"
        | "licensed"
        | "restricted"
        | "internal"
      data_source_type:
        | "platform_api"
        | "public_web"
        | "creator_provided"
        | "agency_provided"
        | "manual"
        | "internal"
        | "ai_inference"
        | "third_party"
      evidence_type:
        | "raw_value"
        | "quote"
        | "metric"
        | "content_reference"
        | "manual_attestation"
        | "model_input"
      language_proficiency:
        | "native"
        | "fluent"
        | "advanced"
        | "intermediate"
        | "basic"
      metric_window: "7d" | "30d" | "90d" | "365d" | "custom"
      platform_access_scope:
        | "public"
        | "authorized"
        | "licensed"
        | "restricted"
        | "internal"
      platform_account_status:
        | "active"
        | "inactive"
        | "suspended"
        | "deleted"
        | "unknown"
      platform_sync_status: "success" | "partial" | "failed" | "never_synced"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      adult_status: ["adult", "minor", "unknown"],
      creator_location_type: [
        "current_residence",
        "origin",
        "market_served",
        "travel_market",
        "frequent_market",
      ],
      creator_platform: [
        "instagram",
        "tiktok",
        "youtube",
        "linkedin",
        "twitch",
        "x",
        "facebook",
        "pinterest",
        "newsletter",
        "podcast",
        "website",
        "other",
      ],
      creator_status: ["prospect", "active", "managed", "inactive", "archived"],
      creator_tier: ["nano", "micro", "mid", "macro", "mega", "celebrity"],
      creator_type: ["individual", "duo", "group", "company", "virtual"],
      data_source_access_scope: [
        "public",
        "authorized",
        "licensed",
        "restricted",
        "internal",
      ],
      data_source_type: [
        "platform_api",
        "public_web",
        "creator_provided",
        "agency_provided",
        "manual",
        "internal",
        "ai_inference",
        "third_party",
      ],
      evidence_type: [
        "raw_value",
        "quote",
        "metric",
        "content_reference",
        "manual_attestation",
        "model_input",
      ],
      language_proficiency: [
        "native",
        "fluent",
        "advanced",
        "intermediate",
        "basic",
      ],
      metric_window: ["7d", "30d", "90d", "365d", "custom"],
      platform_access_scope: [
        "public",
        "authorized",
        "licensed",
        "restricted",
        "internal",
      ],
      platform_account_status: [
        "active",
        "inactive",
        "suspended",
        "deleted",
        "unknown",
      ],
      platform_sync_status: ["success", "partial", "failed", "never_synced"],
    },
  },
} as const

