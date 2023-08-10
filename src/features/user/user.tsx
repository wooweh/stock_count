import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Control, ControlNames } from "../../components/control"
import Icon from "../../components/icon"
import Modal from "../../components/modal"
import { ProfileSurface } from "../../components/profileSurface"
import { generateNotification } from "../core/notifications"
import {
  PasswordValidationCheck,
  getPasswordValidation,
} from "./authentication"
import {
  changeUserPassword,
  deleteUser,
  selectIsPasswordChangeFailed,
  selectIsPasswordChangePending,
  selectIsPasswordChangeSuccess,
  selectUserEmail,
  selectUserName,
  selectUserSurname,
  setPasswordChangeStatus,
  setUserEmail,
  setUserFullName,
} from "./userSlice"
import { Loader } from "../../components/loader"
/*





*/
type UseUserState = {
  isEditing: boolean
  isDeleting: boolean
  isChangingPassword: boolean
  name: string
  surname: string
  email: string
}
type UseUserKeys = keyof UseUserState
const initialState: UseUserState = {
  isEditing: false,
  isDeleting: false,
  isChangingPassword: false,
  name: "",
  surname: "",
  email: "",
}
const useUserStore = create<UseUserState>()((set) => ({
  ...initialState,
}))

function setUseUser(path: UseUserKeys, value: boolean | string) {
  useUserStore.setState({ [path]: value })
}

