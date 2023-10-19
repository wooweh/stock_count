import { describe, expect, expectTypeOf, it } from "vitest"
import {
  CheckNewPasswordReturnProps,
  PasswordValidationReturnProps,
  checkNewPassword,
  getPasswordValidation,
} from "./userUtils"
/*




*/
describe("user utils", () => {
  it("should handle checkNewPassword", () => {
    const mockPassword = "test"
    const mockNewPassword = "test"
    const mockConfirmedNewPassword = "test"
    const actual = checkNewPassword(
      mockPassword,
      mockNewPassword,
      mockConfirmedNewPassword,
    )
    expect(actual.isConfirmed).toEqual(true)
    expect(actual.isUnique).toEqual(false)
    expect(actual.isValid).toEqual(false)
    expectTypeOf(actual).toEqualTypeOf<CheckNewPasswordReturnProps>()
  })

  it("should handle getPasswordValidation", () => {
    const mockPassword = "test"
    const actual = getPasswordValidation(mockPassword)
    expect(actual.minCapCharCount).toEqual(false)
    expect(actual.isValid).toEqual(false)
    expectTypeOf(actual).toEqualTypeOf<PasswordValidationReturnProps>()
  })
})
/*




*/
