export default async function delay(time: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, time))
}
