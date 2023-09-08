export type I18nModuleRef = {
  source: "local", module: string, file: string,
}

export type I18nModule = {
  ref: I18nModuleRef,
  messages: Record<string, string>,
}
