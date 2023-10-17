import { get } from "lodash";
import { isFieldPath } from "./path/pathTypes";

export type Recipe = any
export type TextRecipe = string | {$t: string}

export function compileRecipeEvalFn(recipe: Recipe) {
  return (ctx: Record<string, any>) => {
    return stringifyRecipeTemplate(recipe, ctx)
  }
}

function stringifyRecipeTemplate(recipe: Recipe, ctx: any): string {
  if (Array.isArray(recipe)) {
    return recipe
      .map((part: Recipe) => stringifyRecipeTemplate(part, ctx))
      .join(' ')
  }

  if ('const' in recipe && recipe.const) {
    return recipe.const
  }
  if ('path' in recipe && isFieldPath(recipe.path)) {
    return get(ctx, recipe.path)
  }
  if ('op' in recipe && opStringifiers[recipe.op]) {
    const args = recipe.args.map((arg) => stringifyRecipeTemplate(arg, ctx))
    return opStringifiers[recipe.op](recipe, args)
  }

  console.warn("Unknown recipe", recipe);

  return ''
}

type OpStringifierOpts = {
  args: Recipe[],
  filter?: 'non-empty',
}
type JoinOpts = OpStringifierOpts & {
  separator: string,
}
type OpStringifier = (opts: any, args: string[]) => string
const opStringifiers: Record<string, OpStringifier> = {
  join: (opts: JoinOpts, args) => {
    return args.join(opts.separator || ' ')
  },
}
