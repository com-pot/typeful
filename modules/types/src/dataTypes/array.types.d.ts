
export type ListFieldSpec = SchemaField & {
    type: "array"
    items: SchemaField,
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
