import { Box, Typography } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Control } from "../../components/control"
import Icon from "../../components/icon"
import { Loader } from "../../components/loader"
import { auth } from "../../remote"
import {
  registerUserOnAuth,
  resetUserPassword,
  signInUserOnAuth,
} from "./userRemote"
import { routePaths } from "../core/core"
import { generateNotification } from "../core/notifications"
import { selectIsLoggedIn, signIn } from "./userSlice"
import { selectIsSystemBooted } from "../core/coreSlice"
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
export function SignInWithCredentials() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(
    {} as PasswordValidationReturnProps,
  )

  return (
    <Outer>
      <Logo />
      <CredentialInputs
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setPasswordValidation={setPasswordValidation}
      />
      <ButtonTray
        email={email}
        password={password}
        passwordValidation={passwordValidation}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
      />
      <PasswordValidationCheck
        validationReport={passwordValidation}
        isActive={isRegistering}
      />
      {!isRegistering ? <ForgotPassword email={email} /> : undefined}
    </Outer>
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
type CredentialInputProps = {
  email: string
  setEmail: Function
  password: string
  setPassword: Function
  setPasswordValidation: Function
}
function CredentialInputs(props: CredentialInputProps) {
  const theme = useTheme()
  /*


*/
  function handleEmailChange(event: any) {
    props.setEmail(event.target.value)
  }
  /*


*/
  function handlePasswordChange(event: any) {
    props.setPasswordValidation(getPasswordValidation(event.target.value))
    props.setPassword(event.target.value)
  }
  /*

  
  */

  return (
    <Stack width={"100%"} gap={theme.module[4]}>
      <Control
        variation={"input"}
        placeholder={"Email"}
        onChange={handleEmailChange}
        value={props.email}
      />
      <Control
        variation={"input"}
        placeholder={"Password"}
        type={"password"}
        onChange={handlePasswordChange}
        value={props.password}
      />
    </Stack>
  )
}
/*





*/
type ButtonTrayProps = {
  email: string
  password: string
  passwordValidation: PasswordValidationReturnProps
  isRegistering: boolean
  setIsRegistering: Function
}
function ButtonTray(props: ButtonTrayProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isPasswordValid = props.passwordValidation.isValid
  /*

  
  */
  function handleClick() {
    if (!!props.email && !!props.password) {
      if (props.isRegistering && isPasswordValid) {
        navigate(routePaths.verifyEmail.path)
        registerUserOnAuth(props.email, props.password, dispatch, navigate)
      } else {
        navigate(routePaths.signingIn.path)
        signInUserOnAuth(props.email, props.password, dispatch, navigate)
      }
    }
  }
  /*
  
  
  */
  const isButtonDisabled =
    (props.isRegistering && !isPasswordValid) || !props.email || !props.password

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
        {props.isRegistering ? "Register" : "Sign in"}
      </Button>
      <Button
        onClick={() =>
          props.setIsRegistering(props.isRegistering ? false : true)
        }
        sx={{ color: theme.scale.gray[5] }}
      >
        {props.isRegistering ? "Sign in?" : "Register?"}
      </Button>
    </Stack>
  )
}
/*





*/
function ForgotPassword({ email }: { email: string }) {
  const theme = useTheme()
  function handleClick() {
    if (!!email) {
      resetUserPassword(email)
    } else {
      generateNotification("invalidEmail")
    }
  }
  return (
    <Stack
      width={"100%"}
      alignItems={"flex-start"}
      paddingLeft={theme.module[4]}
    >
      <Button
        onClick={handleClick}
        sx={{
          color: theme.scale.gray[5],
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
  validationReport,
  isActive,
}: {
  validationReport: PasswordValidationReturnProps
  isActive: boolean
}) {
  const theme = useTheme()
  const CHECKS = [
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
          {CHECKS.map(
            (
              check: { isValid: boolean; description: string },
              index: number,
            ) => {
              return (
                <Stack
                  width={"100%"}
                  direction={"row"}
                  gap={theme.module[4]}
                  justifyItems={"center"}
                  key={index}
                >
                  <Box
                    width={theme.module[4]}
                    height={theme.module[4]}
                    borderRadius={theme.module[1]}
                    bgcolor={
                      check.isValid ? theme.scale.green[5] : theme.scale.red[6]
                    }
                    sx={{ transition: "background 350ms" }}
                  />
                  <Typography color={theme.scale.gray[4]} variant="body2">
                    {check.description}
                  </Typography>
                </Stack>
              )
            },
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
/*





*/
export function SigningIn() {
  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const navigate = useNavigate()
  useEffect(() => {
    if (isSystemBooted) setTimeout(() => navigate(routePaths.home.path), 1000)
  }, [isSystemBooted, navigate])

  return <Loader narration="signing in..." />
}
/*





*/
export function VerifyEmail() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!!user && user.emailVerified && !isLoggedIn) {
        dispatch(signIn())
        navigate(routePaths.home.path)
      }
    })
  })

  return (
    <Stack padding={theme.module[4]} boxSizing={"border-box"}>
      <Typography>
        An email has been sent to you. Click the link to verify your account.
      </Typography>
    </Stack>
  )
}
/*





*/
