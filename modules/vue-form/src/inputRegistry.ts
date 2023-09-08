import { FormKitPlugin } from "@formkit/core"

import { App, Component, inject } from "vue";

type InputRegistryEntry = {
  match: (attrs: Record<string, any>) => boolean,
  component?: Component,
  formkit?: {
    type?: string,
    plugins?: FormKitPlugin[],
  },
}
export type InputRegistry = {
  matchInput(attrs: Record<string, any>): InputRegistryEntry | null,
}
export function createInputRegistry(): InputRegistry {
  const entries: InputRegistryEntry[] = [
    {
      match: (attrs) => !!(attrs.options || attrs.enum) && attrs.appearance === 'buttons',
      formkit: {
        type: 'btnSelect',
      },
    },
    {
      match: (attrs) => !!(attrs.options || attrs.enum),
      formkit: {
        type: 'select',
      },
    },
    {
      match: (attrs) => attrs.type === 'string',
      formkit: {
        type: 'text',
      },
    },
    {
      match: (attrs) => attrs.type === 'number',
      formkit: {
        plugins: [
          parseNumberValuePlugin,
        ],
      }
    },
    {
      match: (attrs) => attrs.type === 'integer',
      formkit: {
        type: 'number',
        plugins: [
          parseNumberValuePlugin,
        ],
      },
    },
  ]

  return {
    matchInput(attrs) {
      return entries.find((entry) => entry.match(attrs)) || null
    },
  }
}

const parseNumberValuePlugin: FormKitPlugin = (node) => {
  node.hook.input((value, next) => next(Number(value)))
}

export const injectionKey = '@typeful/vue-form.inputRegistry'
export const useInputRegistry = () => inject(injectionKey) as InputRegistry
export const provideInputRegistry = (app: App, inputRegistry: InputRegistry) => app.provide(injectionKey, inputRegistry)
