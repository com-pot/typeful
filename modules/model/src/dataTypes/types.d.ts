export type TypefulType<TSpec extends object = Record<string, unknown>> = {
    validate(value: unknown, spec: TSpec, scope?: ValidationScope, ctx?: IntegrityContext): boolean,
    sanitize?(value: unknown, spec: TSpec, options?: SanitizeOptions, ctx?: IntegrityContext): null|undefined|any,
    getDefaultValue?(spec: TSpec): unknown | null,
}

export type ValidationScope = {
    pushError(code: string, args?: (string | number)[]): void,
}

export type SanitizeOptions = {
    allowlist: unknown,
}
export type IntegrityContext = unknown

export type TypesModule = {
    types: Record<string, TypefulType>,
}
