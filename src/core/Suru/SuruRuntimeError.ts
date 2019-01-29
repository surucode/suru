export class SuruRuntimeError extends Error {
  constructor(m: string) {
    super(m);
    this.name = "SuruRuntimeError";
  }
}
