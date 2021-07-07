async function delay(time: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export default async function delayTen(): Promise<unknown> {
  return delay(10)
}
