import { Box, Typography } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon from "../../components/icon"
import { Loader } from "../../components/loader"
import { selectIsSystemBooted } from "../core/coreSlice"
import { generateNotification } from "../core/coreUtils"
import { Home } from "../core/home"
import { Route, routePaths } from "../core/pages"
import { register, resetPassword, signIn } from "./userAuth"
import { selectIsSignedIn } from "./userSlice"
import {
  PasswordValidationReturnProps,
  getPasswordValidation,
} from "./userUtils"
/*




*/
type AuthUIState = {
  isSigningIn: boolean
  isVerifying: boolean
  email: string
  password: string
  passwordValidation: PasswordValidationReturnProps
}
type AuthUIKeys = keyof AuthUIState
const initialState: AuthUIState = {
  isSigningIn: false,
  isVerifying: false,
  email: "",
  password: "",
  passwordValidation: {} as PasswordValidationReturnProps,
}
const useAuthUI = create<AuthUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

function setAuthUI(path: AuthUIKeys, value: any) {
  useAuthUI.setState({ [path]: value })
}

export function resetAuthUI() {
  useAuthUI.setState(initialState)
}
/*




*/
export function WithAuth({ route }: { route: Route }) {
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
    return <Authentication />
  } else {
    return route.element
  }
}
/*




*/
export function Authentication({
  isRegistering = false,
}: {
  isRegistering?: boolean
}) {
  return (
    <>
      <AuthenticationInput isRegistering={isRegistering} />
      <SigningInLoader />
      <VerifyEmailPrompt />
    </>
  )
}
/*




*/
function AuthenticationInput({ isRegistering }: { isRegistering: boolean }) {
  const isSigningIn = useAuthUI((state) => state.isSigningIn)
  const isVerifying = useAuthUI((state) => state.isVerifying)
  const validationReport = useAuthUI((state) => state.passwordValidation)

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
  const email = useAuthUI((state) => state.email)
  const password = useAuthUI((state) => state.password)

  function handleEmailChange(event: any) {
    setAuthUI("email", event.target.value)
  }

  function handlePasswordChange(event: any) {
    const passwordValidation = getPasswordValidation(event.target.value)
    setAuthUI("passwordValidation", passwordValidation)
    setAuthUI("password", event.target.value)
  }

  return (
    <Stack width={"100%"} gap={theme.module[4]}>
      <Input placeholder={"Email"} onChange={handleEmailChange} value={email} />
      <Input
        isPassword
        placeholder={"Password"}
        onChange={handlePasswordChange}
        value={password}
      />
    </Stack>
  )
}
/*




*/
function ButtonTray({ isRegistering }: { isRegistering: boolean }) {
  const theme = useTheme()
  const navigate = useNavigate()

  const email = useAuthUI((state) => state.email)
  const password = useAuthUI((state) => state.password)
  const passwordValidation = useAuthUI((state) => state.passwordValidation)
  const isPasswordValid = passwordValidation.isValid
  const isDetailsIncomplete =
    (isRegistering && !isPasswordValid) || !email || !password

  function handleClick() {
    if (!!email && !!password) {
      if (isRegistering && isPasswordValid) {
        setAuthUI("isVerifying", true)
        register(email, password)
      } else {
        setAuthUI("isSigningIn", true)
        signIn(email, password).catch(() => {
          setAuthUI("isSigningIn", false)
        })
      }
      setAuthUI("email", "")
      setAuthUI("password", "")
    }
  }
  /*
  
  
  */
  return (
    <Stack
      width={"100%"}
      direction={"row"}
      justifyContent={"space-between"}
      boxSizing={"border-box"}
    >
      <Button
        variation={"pill"}
        label={isRegistering ? "Register" : "Sign in"}
        onClick={handleClick}
        disabled={isDetailsIncomplete}
        color={theme.scale.gray[isDetailsIncomplete ? 4 : 3]}
      />
      <Button
        variation={"pill"}
        label={isRegistering ? "Sign in?" : "Register?"}
        onClick={() =>
          navigate(routePaths[isRegistering ? "signIn" : "register"].path)
        }
        color={theme.scale.gray[5]}
      />
    </Stack>
  )
}
/*




*/
function ForgotPassword({ isRegistering }: { isRegistering: boolean }) {
  const theme = useTheme()
  const email = useAuthUI((state) => state.email)

  function handleClick() {
    if (!!email) {
      resetPassword(email)
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
      paddingLeft={theme.module[0]}
    >
      <Button
        variation={"pill"}
        label={"Forgot password"}
        onClick={handleClick}
        disabled={isRegistering}
        color={isRegistering ? "transparent" : theme.scale.gray[5]}
      />
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
export function SigningInLoader() {
  const isSigningIn = useAuthUI((state) => state.isSigningIn)

  return isSigningIn ? <Loader narration="signing in..." /> : undefined
}
/*




*/
export function VerifyEmailPrompt() {
  const theme = useTheme()

  const isVerifying = useAuthUI((state) => state.isVerifying)

  return (
    isVerifying && (
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
        <Button
          variation={"pill"}
          label={"Back to sign in"}
          onClick={() => setAuthUI("isVerifying", false)}
        />
      </Stack>
    )
  )
}
/*




*/
