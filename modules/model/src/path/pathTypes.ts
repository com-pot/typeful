export type FieldPathRaw = readonly string[]
export type FieldPath = FieldPathRaw & {strSafe: ReturnType<typeof pathToStr>}

export function createPath(...parts: string[]): FieldPath {
  return Object.assign(parts, {strSafe: pathToStr(parts)})
}
export function pathToStr(path: FieldPathRaw | FieldPath): string {
  if ('strSafe' in path) {
    return path.strSafe
  }

  return path.join('_')
}

export function isFieldPath(subject: any): subject is FieldPathRaw | FieldPath {
  return Array.isArray(subject)
}

export function pathSame(a: FieldPathRaw, b: FieldPathRaw): boolean {
  if (a.length !== b.length) return false
  return a.every((part, i) => part === b[i])
}
