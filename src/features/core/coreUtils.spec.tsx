import { IUseNetworkState } from "react-use/lib/useNetworkState"
import { describe, expect, expectTypeOf, it } from "vitest"
import { NotificationProps, NotificationTypes } from "./coreSlice"
import {
  GetRoutePathsReturnProps,
  getNetworkStateAttributes,
  getRoutePaths,
  prepareNotificationPayload,
} from "./coreUtils"
import { Routes } from "./pages"
/*




*/
describe("core utils", () => {
  it("should handle getRoutePaths", () => {
    const mockRoutes: Routes = [
      {
        name: "isBooted",
        path: "/",
        requiresAuth: false,
        element: <div>isBooted</div>,
      },
    ]
    const actual = getRoutePaths(mockRoutes)
    expect(actual.isbooted.name).toEqual("isBooted")
    expect(actual.isbooted.path).toEqual("/")
    expectTypeOf(actual).toEqualTypeOf<GetRoutePathsReturnProps>()
  })

  it("should handle prepareNotificationPayload", () => {
    const mockType: NotificationTypes = "error"
    const mockMessage: string = "message"
    const actual = prepareNotificationPayload(mockType, mockMessage)
    expect(actual.type).toEqual(mockType)
    expect(actual.message).toEqual(mockMessage)
    expectTypeOf(actual).toEqualTypeOf<NotificationProps>()
  })

  it("should handle getNetworkStateAttributes", () => {
    const mockNetworkState: IUseNetworkState = {
      online: true,
      previous: true,
      downlink: 1,
      type: "wifi",
      effectiveType: "2g",
      since: new Date(),
      downlinkMax: 1,
      rtt: 0,
      saveData: true,
    }
    const actual = getNetworkStateAttributes(mockNetworkState)
    expect(actual.status).toEqual("medium")
    expect(actual.isWifi).toEqual(true)
  })
})
/*




*/
