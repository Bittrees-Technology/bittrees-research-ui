/**
 * Research has no voting-power-based gating or badges (unlike gov's BGOV tiers),
 * so these are inert shims kept only so the ported chat/forum components compile
 * unchanged. Admin comes from roles (see adminAccess); badges come from on-chain
 * holdings + assigned roles (see badges + community).
 */

export function useVotingPowerNow(_address?: string): { data: number; isLoading: boolean } {
  return { data: 0, isLoading: false };
}

export function useVotingPowers(_addresses: string[]): { data: Record<string, number>; isLoading: boolean } {
  return { data: {}, isLoading: false };
}

export function useIsAdmin(_address?: string): boolean {
  return false;
}
