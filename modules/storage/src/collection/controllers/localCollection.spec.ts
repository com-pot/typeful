import { describe, expect, test } from "vitest";
import localCollection from "./localCollection";

describe("localCollection", () => {
  const collection = localCollection(() => [
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
  ])
  const val = (items: {value: number}[]): number[] => items.map((item) => item.value)

  test('fetch everything', () => {
    const result = collection.retrieve()
    expect(val(result.items)).to.deep.equal([1, 2, 3, 4])
    expect(result.pagination).to.deep.equal({
      page: 1,
      perPage: 20,
      totalItems: 4,
    })
  })

  test('fetch filtering', () => {
    const result = collection.retrieve([
      {prop: ['value'], op: '>=', args: [3]},
    ])
    expect(val(result.items)).to.deep.equal([3, 4])
  })
  test('fetch sort', () => {
    const result = collection.retrieve(undefined, [
      [['value'], 'desc'],
    ])
    expect(val(result.items)).to.deep.equal([4, 3, 2, 1])
  })
  test('fetch paginate', () => {
    let result = collection.retrieve(undefined, undefined, {perPage: 2, page: 1})
    expect(val(result.items)).to.deep.equal([1, 2])

    result = collection.retrieve(undefined, undefined, {perPage: 2, page: 2})
    expect(val(result.items)).to.deep.equal([3, 4])
  })
})
