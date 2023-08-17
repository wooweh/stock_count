import coreReducer, {
  CoreState,
  NotificationProps,
  hideNotification,
  resetSystem,
  setSystemStatus,
  showNotification,
  toggleIsDarkmode,
  toggleIsMobile,
} from "./coreSlice"
import { v4 as uuidv4 } from "uuid"

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

  it("should handle resetSystem", () => {
    const actual = coreReducer(initialState, resetSystem())
    expect(actual.systemStatus).toEqual("notBooted")
  })

  it("should handle toggleIsDarkmode", () => {
    const actual = coreReducer(initialState, toggleIsDarkmode())
    expect(actual.isDarkmode).toEqual(false)
  })

  it("should handle toggleIsMobile", () => {
    const actual = coreReducer(initialState, toggleIsMobile())
    expect(actual.isMobile).toEqual(true)
  })

  it("should handle showNotification", () => {
    const mockNotification: NotificationProps = {
      uuid: uuidv4(),
      type: "success",
      message: "hi",
    }
    const actual = coreReducer(initialState, showNotification(mockNotification))
    expect(actual.showNotification).toEqual(true)
    expect(actual.notificaiton?.message).toEqual(mockNotification.message)
  })

  it("should handle hideNotification", () => {
    const actual = coreReducer(initialState, hideNotification())
    expect(actual.showNotification).toEqual(false)
    expect(actual.notificaiton).toEqual(undefined)
  })
})
