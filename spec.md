# Wallpaper Safari

## Current State
After signing in with Internet Identity, a dialog pops up asking for an admin token. The user must enter a secret token to get admin access. This is confusing and the user cannot sign in successfully.

## Requested Changes (Diff)

### Add
- Auto-promote the first Internet Identity user to admin on sign-in (no token required)

### Modify
- Remove AdminTokenDialog from the sign-in flow
- Update handleLogin in App.tsx to no longer show the admin dialog
- Update useActor.ts to call _initializeAccessControlWithSecret with empty string so the first authenticated user becomes admin automatically

### Remove
- Token input step from sign-in flow

## Implementation Plan
1. In App.tsx: remove showAdminDialog state and AdminTokenDialog component, simplify handleLogin
2. In useActor.ts: always call _initializeAccessControlWithSecret("") so first authenticated user auto-becomes admin
