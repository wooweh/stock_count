import _ from "lodash"
import { useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { Organisation } from "../organisation/organisation"
import { SignInWithCredentials, SigningIn } from "../user/authentication"
import UserProfile from "../user/user"
import { selectIsLoggedIn } from "../user/userSlice"
import { Bar } from "./bar"
import {
  selectIsMobile,
  selectIsSystemBooted,
  toggleIsMobile,
} from "./coreSlice"
import { DBListeners } from "./dbListeners"
import { Home } from "./home"
import { Notification } from "./notification"
/*





*/
export const routes = [
  {
    name: "Sign in",
    path: "/sign_in",
    element: <SignInWithCredentials />,
  },
  {
    name: "Signing in",
    path: "/signing_in",
    element: <SigningIn />,
  },
  {
    name: "Home",
    path: "/",
    element: <Home />,
  },
  {
    name: "New count",
    path: "/new_count",
    element: <div>New count</div>,
  },
  {
    name: "Stock list",
    path: "/stock_list",
    element: <div>Stock list</div>,
  },
  {
    name: "History",
    path: "/history",
    element: <div>History</div>,
  },
  {
    name: "Analysis",
    path: "/analysis",
    element: <div>Analysis</div>,
  },
  {
    name: "Organisation",
    path: "/organisation",
    element: <Organisation />,
  },
  {
    name: "Profile",
    path: "/profile",
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
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const navigate = useNavigate()
  const location = useLocation()
  const { width, ref } = useResizeDetector()

  const unAuthorised =
    !isLoggedIn && location.pathname !== routePaths.signingIn.path
  const atSignUp = location.pathname === routePaths.signIn.path

  useEffect(() => {
    updateMobile(dispatch, width, isMobile)
  }, [width, isMobile, dispatch])

  useEffect(() => {
    if (unAuthorised) navigate(routePaths.signIn.path)
  }, [unAuthorised, navigate])

  return (
    <>
      <Bar />
      <DBListeners isSystemBooted={isSystemBooted} />
      <Notification />
      <Container resizeRef={ref}>
        <Routes>
          {routes.map((route: any, index: number) => {
            return unAuthorised && !atSignUp ? null : (
              <Route path={route.path} element={route.element} key={index} />
            )
          })}
        </Routes>
      </Container>
    </>
  )
}
