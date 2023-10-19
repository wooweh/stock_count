import { describe, expect, expectTypeOf, it } from "vitest"
import coreReducer, {
  CoreState,
  NotificationProps,
  SystemStatusProps,
  setNotification,
  setShowNotification,
  setSystemStatus,
  toggleIsDarkmode,
  toggleIsMobile,
} from "./coreSlice"
/*




*/
describe("core reducer", () => {
  const initialState: CoreState = {
    systemStatus: "notBooted",
    isDarkmode: true,
    isMobile: false,
    showNotification: false,
    notificaiton: undefined,
  }

  it("should handle initial state", () => {
    expect(coreReducer(undefined, { type: "unknown" })).toEqual({
      systemStatus: "notBooted",
      isDarkmode: true,
      isMobile: false,
      showNotification: false,
      notificaiton: undefined,
    })
  })

  it("should handle setSystemStatus", () => {
    const actual = coreReducer(initialState, setSystemStatus("isBooted"))
    expect(actual.systemStatus).toEqual("isBooted")
    expectTypeOf(actual.systemStatus).toEqualTypeOf<SystemStatusProps>()
  })

  it("should handle toggleIsDarkmode", () => {
    const actual = coreReducer(initialState, toggleIsDarkmode())
    expect(actual.isDarkmode).toEqual(false)
    expectTypeOf(actual.isDarkmode).toEqualTypeOf<boolean>()
  })

  it("should handle toggleIsMobile", () => {
    const actual = coreReducer(initialState, toggleIsMobile())
    expect(actual.isMobile).toEqual(true)
    expectTypeOf(actual.isMobile).toEqualTypeOf<boolean>()
  })

  it("should handle setShowNotification", () => {
    const actual = coreReducer(initialState, setShowNotification(true))
    expect(actual.showNotification).toEqual(true)
    expectTypeOf(actual.showNotification).toEqualTypeOf<boolean>()
  })

  it("should handle setNotification", () => {
    const mockNotification: NotificationProps = {
      uuid: "mockUuid",
      type: "success",
      message: "hi",
    }
    const actual = coreReducer(initialState, setNotification(mockNotification))
    expect(actual.notificaiton?.message).toEqual(mockNotification.message)
  })
})
