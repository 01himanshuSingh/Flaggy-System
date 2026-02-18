export class FeatureAlreadyExistsError extends Error {
  constructor() {
    super("Feature already exists");
    this.name = "FeatureAlreadyExistsError";
  }
}
