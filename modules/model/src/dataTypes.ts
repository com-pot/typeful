import { TypefulType } from "./dataTypes/types";

export const defineTypefulType = <TSpec extends object = Record<string, unknown>>(type: TypefulType<TSpec>) => type
