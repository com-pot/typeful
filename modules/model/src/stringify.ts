import { get } from "lodash"

type StringifyPath = { path: string, mode?: "print" | "i18n:pick" }
type StringifyTemplate = {
    template: string,
}
export type StringifyRecipe = string | StringifyPath | StringifyTemplate

export function stringify(item: any, recipe: StringifyRecipe): string | undefined {
  if (typeof recipe === 'string') {
    return stringifyPath(item, recipe)
  }

  if (recipe && typeof recipe === "object") {
    if ("path" in recipe) return stringifyPath(item, recipe.path, recipe.mode)
    if (recipe.template) stringifyTemplate(recipe.template, item)
  }

  console.warn("Unrecognized stringify", recipe)
  return undefined
}

function stringifyPath(item: any, path: string, mode: NonNullable<StringifyPath["mode"]> = "print") {
  const value = get(item, path)

  if (mode !== "print") console.warn("Unsupported stringify mode", mode)
  return toStr(value)
}

const stringifyTemplateRegexp = /{{\s*([\w._]+)\s*}}/g
function stringifyTemplate(template: string, item: any): string {
  return template.replace(stringifyTemplateRegexp, (match, path) => {
    return toStr(get(item, path)) ?? '---'
  })
}

function toStr(val: any): string | undefined {
  if (val === undefined) {
    return undefined
  }
  if (val === null) {
    return ''
  }
  if (Array.isArray(val)) {
    return val.map(toStr).join(', ')
  }
  if (typeof val === 'object') {
    return JSON.stringify(val)
  }
  return val.toString()
}
