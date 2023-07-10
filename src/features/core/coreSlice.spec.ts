import coreReducer, {
  CoreState,
  NotificationProps,
  bootSystem,
  hideNotification,
  resetSystem,
  showNotification,
  toggleIsDarkmode,
  toggleIsMobile,
} from "./coreSlice"
import { v4 as uuidv4 } from "uuid"

describe("core reducer", () => {
  const initialState: CoreState = {
    isSystemBooted: false,
    isDarkmode: true,
    isMobile: false,
    showNotification: false,
    notificaiton: undefined,
  }
  it("should handle initial state", () => {
    expect(coreReducer(undefined, { type: "unknown" })).toEqual({
      isSystemBooted: false,
      isDarkmode: true,
      isMobile: false,
      showNotification: false,
      notificaiton: undefined,
    })
  })

  it("should handle bootSystem", () => {
    const actual = coreReducer(initialState, bootSystem())
    expect(actual.isSystemBooted).toEqual(true)
  })

  it("should handle resetSystem", () => {
    const actual = coreReducer(initialState, resetSystem())
    expect(actual.isSystemBooted).toEqual(false)
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
