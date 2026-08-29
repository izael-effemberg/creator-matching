/**
 * Minimal, fully-typed fixture factories for tests. Not matched by the
 * vitest `*.test.ts` include glob — this is test support, not a test file.
 */
import type { Creator } from "../../domain/creator";
import type { PlatformAccount } from "../../domain/platform-account";
import type { AccountMetricSnapshot } from "../../domain/metric-snapshot";
import type { CreatorLocation, CreatorLanguage } from "../../domain/creator-repository.port";

export function makeCreator(overrides: Partial<Creator> = {}): Creator {
  return {
    id: "creator-1",
    workspace_id: null,
    slug: "jane-doe",
    display_name: "Jane Doe",
    stage_name: null,
    legal_name: null,
    headline: null,
    bio: null,
    profile_image_url: null,
    creator_type: "individual",
    creator_status: "prospect",
    creator_tier: null,
    is_verified_creator: false,
    is_claimed: false,
    adult_status: "unknown",
    primary_market: null,
    timezone: null,
    first_seen_at: "2026-01-01T00:00:00.000Z",
    last_seen_at: null,
    data_quality_score: null,
    profile_completeness: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    deleted_at: null,
    ...overrides,
  };
}

export function makePlatformAccount(overrides: Partial<PlatformAccount> = {}): PlatformAccount {
  return {
    id: "account-1",
    creator_id: "creator-1",
    platform: "instagram",
    external_platform_id: null,
    username: "janedoe",
    display_name: null,
    profile_url: "https://instagram.com/janedoe",
    bio: null,
    avatar_url: null,
    website_url: null,
    verified: null,
    account_type: null,
    account_status: "active",
    is_primary_account: true,
    is_creator_authorized: false,
    access_scope: "public",
    last_synced_at: null,
    last_sync_status: "never_synced",
    raw_metadata: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeSnapshot(overrides: Partial<AccountMetricSnapshot> = {}): AccountMetricSnapshot {
  return {
    id: "snapshot-1",
    account_id: "account-1",
    observed_at: "2026-01-01T00:00:00.000Z",
    followers_count: 100_000,
    following_count: null,
    content_count: null,
    total_views: null,
    total_likes: null,
    total_comments: null,
    total_shares: null,
    total_saves: null,
    profile_views: null,
    reach: null,
    impressions: null,
    source_id: null,
    raw_metrics: null,
    ingested_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeLocation(overrides: Partial<CreatorLocation> = {}): CreatorLocation {
  return {
    id: "location-1",
    creator_id: "creator-1",
    location_type: "current_residence",
    country_code: "BR",
    state_region: null,
    city: "São Paulo",
    metro_area: null,
    relevance_score: null,
    travel_available: null,
    remote_campaign_available: null,
    international_campaigns_available: null,
    valid_from: null,
    valid_to: null,
    source_confidence: null,
    ...overrides,
  };
}

export function makeLanguage(overrides: Partial<CreatorLanguage> = {}): CreatorLanguage {
  return {
    id: "language-1",
    creator_id: "creator-1",
    language_code: "pt-BR",
    proficiency: "native",
    content_language: true,
    commercial_language: true,
    content_share_pct: null,
    confidence: null,
    ...overrides,
  };
}
