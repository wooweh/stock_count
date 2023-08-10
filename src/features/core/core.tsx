import _ from "lodash"
import { useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { Organisation, resetUseOrg } from "../organisation/organisation"
import { Stock, resetUseStock } from "../stock/stock"
import { Authentication, WithAuth, resetUseAuth } from "../user/authentication"
import UserProfile, { resetUseUser } from "../user/user"
import { Bar } from "./bar"
import { selectIsMobile, toggleIsMobile } from "./coreSlice"
import { DBListeners } from "./dbListeners"
import { Home } from "./home"
import { Notifications } from "./notifications"
import { Count } from "../count/count"
/*





*/
export const routes = [
  {
    name: "Sign in",
    path: "/sign_in",
    requiresAuth: false,
    element: <Authentication isRegistering={false} />,
  },
  {
    name: "Register",
    path: "/register",
    requiresAuth: false,
    element: <Authentication isRegistering={true} />,
  },
  {
    name: "Home",
    path: "/",
    requiresAuth: true,
    element: <Home />,
  },
  {
    name: "Count",
    path: "/count",
    requiresAuth: true,
    element: <Count />,
  },
  {
    name: "Stock",
    path: "/stock",
    requiresAuth: true,
    element: <Stock />,
  },
  {
    name: "History",
    path: "/history",
    requiresAuth: true,
    element: <div>History</div>,
  },
  {
    name: "Analysis",
    path: "/analysis",
    requiresAuth: true,
    element: <div>Analysis</div>,
  },
  {
    name: "Organisation",
    path: "/organisation",
    requiresAuth: true,
    element: <Organisation />,
  },
  {
    name: "Profile",
    path: "/profile",
    requiresAuth: true,
    element: <UserProfile />,
  },
]
/*





*/
function getRoutePaths() {
  const result: any = {}

  routes.forEach((obj: any) => {
    const { name, path } = obj
    const keyName = _.replace(
      name.toLowerCase(),
      / ([a-z])/g,
      (match: any, char: string) => char.toUpperCase(),
    )
    result[keyName] = { name: name, path: path }
  })
  return result
}
export const routePaths = getRoutePaths()
/*





*/
function updateMobile(
  dispatch: Function,
  width: number | undefined,
  isMobile: boolean,
) {
  const mobileWidth = 1000
  if (width && width < mobileWidth && !isMobile) dispatch(toggleIsMobile())
  if (width && width > mobileWidth && isMobile) dispatch(toggleIsMobile())
}
/*





*/
export default function Core() {
  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobile)
  const { width, ref } = useResizeDetector()
  const location = useLocation()

  useEffect(() => {
    updateMobile(dispatch, width, isMobile)
  }, [width, isMobile, dispatch])

  useEffect(() => {
    resetUseAuth()
    resetUseUser()
    resetUseOrg()
    resetUseStock()
  }, [location])
  //  TODO
  return (
    <>
      <Bar />
      <DBListeners />
      <Notifications />
      <Container resizeRef={ref}>
        <Routes>
          {routes.map((route: any, index: number) => {
            return (
              <Route
                path={route.path}
                element={<WithAuth route={route} />}
                key={index}
              />
            )
          })}
        </Routes>
      </Container>
    </>
  )
}
