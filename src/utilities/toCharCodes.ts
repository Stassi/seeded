export default function toCharCodes(s: string): number[] {
  return s.split('').map((x: string) => x.charCodeAt(0))
}
