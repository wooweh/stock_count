import _ from "lodash"
import { useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { Count, resetUseCount } from "../count/count"
import { Organisation, resetUseOrg } from "../organisation/organisation"
import { Stock, resetUseStock } from "../stock/stock"
import { Authentication, WithAuth, resetUseAuth } from "../user/authentication"
import { UserProfile, resetUseUser } from "../user/user"
import { selectIsMobile, toggleIsMobile } from "./coreSlice"
import { Home } from "./home"
import { selectIsUserCounting } from "../count/countSlice"
/*





*/
export const routes = [
  {
    name: "Sign in",
    path: "/sign_in",
    requiresAuth: false,
    element: <Authentication />,
  },
  {
    name: "Register",
    path: "/register",
    requiresAuth: false,
    element: <Authentication isRegistering />,
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
export function Pages() {
  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobile)
  const isUserCounting = useAppSelector(selectIsUserCounting)
  const { width, ref } = useResizeDetector()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  useEffect(() => {
    updateMobile(dispatch, width, isMobile)
  }, [width, isMobile, dispatch])

  useEffect(() => {
    const isAuthPath = path === routePaths.signIn.path
    const isProfilePath = path === routePaths.profile.path
    const isOrgPath = path === routePaths.organisation.path
    const isStockPath = path === routePaths.stock.path
    const isCountPath = path === routePaths.count.path

    if (!isAuthPath) resetUseAuth()
    if (!isProfilePath) resetUseUser()
    if (!isOrgPath) resetUseOrg()
    if (!isStockPath) resetUseStock()
    if (!isCountPath) resetUseCount()
  }, [path])

  useEffect(() => {
    const isCountPath = path === routePaths.count.path
    if (isUserCounting && !isCountPath) navigate(routePaths.count.path)
  }, [isUserCounting, navigate, path])

  return (
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
  )
}
