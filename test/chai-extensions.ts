import Big from "big.js";
import { Assertion } from "chai";

// Add a method to chai for Big comparison
Assertion.addMethod("belowBig", function (expected) {
  const actual = this._obj;

  // Assert that the actual object is an instance of Big
  new Assertion(actual).to.be.instanceof(Big);
  new Assertion(expected).to.be.instanceof(Big);

  // Perform the comparison using Big.js's lt (less than) method
  this.assert(
    actual.lt(expected), // Check if actual Big is less than expected Big
    "expected #{this} to be below #{exp} but got #{act}",
    "expected #{this} not to be below #{exp}",
    expected.toString(), // expected value (convert Big to string)
    actual.toString(), // actual value (convert Big to string)
  );
});
