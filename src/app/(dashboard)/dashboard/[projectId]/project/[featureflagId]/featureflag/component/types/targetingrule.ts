export interface TargetingRule {
  id: number
  attribute: string
  operator: string
  value: string
  variation: "enabled" | "disabled"
}