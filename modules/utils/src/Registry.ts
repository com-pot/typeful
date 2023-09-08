export default class Registry<Item> {
  public readonly items: Map<string, Item> = new Map()

  public put(key: string, item: Item): this {
    if (this.items.has(key)) {
      console.warn(`Registry already contains '${key}', overwriting`);
    }
    this.items.set(key, item)

    return this
  }
}
