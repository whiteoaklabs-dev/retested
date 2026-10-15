// Sold sponsor placements. Empty = show the "sponsor this spot" placeholder.
// placement keys: 'home', 'library', 'category:<Category>'
export interface Sponsor { name: string; url: string; blurb: string }
export const sponsors: Record<string, Sponsor> = {};
export const sponsorFor = (placement: string): Sponsor | undefined => sponsors[placement];
