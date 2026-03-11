export type FlagStatus =
  | "active"
  | "draft"
  | "deprecated"
  | "archived";

export interface FlagHeaderProps {
  env: string;
}