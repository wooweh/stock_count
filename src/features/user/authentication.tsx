import { Typography } from "@mui/material"
import Button from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { store } from "../../app/store"
import useTheme from "../../common/useTheme"
import { Control } from "../../components/control"
import Icon from "../../components/icon"
import { auth } from "../../remote_config"
import { routePaths } from "../core/core"
import { selectIsLoggedIn, signIn } from "./userSlice"
import { Loader } from "../../components/loader"
/*





*/
function registerAndSignInUser(
  email: string,
  password: string,
  dispatch: any,
  navigate: any,
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const signedIn = store.getState().user.isLoggedIn
      if (!!userCredential.user && !signedIn) {
        dispatch(signIn())
        navigate(routePaths.home.path)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
/*





*/
function signInUser(
  email: string,
  password: string,
  dispatch: any,
  navigate: any,
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const signedIn = store.getState().user.isLoggedIn
      if (!!userCredential.user && !signedIn) {
        dispatch(signIn())
        navigate(routePaths.home.path)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
/*





*/
export function SignInWithCredentials() {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  /*


*/
  function handleEmailChange(event: any) {
    setEmail(event.target.value)
  }
  /*


*/
  function handlePasswordChange(event: any) {
    setPassword(event.target.value)
  }
  /*


*/
  function handleClick() {
    if (!!email && !!password) {
      navigate(routePaths.signingIn.path)
      if (isRegistering) {
        registerAndSignInUser(email, password, dispatch, navigate)
      } else {
        signInUser(email, password, dispatch, navigate)
      }
    } else {
      // TODO: Email and password conditions
    }
  }
  /*


*/
  useEffect(() => {
    const authUser = auth.currentUser
    if (!!authUser && isLoggedIn) {
      navigate(routePaths.home.path)
    }
  }, [navigate, isLoggedIn, dispatch])

  return (
    <Stack
      width={"100%"}
      maxWidth={`calc(${theme.module[9]} * 1.75)`}
      gap={theme.module[4]}
      padding={theme.module[5]}
      boxSizing={"border-box"}
      alignItems={"center"}
    >
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        gap={theme.module[3]}
      >
        <Icon variation="stock" />
        <Typography variant="h5" justifyContent={"flex-end"}>
          StockCount
        </Typography>
      </Stack>
      <Stack width={"100%"} gap={theme.module[4]}>
        <Control
          variation={"input"}
          placeholder={"Email"}
          onChange={handleEmailChange}
          value={email}
        />
        <Control
          variation={"input"}
          placeholder={"Password"}
          type={"password"}
          onChange={handlePasswordChange}
          value={password}
        />
      </Stack>
      <Stack
        width={"100%"}
        gap={theme.module[4]}
        direction={"row"}
        justifyContent={"space-between"}
        paddingLeft={theme.module[3]}
        paddingRight={theme.module[3]}
        boxSizing={"border-box"}
      >
        <Button onClick={handleClick} sx={{ color: theme.scale.gray[3] }}>
          {isRegistering ? "Register" : "Sign in"}
        </Button>
        <Button
          onClick={() => setIsRegistering(isRegistering ? false : true)}
          sx={{ color: theme.scale.gray[5] }}
        >
          {isRegistering ? "Sign in?" : "Register?"}
        </Button>
      </Stack>
    </Stack>
  )
}
/*





*/
export function SigningIn() {
  return <Loader narration="signing in" />
}
/*





*/
