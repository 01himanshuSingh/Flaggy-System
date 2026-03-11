import { Environment } from "./environment";

export const ENVIRONMENTS:Environment [] = [
    "DEVELOPMENT"
  
  , "STAGING",
   "PRODUCTION"
];

export const ENVIRONMENT_COLORS: Record<string, string> = {
  DEVELOPMENT: "indigo",
 
  STAGING: "blue",
  PRODUCTION: "red",
};