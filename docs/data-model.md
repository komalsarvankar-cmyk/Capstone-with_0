# Firestore data model

Reference for the collections defined in `firestore.rules` / `storage.rules` (plan: `docs/plans/2026-09-19-1200-feat-rebuild-with-app-native-mobile-plan.md`, U2).

## `users/{uid}`
| Field | Type | Notes |
|---|---|---|
| `displayName` | string | |
| `connectedFriendUid` | string? | Set only via the U4 invite-accept transaction (KTD9), never a direct client write. |
| `expoPushToken` | string? | Registered on login (U7). |

## `invites/{inviteId}`
| Field | Type | Notes |
|---|---|---|
| `fromUid` | string | |
| `code` | string | Short display code; the doc id is the shareable/deep-link identifier. |
| `status` | `'pending' \| 'accepted'` | No expiry/TTL in this build (see plan Scope Boundaries). |

## `plans/{planId}`
| Field | Type | Notes |
|---|---|---|
| `participants` | `[string, string]` | Exactly the proposer and their `connectedFriendUid` at creation time. |
| `activityId` | string | |
| `activityTitle` | string | |
| `scheduledAt` | number (ms epoch) | |
| `note` | string? | |
| `status` | `'pending' \| 'accepted' \| 'completed'` | |
| `reminderSent` | boolean | Set by `sendPlanReminders` (U7) to prevent duplicate pushes. |

## `memories/{memoryId}`
| Field | Type | Notes |
|---|---|---|
| `participants` | `[string, string]` | |
| `activityTitle` | string | |
| `occurredAt` | number (ms epoch) | |
| `emotions` | `{ [uid: string]: EmotionalState }` | |
| `photoUrl` | string? | Set by a follow-up `update` after Storage upload (see `src/lib/memories.ts`). |
| `note` | string? | |

## `discoverItems/{itemId}`
Mirrors `DiscoverItem` in `src/types.ts`. Read-only from the client (KTD7); seeded via `functions/src/seed/discoverItems.ts`.

## `rateLimits/{uid}_{yyyy-mm-dd}`
Internal counter used only by `functions/src/suggestActivities.ts` (U11 rate limiting). Not read by the client.
