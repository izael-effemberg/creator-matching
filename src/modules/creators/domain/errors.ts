/** Barrel export — domain errors are defined alongside the entity they belong to, re-exported here for convenient importing from application/infrastructure code. */
export {
  InvalidCreatorSlugError,
  DuplicateCreatorSlugError,
  CreatorNotFoundError,
} from "./creator";
export {
  DuplicatePlatformAccountError,
  PlatformAccountNotFoundError,
} from "./platform-account";
