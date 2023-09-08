export function resolveAfter<T=void>(timeout: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value as T), timeout))
}

/**
 * Gives random delay value using formula `dt = c +- d`
 */
export const dt = (c: number, d: number = 0) => c + (Math.random() * 2 - 1) * d
