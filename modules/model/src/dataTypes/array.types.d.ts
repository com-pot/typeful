import { Schema } from "../Schema"

export type ListFieldSpec = Schema & {
    type: "array"
    items: Schema,
}


export type ResultPagination = {
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number,
}

export type PaginatedList<TItem> = {
    items: TItem[],
} & ResultPagination
