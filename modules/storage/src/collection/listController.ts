export type ListControllerData<TItem = any> = {
  items: TItem[],
  pagination: PaginationResult,
}

export type PaginationConfig = {
  /** one-based page number */
  page?: number,
  perPage?: number,
}
export type PaginationResult = {
  page: number,
  perPage: number,
  totalItems: number,
}

export type CollectionPage<TItem = any> = {
  items: TItem[],
  pagination?: PaginationResult,
}
