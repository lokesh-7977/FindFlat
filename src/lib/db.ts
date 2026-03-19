export function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function likePattern(str: string): string {
  return `%${escapeLike(str)}%`;
}
