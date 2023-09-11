export type TypefulType<TSpec extends object = Record<string, unknown>> = {
    validate(value: unknown, spec: TSpec, scope?: ValidationScope, ctx?: IntegrityContext): boolean,
    sanitize?(value: unknown, spec: TSpec, options?: SanitizeOptions, ctx?: IntegrityContext): null|undefined|any,
}

export type TypesModule = {
    types: Record<string, TypefulType>,
}
