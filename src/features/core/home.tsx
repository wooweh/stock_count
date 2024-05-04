import { Typography } from "@mui/material"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon, { IconNames } from "../../components/icon"
import { Slot, Window } from "../../components/surface"
import { auth } from "../../remote"
import {
  selectCount,
  selectIsCountInvitePending,
  selectIsUserOrganiser,
} from "../count/countSliceSelectors"
import { selectIsOrgSetup, selectOrgName } from "../org/orgSliceSelectors"
import { SetupOrgPrompt } from "../org/setup"
import { codeSettings, sendEmailVerification } from "../user/userAuth"
import {
  selectIsProfileComplete,
  selectIsUserAdmin,
} from "../user/userSliceSelectors"
import { updateUserName } from "../user/userSliceUtils"
import { generateCustomNotification } from "./coreUtils"
import { routePaths } from "./pages"
/*




*/
export function Home() {
  const theme = useTheme()
  const location = useLocation()
  const count = useAppSelector(selectCount)
  console.log(count)

  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)

  const [isEmailVerified, setIsEmailVerified] = useState(true)

  const path = location.pathname

  useEffect(() => {
    const interval = setInterval(() => {
      onAuthStateChanged(getAuth(), (user) => {
        if (!!user) setIsEmailVerified(!!user.emailVerified)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary componentName={"Home"} featurePath={path}>
      <Fade>
        <Window bgcolor={theme.scale.gray[9]}>
          {!isEmailVerified ? (
            <VerifyEmailPrompt />
          ) : !isProfileComplete ? (
            <CompleteProfilePrompt />
          ) : !isOrgSetup ? (
            <SetupOrgPrompt />
          ) : (
            <HomeButtons />
          )}
        </Window>
      </Fade>
    </ErrorBoundary>
  )
}
/*




*/
export function VerifyEmailPrompt() {
  const theme = useTheme()
  const user = auth.currentUser

  function handleResend() {
    if (!!user)
      sendEmailVerification(user, codeSettings).then(() =>
        generateCustomNotification("success", "Email sent"),
      )
  }

  return (
    <Window
      gap={theme.module[6]}
      padding={theme.module[5]}
      justifyContent={"center"}
    >
      <Typography textAlign={"center"} color={theme.scale.gray[4]}>
        Verify your email using the link sent to you.
      </Typography>
      <Button
        variation={"pill"}
        onClick={handleResend}
        label={"Resend email"}
        outlineColor={theme.scale.gray[6]}
        sx={{ width: theme.module[10] }}
      />
    </Window>
  )
}
/*




*/
export function CompleteProfilePrompt() {
  const theme = useTheme()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  function handleClick() {
    updateUserName(firstName, lastName)
  }

  const isProfileDetailsComplete = !!firstName && !!lastName

  return (
    <Window
      justifyContent={"space-between"}
      maxWidth={theme.module[11]}
      padding={theme.module[5]}
      paddingTop={theme.module[6]}
    >
      <Window gap={theme.module[6]}>
        <Icon
          variation="profile"
          fontSize="large"
          color={theme.scale.blue[7]}
        />
        <Typography color={theme.scale.blue[7]} variant="h5">
          Complete your profile
        </Typography>
        <PromptInput
          placeholder={"Name"}
          value={_.capitalize(firstName)}
          onChange={setFirstName}
        />
        <PromptInput
          placeholder={"Surname"}
          value={_.capitalize(lastName)}
          onChange={setLastName}
        />
      </Window>
      <Button
        disabled={!isProfileDetailsComplete}
        variation={"profile"}
        label={"Complete"}
        iconName={"done"}
        iconColor={theme.scale.blue[6]}
        outlineColor={theme.scale.gray[6]}
        onClick={handleClick}
        justifyCenter
      />
    </Window>
  )
}
/*




*/
type PromptInputProps = {
  placeholder: string
  value: string
  onChange: Function
}
export function PromptInput(props: PromptInputProps) {
  const [placeholder, setPlacehoder] = useState(props.placeholder ?? "")

  const inputProps = {
    style: {
      textAlign: "center",
    },
  }
  const styles = {
    fontSize: "1.125rem",
    fontWeight: "medium",
    height: "3.5rem",
  }

  return (
    <Input
      value={props.value}
      placeholder={placeholder}
      onFocus={() => setPlacehoder("")}
      onBlur={() => setPlacehoder(props.placeholder ?? "")}
      inputProps={inputProps}
      sx={styles}
      onChange={(event: any) => props.onChange(event.target.value)}
    />
  )
}
/*




*/
type HomeButton = {
  label: string
  color?: string
  icon: IconNames
  iconColor?: string
  bgColor?: string
  outlineColor?: string
  showBadge?: boolean
  path: string
}
function HomeButtons() {
  const theme = useTheme()
  const navigate = useNavigate()

  const orgName = useAppSelector(selectOrgName)
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isOrganiser = useAppSelector(selectIsUserOrganiser)
  const isInvitePending = useAppSelector(selectIsCountInvitePending)

  const adminButtons: HomeButton[] = [
    {
      label: "Count",
      icon: "list",
      iconColor: theme.scale.blue[7],
      outlineColor: theme.scale.blue[8],
      bgColor: theme.scale.gray[9],
      path: routePaths.count.path,
      showBadge: isInvitePending && !isOrganiser,
    },
    {
      label: "Stock",
      icon: "stock",
      iconColor: theme.scale.green[7],
      outlineColor: theme.scale.green[8],
      bgColor: theme.scale.gray[9],
      path: routePaths.stock.path,
    },
    {
      label: "History",
      icon: "history",
      iconColor: theme.scale.yellow[7],
      outlineColor: theme.scale.yellow[8],
      bgColor: theme.scale.gray[9],
      path: routePaths.history.path,
    },
  ]
  const memberButtons = [adminButtons[0]]
  const buttons = isAdmin ? adminButtons : memberButtons

  return (
    <Window
      padding={theme.module[4]}
      paddingBottom={theme.module[0]}
      justifyContent={"flex-start"}
      gap={theme.module[2]}
    >
      <Slot>
        <Button
          data-test-id="home-org-button"
          variation="profile"
          label={orgName}
          iconName="org"
          bgColor={theme.scale.gray[8]}
          iconColor={theme.scale.gray[5]}
          color={theme.scale.gray[4]}
          outlineColor={theme.scale.gray[6]}
          iconSize="large"
          onClick={() => navigate(routePaths.org.path)}
          justifyCenter
        />
      </Slot>
      <Window justifyContent={"center"}>
        <Window
          justifyContent={"space-evenly"}
          maxHeight={"90%"}
          gap={theme.module[2]}
        >
          {buttons.map((button: HomeButton) => {
            return (
              <Button
                data-test-id={`home-${_.lowerCase(button.label)}-button`}
                key={button.label}
                variation={"home"}
                label={button.label}
                bgColor={button.bgColor}
                color={button.color}
                iconName={button.icon}
                iconColor={button.iconColor}
                outlineColor={button.outlineColor}
                showBadge={button.showBadge}
                onClick={() => navigate(button.path)}
              />
            )
          })}
        </Window>
      </Window>
    </Window>
  )
}
/*




*/
