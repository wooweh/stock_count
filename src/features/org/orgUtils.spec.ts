import { describe, expect, expectTypeOf, it } from "vitest"
import { getInviteKeyValidation } from "./orgUtils"
import { v4 as uuidv4 } from "uuid"
/*




*/
describe("org utils", () => {
  it("should handle getInviteKeyValidation", () => {
    const mockFalseKey = "test"
    const actualFalseOuput = getInviteKeyValidation(mockFalseKey)
    expect(actualFalseOuput).toEqual(false)
    expectTypeOf(actualFalseOuput).toEqualTypeOf<boolean>()

    const mockTrueKey = uuidv4()
    const actualTrueOuput = getInviteKeyValidation(mockTrueKey)
    expect(actualTrueOuput).toEqual(true)
    expectTypeOf(actualTrueOuput).toEqualTypeOf<boolean>()
  })
})
/*




*/
