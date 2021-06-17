export default function fromHexCharCode(value: string): string {
  return String.fromCharCode(parseInt(value, 16))
}
