import { onAuthStateChanged } from "firebase/auth"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { auth } from "../../remote"
import { Organisation } from "../organisation/organisation"
import { Stock } from "../stock/stock"
import {
  SignInWithCredentials,
  SigningIn,
  VerifyEmail,
} from "../user/authentication"
import UserProfile from "../user/user"
import { selectIsLoggedIn, signOut } from "../user/userSlice"
import { Bar } from "./bar"
import { selectIsMobile, toggleIsMobile } from "./coreSlice"
import { DBListeners } from "./dbListeners"
import { Home } from "./home"
import { Notifications } from "./notifications"
/*





*/
export const routes = [
  {
    name: "Sign in",
    path: "/sign_in",
    requiresAuth: false,
    element: <SignInWithCredentials />,
  },
  {
    name: "Verify email",
    path: "/verify_email",
    requiresAuth: false,
    element: <VerifyEmail />,
  },
  {
    name: "Signing in",
    path: "/signing_in",
    requiresAuth: false,
    element: <SigningIn />,
  },
  {
    name: "Home",
    path: "/",
    requiresAuth: true,
    element: <Home />,
  },
  {
    name: "New count",
    path: "/new_count",
    requiresAuth: true,
    element: <div>New count</div>,
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
function getPublicPaths() {
  return _.filter(routes, (route) => !route.requiresAuth)
}
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
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthorised, setIsAuthorised] = useState(false)
  const { width, ref } = useResizeDetector()

  useEffect(() => {
    updateMobile(dispatch, width, isMobile)
  }, [width, isMobile, dispatch])

  useEffect(() => {
    const publicPaths = getPublicPaths()
    const isPublicPath =
      _.findIndex(publicPaths, (path) => path.path === location.pathname) !== -1

    onAuthStateChanged(auth, (user) => {
      setIsAuthorised(!!user && isLoggedIn)
      if (user && !isLoggedIn) {
        dispatch(signOut)
        navigate(routePaths.signIn.path)
      }
      if (!user && !isPublicPath) {
        dispatch(signOut)
        navigate(routePaths.signIn.path)
      }
      if (user && isLoggedIn && isPublicPath) {
        navigate(routePaths.home.path)
      }
    })
  }, [navigate, location.pathname, dispatch, isLoggedIn])

  return (
    <>
      <Bar />
      <DBListeners />
      <Notifications />
      <Container resizeRef={ref}>
        <Routes>
          {routes.map((route: any, index: number) => {
            return !isAuthorised && route.requiresAuth ? null : (
              <Route path={route.path} element={route.element} key={index} />
            )
          })}
        </Routes>
      </Container>
    </>
  )
}
