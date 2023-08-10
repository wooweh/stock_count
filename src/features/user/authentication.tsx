import { Box, Typography } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import { useEffect } from "react"
import { Route, useNavigate } from "react-router-dom"
import { create } from "zustand"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Control } from "../../components/control"
import Icon from "../../components/icon"
import { Loader } from "../../components/loader"
import { routePaths } from "../core/core"
import { selectIsSystemActive, selectIsSystemBooted } from "../core/coreSlice"
import { generateNotification } from "../core/notifications"
import {
  registerUserOnAuth,
  resetUserPassword,
  signInUserOnAuth,
} from "./userRemote"
import { selectIsSignedIn } from "./userSlice"
import { Home } from "../core/home"
/*





*/
type UseAuthState = {
  isSigningIn: boolean
  isVerifying: boolean
  email: string
  password: string
  passwordValidation: PasswordValidationReturnProps
}
type UseAuthKeys = keyof UseAuthState
const initialState: UseAuthState = {
  isSigningIn: false,
  isVerifying: false,
  email: "",
  password: "",
  passwordValidation: {} as PasswordValidationReturnProps,
}
const useAuthStore = create<UseAuthState>()((set) => ({
  ...initialState,
}))

function setUseAuth(path: UseAuthKeys, value: any) {
  useAuthStore.setState({ [path]: value })
}

