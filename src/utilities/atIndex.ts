export default function atIndex(a: any[]): (i: number) => any {
  return (i: number): any => a[i]
}
