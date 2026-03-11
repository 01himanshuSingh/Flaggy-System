export type VariationType =
  | "Boolean"
  | "String"
  | "Number"
  | "JSON"

export interface Variation {
  id: number
  name: string
  value: string
  type: VariationType
  weight: number
}