export function resetUseUser() {
  useUserStore.setState(initialState)
}
/*





*/
export default function UserProfile() {
  return (
    <ProfileSurface>
      <ProfileFields />
      <ButtonTray />
      <ChangePassword />
      <DeleteProfileConfirmation />
    </ProfileSurface>
  )
}
/*





*/
function ProfileFields() {
  const theme = useTheme()
  const name = useAppSelector(selectUserName)
  const surname = useAppSelector(selectUserSurname)
  const email = useAppSelector(selectUserEmail)
  const isEditing = useUserStore((state: any) => state.isEditing)
  const editableName = useUserStore((state: any) => state.name)
  const editableSurname = useUserStore((state: any) => state.surname)
  const editableEmail = useUserStore((state: any) => state.email)

  useEffect(() => {
    if (name) setUseUser("name", name)
    if (surname) setUseUser("surname", surname)
    if (email) setUseUser("email", email)
  }, [isEditing, name, surname, email])

  const fields = [
    {
      label: "Name",
      value: editableName ? editableName : name,
      handleChange: (event: any) => setUseUser("name", event.target.value),
    },
    {
      label: "Surname",
      value: editableSurname ? editableSurname : surname,
      handleChange: (event: any) => setUseUser("surname", event.target.value),
    },
    {
      label: "Email",
      value: editableEmail ? editableEmail : email,
      handleChange: (event: any) => setUseUser("email", event.target.value),
    },
  ]

  return (
    <Stack gap={theme.module[5]}>
      {fields.map((field: any, index: number) => {
        return (
          <ProfileField
            label={field.label}
            value={field.value ?? ""}
            handleChange={field.handleChange}
            key={index}
          />
        )
      })}
    </Stack>
  )
}
/*





*/
type ProfileFieldProps = {
  label: string
  value: string
  handleChange: Function
}
function ProfileField(props: ProfileFieldProps) {
  const theme = useTheme()
  const isEditing = useUserStore((state: any) => state.isEditing)

  return (
    <Stack width={"100%"} alignItems={"flex-start"}>
      <Typography
        variant={"h6"}
        sx={{ color: theme.scale.gray[5], padding: theme.module[1] }}
      >
        {props.label}:
      </Typography>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={theme.module[3]}
      >
        <Control
          variation={"input"}
          value={props.value}
          placeholder={
            props.value === "" && !isEditing
              ? `Fill in your ${props.label.toLowerCase()}`
              : undefined
          }
          onChange={props.handleChange}
          disabled={isEditing ? false : true}
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            background: isEditing ? theme.scale.gray[8] : theme.scale.gray[9],
          }}
        />
      </Stack>
    </Stack>
  )
}
/*





*/
function ButtonTray() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isEditing = useUserStore((state: any) => state.isEditing)
  const name = useUserStore((state: any) => state.name)
  const surname = useUserStore((state: any) => state.surname)
  const newEmail = useUserStore((state: any) => state.email)
  const oldEmail = useAppSelector(selectUserEmail)
  /*
  
  
  */
  function handleEdit() {
    setUseUser("isEditing", true)
  }
  /*
  
  
  */
  function handleAccept() {
    if (!!name && !!surname && !!newEmail) {
      setUseUser("isEditing", false)
      dispatch(setUserFullName({ name: name, surname: surname }))
      if (newEmail !== oldEmail) dispatch(setUserEmail(newEmail))
    } else {
      generateNotification("incompleteProfileDetails")
    }
  }
  /*
  
  
  */
  function handleCancel() {
    setUseUser("isEditing", false)
  }
  /*
  
  
  */
  function handleDelete() {
    setUseUser("isDeleting", true)
  }
  /*
  
  
  */
  function handleResetPassword() {
    setUseUser("isChangingPassword", true)
  }
  /*
  
  
  */
  return (
    <Stack width={"100%"} gap={theme.module[5]}>
      {isEditing ? undefined : (
        <Button
          variation={"profile"}
          onClick={handleResetPassword}
          sx={{ background: "transparent", height: theme.module[7] }}
        >
          <Typography color={theme.scale.gray[5]}>Change Password</Typography>
        </Button>
      )}
      <Button
        variation={"profile"}
        onClick={isEditing ? handleAccept : handleEdit}
      >
        <Icon variation={isEditing ? "done" : "edit"} fontSize={"large"} />
      </Button>
      <Button
        variation={"profile"}
        onClick={isEditing ? handleCancel : handleDelete}
      >
        <Icon variation={isEditing ? "cancel" : "delete"} fontSize={"large"} />
      </Button>
    </Stack>
  )
}
/*





*/
function DeleteProfileConfirmation() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isDeleting = useUserStore((state: any) => state.isDeleting)
  const [password, setPassword] = useState("")
  /*
  
  
  */
  function handleAccept() {
    dispatch(deleteUser(password))
  }
  /*
  
  
  */
  function handleClose() {
    setUseUser("isDeleting", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={isDeleting}
      heading={"Delete Profile"}
      body={
        <Stack gap={theme.module[4]}>
          <Typography>Are you sure you want to delete your profile?</Typography>
          <Control
            variation="input"
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            type="password"
          />
        </Stack>
      }
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
function ChangePassword() {
  const dispatch = useAppDispatch()
  const isChangingPassword = useUserStore(
    (state: any) => state.isChangingPassword,
  )
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmedNewPassword, setConfiredNewPassword] = useState("")

  const isNewPasswordConfirmed =
    !!newPassword && newPassword === confirmedNewPassword
  const isNewPasswordUnique = newPassword !== password
  const isNewPasswordValid = getPasswordValidation(newPassword).isValid

  const isPasswordChangeSuccess = useAppSelector(selectIsPasswordChangeSuccess)
  const isPasswordChangeFailed = useAppSelector(selectIsPasswordChangeFailed)
  const isPasswordChangePending = useAppSelector(selectIsPasswordChangePending)

  useEffect(() => {
    if (isPasswordChangeSuccess) handleClose()
    if (isPasswordChangeFailed) {
      dispatch(setPasswordChangeStatus("notChanged"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPasswordChangeSuccess, isPasswordChangeFailed])
  /*
  
  
  */
  function handleAccept() {
    if (isNewPasswordValid && isNewPasswordConfirmed && isNewPasswordUnique) {
      dispatch(changeUserPassword({ password, newPassword }))
    } else if (!isNewPasswordConfirmed) {
      generateNotification("newPasswordNotConfirmed")
    } else if (!isNewPasswordUnique) {
      generateNotification("newPasswordNotUnique")
    } else if (!isNewPasswordValid) {
      generateNotification("newPasswordNotValid")
    }
  }
  /*
  
  
  */
  function handleClose() {
    setUseUser("isChangingPassword", false)
    setTimeout(() => {
      dispatch(setPasswordChangeStatus("notChanged"))
      setPassword("")
      setNewPassword("")
      setConfiredNewPassword("")
    }, 250)
  }
  /*
  
  
  */
  const inputs = [
    {
      variation: "input",
      placeholder: "Password",
      value: password,
      onChange: (event: any) => setPassword(event.target.value),
    },
    {
      variation: "input",
      placeholder: "New password",
      value: newPassword,
      onChange: (event: any) => setNewPassword(event.target.value),
    },
    {
      variation: "input",
      placeholder: "Confirm new password",
      value: confirmedNewPassword,
      onChange: (event: any) => setConfiredNewPassword(event.target.value),
    },
  ]

  return (
    <Modal
      open={isChangingPassword}
      heading={"Change Password"}
      body={
        <>
          <PasswordInputs
            inputs={inputs}
            isNewPasswordConfirmed={isNewPasswordConfirmed}
          />
          {isPasswordChangePending || isPasswordChangeSuccess ? (
            <Loader narration="Changing password..." />
          ) : undefined}
        </>
      }
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
function PasswordInputs({
  inputs,
  isNewPasswordConfirmed,
}: {
  inputs: any
  isNewPasswordConfirmed: boolean
}) {
  const theme = useTheme()
  const newPassword = inputs[1].value
  const validationReport = getPasswordValidation(newPassword)

  return (
    <Stack gap={theme.module[4]} padding={theme.module[4]}>
      {inputs.map((input: (typeof inputs)[number], index: number) => {
        const styles = {
          background: theme.scale.gray[8],
          outline:
            index === 2
              ? isNewPasswordConfirmed
                ? `2px solid ${theme.scale.green[6]}`
                : `2px solid ${theme.scale.red[6]}`
              : "",
        }
        return (
          <Control
            variation={input.variation as ControlNames}
            type={"password"}
            placeholder={input.placeholder}
            onChange={input.onChange}
            value={input.value}
            sx={{ ...styles }}
            key={index}
          />
        )
      })}
      <PasswordValidationCheck
        validationReport={validationReport}
        isActive={true}
      />
    </Stack>
  )
}
/*





*/
