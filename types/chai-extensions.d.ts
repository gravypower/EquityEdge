import "chai";

declare module "chai" {
  interface Assertion {
    belowBig(value: Big, message?: string): Assertion;
  }
}