export function resetUseAuth() {
  useAuthStore.setState(initialState)
}
/*





*/
export function WithAuth({ route }: { route: any }) {
  // TODO
  const isSignedIn = useAppSelector(selectIsSignedIn)
  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const navigate = useNavigate()

  useEffect(() => {
    if (isSystemBooted && isSignedIn && !route.requiresAuth) {
      navigate(routePaths.home.path)
    }
  }, [isSystemBooted, route, navigate, isSignedIn])

  useEffect(() => {
    if (!isSignedIn && route.requiresAuth) {
      navigate(routePaths.signIn.path)
    }
  }, [isSignedIn, route, navigate])

  if (isSystemBooted && !route.requiresAuth) {
    return <Home />
  } else if (!isSignedIn && route.requiresAuth) {
    return <Authentication isRegistering={false} />
  } else {
    return route.element
  }
}
/*





*/
export function Authentication({ isRegistering }: { isRegistering: boolean }) {
  // const navigate = useNavigate()
  // const isSignedIn = useAppSelector(selectIsSignedIn)
  // const isSystemBooted = useAppSelector(selectIsSystemBooted)

  // useEffect(() => {
  //   if (isSystemBooted && isSignedIn) {
  //     navigate(routePaths.home.path)
  //   }
  // }, [isSystemBooted, isSignedIn, navigate])

  return (
    <>
      <AuthenticationInput isRegistering={isRegistering} />
      <SigningIn />
      <VerifyEmail />
    </>
  )
}
/*





*/
function AuthenticationInput({ isRegistering }: { isRegistering: boolean }) {
  const isSigningIn = useAuthStore((state) => state.isSigningIn)
  const isVerifying = useAuthStore((state) => state.isVerifying)
  const validationReport = useAuthStore((state) => state.passwordValidation)

  return !isSigningIn && !isVerifying ? (
    <Outer>
      <Logo />
      <CredentialInputs />
      <ButtonTray isRegistering={isRegistering} />
      <PasswordValidationCheck
        isActive={isRegistering}
        validationReport={validationReport}
      />
      <ForgotPassword isRegistering={isRegistering} />
    </Outer>
  ) : undefined
}
/*





*/
function Outer({ children }: { children: any }) {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      maxWidth={`calc(${theme.module[9]} * 1.75)`}
      gap={theme.module[4]}
      padding={theme.module[5]}
      paddingTop={0}
      boxSizing={"border-box"}
      alignItems={"center"}
    >
      {children}
    </Stack>
  )
}
/*





*/
function Logo() {
  const theme = useTheme()
  return (
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
  )
}
/*





*/
function CredentialInputs() {
  const theme = useTheme()
  const email = useAuthStore((state) => state.email)
  const password = useAuthStore((state) => state.password)
  /*


*/
  function handleEmailChange(event: any) {
    setUseAuth("email", event.target.value)
  }
  /*


*/
  function handlePasswordChange(event: any) {
    const passwordValidation = getPasswordValidation(event.target.value)
    setUseAuth("passwordValidation", passwordValidation)
    setUseAuth("password", event.target.value)
  }
  /*

  
  */

  return (
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
  )
}
/*





*/
type PasswordValidationReturnProps = {
  minCharCount: boolean
  minCapCharCount: boolean
  minNumCharCount: boolean
  minSpecialCharCount: boolean
  isValid: boolean
}
export function getPasswordValidation(
  password: string,
): PasswordValidationReturnProps {
  const MIN_CHAR_COUNT = 6
  const MIN_CAP_CHAR_COUNT = 1
  const MIN_NUM_CHAR_COUNT = 1
  const MIN_SPECIAL_CHAR_COUNT = 1

  const charCount = password.length
  const capCharCount = (password.match(/[A-Z]/g) || []).length
  const numCharCount = (password.match(/\d/g) || []).length
  const specialCharCount = (password.match(/[^\w\s]/g) || []).length

  const minCharCount = charCount >= MIN_CHAR_COUNT
  const minCapCharCount = capCharCount >= MIN_CAP_CHAR_COUNT
  const minNumCharCount = numCharCount >= MIN_NUM_CHAR_COUNT
  const minSpecialCharCount = specialCharCount >= MIN_SPECIAL_CHAR_COUNT
  const isValid =
    minCharCount && minCapCharCount && minNumCharCount && minSpecialCharCount

  return {
    minCharCount,
    minCapCharCount,
    minNumCharCount,
    minSpecialCharCount,
    isValid,
  }
}
/*





*/
function ButtonTray({ isRegistering }: { isRegistering: boolean }) {
  const theme = useTheme()
  const navigate = useNavigate()

  const email = useAuthStore((state) => state.email)
  const password = useAuthStore((state) => state.password)
  const passwordValidation = useAuthStore((state) => state.passwordValidation)
  const isPasswordValid = passwordValidation.isValid
  const isButtonDisabled =
    (isRegistering && !isPasswordValid) || !email || !password
  /*

  
  */
  function handleClick() {
    if (!!email && !!password) {
      if (isRegistering && isPasswordValid) {
        setUseAuth("isVerifying", true)
        registerUserOnAuth(email, password)
      } else {
        setUseAuth("isSigningIn", true)
        signInUserOnAuth(email, password)
      }
      setUseAuth("email", "")
      setUseAuth("password", "")
    }
  }
  /*
  
  
  */
  return (
    <Stack
      width={"100%"}
      gap={theme.module[4]}
      direction={"row"}
      justifyContent={"space-between"}
      paddingLeft={theme.module[3]}
      paddingRight={theme.module[3]}
      boxSizing={"border-box"}
    >
      <Button
        onClick={handleClick}
        disabled={isButtonDisabled}
        sx={{
          color: isButtonDisabled ? theme.scale.gray[4] : theme.scale.gray[3],
        }}
      >
        {isRegistering ? "Register" : "Sign in"}
      </Button>
      <Button
        onClick={() =>
          navigate(routePaths[isRegistering ? "signIn" : "register"].path)
        }
        sx={{ color: theme.scale.gray[5] }}
        key={isRegistering ? "register" : "signIn"}
      >
        {isRegistering ? "Sign in?" : "Register?"}
      </Button>
    </Stack>
  )
}
/*





*/
function ForgotPassword({ isRegistering }: { isRegistering: boolean }) {
  const theme = useTheme()
  const email = useAuthStore((state) => state.email)
  /*


*/
  function handleClick() {
    if (!!email) {
      resetUserPassword(email)
    } else {
      generateNotification("invalidEmail")
    }
  }
  /*
    
    
    */
  return (
    <Stack
      width={"100%"}
      alignItems={"flex-start"}
      paddingLeft={theme.module[4]}
    >
      <Button
        onClick={handleClick}
        disabled={isRegistering}
        sx={{
          color: isRegistering ? "transparent" : theme.scale.gray[5],
          width: "min-content",
        }}
      >
        {"Forgot password"}
      </Button>
    </Stack>
  )
}
/*





*/
export function PasswordValidationCheck({
  isActive,
  validationReport,
}: {
  isActive: boolean
  validationReport: PasswordValidationReturnProps
}) {
  const theme = useTheme()

  const checks = [
    {
      isValid: validationReport.minCharCount,
      description: "At least 6 characters long",
    },
    {
      isValid: validationReport.minCapCharCount,
      description: "At least 1 capital letter",
    },
    {
      isValid: validationReport.minNumCharCount,
      description: "At least 1 number",
    },
    {
      isValid: validationReport.minSpecialCharCount,
      description: "At least 1 special character (@ # $...)",
    },
  ]

  return (
    <Accordion expanded={isActive}>
      <AccordionSummary />
      <AccordionDetails>
        <Stack
          width={"100%"}
          gap={theme.module[4]}
          paddingLeft={theme.module[3]}
          boxSizing={"border-box"}
          alignItems={"flex-start"}
        >
          <Typography
            color={
              validationReport.isValid
                ? theme.scale.green[4]
                : theme.scale.red[4]
            }
            sx={{ transition: "color 350ms" }}
          >
            Password Check:
          </Typography>
          {checks.map((check: (typeof checks)[number], index: number) => {
            return <CheckLineItem key={index} check={check} />
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
/*





*/
function CheckLineItem({
  check,
}: {
  check: { isValid: boolean; description: string }
}) {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      direction={"row"}
      gap={theme.module[4]}
      justifyItems={"center"}
    >
      <Box
        width={theme.module[4]}
        height={theme.module[4]}
        borderRadius={theme.module[1]}
        bgcolor={check.isValid ? theme.scale.green[5] : theme.scale.red[6]}
        sx={{ transition: "background 350ms" }}
      />
      <Typography color={theme.scale.gray[4]} variant="body2">
        {check.description}
      </Typography>
    </Stack>
  )
}
/*





*/
export function SigningIn() {
  const isSigningIn = useAuthStore((state) => state.isSigningIn)

  // return <Loader narration="signing in..." />
  return isSigningIn ? <Loader narration="signing in..." /> : undefined
}
/*





*/
export function VerifyEmail() {
  const theme = useTheme()

  const isVerifying = useAuthStore((state) => state.isVerifying)

  return isVerifying ? (
    <Stack
      width={"100%"}
      height={"100%"}
      gap={theme.module[4]}
      justifyContent={"center"}
      alignContent={"center"}
      position={"absolute"}
      zIndex={100}
      padding={theme.module[4]}
      boxSizing={"border-box"}
    >
      <Typography>
        An email has been sent to you. Click the link to verify your account.
      </Typography>
      <Button onClick={() => setUseAuth("isVerifying", false)}>
        Back to sign in
      </Button>
    </Stack>
  ) : undefined
}
/*





*/
