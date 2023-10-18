import { describe, expect, it } from "vitest"
import coreReducer, {
  CoreState,
  NotificationProps,
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
  })

  it("should handle toggleIsDarkmode", () => {
    const actual = coreReducer(initialState, toggleIsDarkmode())
    expect(actual.isDarkmode).toEqual(false)
  })

  it("should handle toggleIsMobile", () => {
    const actual = coreReducer(initialState, toggleIsMobile())
    expect(actual.isMobile).toEqual(true)
  })

  it("should handle setShowNotification", () => {
    const actual = coreReducer(initialState, setShowNotification(true))
    expect(actual.showNotification).toEqual(true)
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
