import { defineTypefulType } from "../dataTypes"


export default defineTypefulType({
    validate(value, options, scope, ctx) {
        if (!Array.isArray(value)) {
            scope?.pushError('invalid-type')
            return false
        }

        let allValid = true
        const itemsSchema = options.items
        if (ctx?.integrity && itemsSchema) {
            for (let i = 0; i < value.length; i++) {
                const itemScope = scope?.withPath(`[${i}]`)
                const valueValid = ctx.integrity.validate(itemsSchema, value[i], itemScope)

                allValid = allValid && valueValid
            }
        }

        return allValid
    },
    sanitize(value) {
        if (!Array.isArray(value)) {
            return null
        }
        return value
    },
})

export const paginationSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        page: { type: "number", minimum: 1 },
        perPage: { type: "number", minimum: 1 },
        totalItems: { type: "number", minimum: 1 },
        totalPages: { type: "number", minimum: 1 },
    },
    required: [
        "page",
        "perPage",
        "totalItems",
        "totalPages",
    ],
}

export function createPaginatedListSchema(itemSchema) {
    return {
        ...paginationSchema,
        properties: {
            ...paginationSchema.properties,
            items: {
                type: "array",
                items: itemSchema,
            },
        },
        required: [
            ...paginationSchema.required,
            "items",
        ],
    } as const
}