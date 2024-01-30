import { Box, Typography } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Stack from "@mui/material/Stack"
import _ from "lodash"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon from "../../components/icon"
import { Loader } from "../../components/loader"
import { Slot, Window } from "../../components/surface"
import { selectIsSystemBooted } from "../core/coreSliceSelectors"
import { Home } from "../core/home"
import { Route, routePaths } from "../core/pages"
import { register, resetPassword, signIn } from "./userAuth"
import { selectIsSignedIn } from "./userSliceSelectors"
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
export function AuthWrapper({ route }: { route: Route }) {
  const navigate = useNavigate()

  const isSignedIn = useAppSelector(selectIsSignedIn)
  const isSystemBooted = useAppSelector(selectIsSystemBooted)

  const shouldNavigateHome = isSystemBooted && isSignedIn && !route.requiresAuth

  useEffect(() => {
    if (shouldNavigateHome) {
      navigate(routePaths.home.path)
    }
  }, [shouldNavigateHome])

  const shouldNavigateSignIn = !isSignedIn && route.requiresAuth

  useEffect(() => {
    if (shouldNavigateSignIn) {
      navigate(routePaths.signIn.path)
    }
  }, [shouldNavigateSignIn])

  if (shouldNavigateHome) {
    return <Home />
  } else if (shouldNavigateSignIn) {
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
  const location = useLocation()
  const authUIState = useAuthUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"Authentication"}
      featurePath={path}
      state={{ featureUI: { ...authUIState } }}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <AuthenticationInput isRegistering={isRegistering} />
        <SigningInLoader />
        <VerifyEmailPrompt />
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
function AuthenticationInput({ isRegistering }: { isRegistering: boolean }) {
  const isSigningIn = useAuthUI((state) => state.isSigningIn)
  const isVerifying = useAuthUI((state) => state.isVerifying)
  const validationReport = useAuthUI((state) => state.passwordValidation)

  return (
    !isSigningIn &&
    !isVerifying && (
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
    )
  )
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
    <Slot gap={theme.module[2]} justifyContent={"flex-start"}>
      <Icon variation="stock" color={theme.scale.gray[5]} />
      <Typography
        variant="h5"
        justifyContent={"center"}
        color={theme.scale.gray[5]}
      >
        StockCount
      </Typography>
    </Slot>
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
  const isDetailsComplete = !isDetailsIncomplete

  function handleClick() {
    if (isDetailsComplete) isRegistering ? registerUser() : signInUser()
  }

  function registerUser() {
    setAuthUI("isVerifying", true)
    register(email, password)
  }

  function signInUser() {
    setAuthUI("isSigningIn", true)
    signIn(email, password).catch(() => setAuthUI("isSigningIn", false))
    _.delay(() => setAuthUI("isSigningIn", false), 5000)
  }

  const actionLabel = isRegistering ? "Register" : "Sign in"
  const navigationLabel = isRegistering ? "Sign in?" : "Register?"
  const path = routePaths[isRegistering ? "signIn" : "register"].path

  return (
    <Slot justifyContent={"space-between"}>
      <Button
        variation={"pill"}
        label={actionLabel}
        onClick={handleClick}
        disabled={isDetailsIncomplete}
        color={theme.scale.green[6]}
        outlineColor={theme.scale.green[8]}
        bgColor={theme.scale.gray[8]}
      />
      <Button
        variation={"pill"}
        label={navigationLabel}
        onClick={() => navigate(path)}
        color={theme.scale.blue[6]}
      />
    </Slot>
  )
}
/*




*/
function ForgotPassword({ isRegistering }: { isRegistering: boolean }) {
  const theme = useTheme()
  const email = useAuthUI((state) => state.email)

  function handleClick() {
    if (!!email) resetPassword(email)
  }

  const isDisabled = !email || isRegistering

  return (
    <Stack
      width={"100%"}
      alignItems={"flex-start"}
      paddingLeft={theme.module[0]}
      sx={{
        opacity: isRegistering ? 0 : 1,
        transition: `opacity ${isRegistering ? 0 : 350}ms`,
      }}
    >
      <Button
        variation={"pill"}
        label={`Forgot password ${
          isDisabled ? "(Enter your email address)" : ""
        }`}
        onClick={handleClick}
        disabled={isDisabled}
        color={theme.scale.orange[6]}
      />
    </Stack>
  )
}
/*




*/
type PasswordCheckProps = {
  isValid: boolean
  description: string
}
export function PasswordValidationCheck({
  isActive,
  validationReport,
}: {
  isActive: boolean
  validationReport: PasswordValidationReturnProps
}) {
  const theme = useTheme()

  const checks: PasswordCheckProps[] = [
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
    <Accordion
      expanded={isActive}
      sx={{
        opacity: isActive ? 1 : 0,
        transition: `opacity ${isActive ? 250 : 750}ms ease-out`,
      }}
    >
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
          {checks.map((check: PasswordCheckProps, index: number) => {
            return <CheckLineItem key={index} check={check} />
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
/*




*/
function CheckLineItem({ check }: { check: PasswordCheckProps }) {
  const theme = useTheme()

  return (
    <Slot gap={theme.module[4]} justifyContent={"flex-start"}>
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
    </Slot>
  )
}
/*




*/
export function SigningInLoader() {
  const isSigningIn = useAuthUI((state) => state.isSigningIn)

  return isSigningIn && <Loader narration="signing in" />
}
/*




*/
export function VerifyEmailPrompt() {
  const theme = useTheme()
  const isVerifying = useAuthUI((state) => state.isVerifying)
  const email = useAuthUI((state) => state.email)
  const password = useAuthUI((state) => state.password)

  function signInUser() {
    setAuthUI("isVerifying", false)
    setAuthUI("isSigningIn", true)
    signIn(email, password).catch(() => setAuthUI("isSigningIn", false))
    _.delay(() => setAuthUI("isSigningIn", false), 5000)
  }

  return (
    isVerifying && (
      <Window
        gap={theme.module[4]}
        justifyContent={"center"}
        position={"absolute"}
        zIndex={100}
        padding={theme.module[6]}
      >
        <Typography
          fontWeight={"bold"}
          color={theme.scale.gray[5]}
          textAlign={"center"}
        >
          An email has been sent to you. Click the link to verify your account.
        </Typography>
        <Button
          variation={"pill"}
          label={"Continue to app"}
          onClick={signInUser}
          color={theme.scale.blue[6]}
        />
      </Window>
    )
  )
}
/*




*/
