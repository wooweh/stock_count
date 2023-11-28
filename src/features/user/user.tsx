import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import _ from "lodash"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { Loader } from "../../components/loader"
import Modal, { ModalActionProps } from "../../components/modal"
import { ProfileWrapper } from "../../components/surface"
import { generateNotification } from "../core/coreUtils"
import { PasswordValidationCheck } from "./authentication"
import { changeEmail, changePassword } from "./userAuth"
import {
  selectIsEmailChangePending,
  selectIsEmailChangeSuccess,
  selectIsPasswordChangePending,
  selectIsPasswordChangeSuccess,
  selectUserEmail,
  selectUserName,
} from "./userSliceSelectors"
import { removeUser, updateUserName } from "./userSliceUtils"
import { checkNewPassword, getPasswordValidation } from "./userUtils"
/*




*/
type UserUIState = {
  isEditing: boolean
  isDeleting: boolean
  isChangingPassword: boolean
  isChangingEmail: boolean
  name: string
  surname: string
  email: string
}
type UserUIKeys = keyof UserUIState
const initialState: UserUIState = {
  isEditing: false,
  isDeleting: false,
  isChangingPassword: false,
  isChangingEmail: false,
  name: "",
  surname: "",
  email: "",
}
const useUserUI = create<UserUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "user-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

function setUserUI(path: UserUIKeys, value: boolean | string) {
  useUserUI.setState({ [path]: value })
}

export function resetUserUI() {
  useUserUI.setState(initialState)
}
/*




*/
export function UserProfile() {
  return (
    <ProfileWrapper>
      <ProfileFields />
      <ButtonTray />
      <ChangePassword />
      <ChangeEmail />
      <DeleteProfileConfirmation />
    </ProfileWrapper>
  )
}
/*




*/
function ProfileFields() {
  const theme = useTheme()

  const name = useAppSelector(selectUserName)
  const email = useAppSelector(selectUserEmail)

  const isEditing = useUserUI((state: any) => state.isEditing)
  const editableName = useUserUI((state: any) => state.name)
  const editableSurname = useUserUI((state: any) => state.surname)
  const editableEmail = useUserUI((state: any) => state.email)

  useEffect(() => {
    if (name?.first) setUserUI("name", name.first)
    if (name?.last) setUserUI("surname", name.last)
    if (email && !editableEmail) setUserUI("email", email)
  }, [isEditing, name, email])

  const fields: ProfileFieldProps[] = [
    {
      label: "Name",
      value: isEditing ? editableName : name?.first,
      handleChange: (event: any) => setUserUI("name", event.target.value),
    },
    {
      label: "Surname",
      value: isEditing ? editableSurname : name?.last,
      handleChange: (event: any) => setUserUI("surname", event.target.value),
    },
    {
      label: "Email",
      value: isEditing ? editableEmail : email,
      handleChange: (event: any) => setUserUI("email", event.target.value),
    },
  ]

  return (
    <Stack gap={theme.module[5]}>
      {fields.map((field: ProfileFieldProps, index: number) => (
        <ProfileField
          label={field.label}
          value={field.value ?? ""}
          handleChange={field.handleChange}
          key={field.label}
        />
      ))}
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

  const isEditing = useUserUI((state: any) => state.isEditing)
  const placeholder =
    props.value === "" && !isEditing
      ? `Fill in your ${props.label.toLowerCase()}`
      : undefined

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
        <Input
          value={props.value}
          placeholder={placeholder}
          onChange={props.handleChange}
          disabled={isEditing ? false : true}
          sx={{
            fontSize: "1.125rem",
            fontWeight: "medium",
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

  const oldEmail = useAppSelector(selectUserEmail)

  const isEditing = useUserUI((state: any) => state.isEditing)
  const name = useUserUI((state: any) => state.name)
  const surname = useUserUI((state: any) => state.surname)
  const newEmail = useUserUI((state: any) => state.email)

  const isChangingEmail = !!newEmail && newEmail !== oldEmail
  const isProfileComplete = !!name && !!surname && !!oldEmail

  function handleEdit() {
    setUserUI("isEditing", true)
  }

  function handleAccept() {
    if (isProfileComplete) {
      updateUserName(name, surname)

      if (isChangingEmail) setUserUI("isChangingEmail", true)
    } else {
      generateNotification("incompleteProfileDetails")
    }
  }

  function handleCancel() {
    setUserUI("isEditing", false)
    setUserUI("name", "")
    setUserUI("surname", "")
  }

  function handleDelete() {
    setUserUI("isDeleting", true)
  }

  function handleResetPassword() {
    setUserUI("isChangingPassword", true)
  }

  return (
    <Stack width={"100%"} gap={theme.module[5]}>
      {!isEditing && (
        <Button
          variation={"profile"}
          label={"Change Password"}
          onClick={handleResetPassword}
          color={theme.scale.gray[5]}
          justifyCenter
        />
      )}
      <Button
        variation={"profile"}
        iconName={isEditing ? "done" : "edit"}
        onClick={isEditing ? handleAccept : handleEdit}
        justifyCenter
      />
      <Button
        variation={"profile"}
        iconName={isEditing ? "cancel" : "delete"}
        onClick={isEditing ? handleCancel : handleDelete}
        justifyCenter
      />
    </Stack>
  )
}
/*




*/
function DeleteProfileConfirmation() {
  const theme = useTheme()
  const isDeleting = useUserUI((state: any) => state.isDeleting)
  const [password, setPassword] = useState("")

  function handleAccept() {
    removeUser(password)
  }

  function handleClose() {
    setUserUI("isDeleting", false)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  return (
    <Modal
      open={isDeleting}
      heading={"Delete Profile"}
      body={
        <Stack gap={theme.module[4]}>
          <Typography>Are you sure you want to delete your profile?</Typography>
          <Input
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            isPassword
          />
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
function ChangeEmail() {
  const isEmailChangePending = useAppSelector(selectIsEmailChangePending)
  const isEmailChangeSuccess = useAppSelector(selectIsEmailChangeSuccess)
  const oldEmail = useAppSelector(selectUserEmail)

  const newEmail = useUserUI((state: any) => state.email)
  const isChangingEmail = useUserUI((state: any) => state.isChangingEmail)
  const [password, setPassword] = useState("")

  const isCredentialsComplete = !!newEmail && !!oldEmail && !!password

  useEffect(() => {
    if (isEmailChangeSuccess) handleClose()
  }, [isEmailChangeSuccess])

  function handleAccept() {
    if (isCredentialsComplete) {
      changeEmail(newEmail, oldEmail, password).then(() => handleClose())
    }
  }

  function handleClose() {
    setUserUI("isChangingEmail", false)
    setUserUI("isEditing", false)
    _.delay(() => setPassword(""), 250)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  return (
    <Modal
      open={isChangingEmail}
      heading={"Change Email"}
      body={
        <>
          <Input
            isPassword
            placeholder={"Password"}
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
          />
          {isEmailChangePending && <Loader narration="Changing email..." />}
        </>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
function ChangePassword() {
  const isPasswordChangeSuccess = useAppSelector(selectIsPasswordChangeSuccess)
  const isPasswordChangePending = useAppSelector(selectIsPasswordChangePending)

  const isChangingPassword = useUserUI((state: any) => state.isChangingPassword)

  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmedNewPassword, setConfiredNewPassword] = useState("")

  useEffect(() => {
    if (isPasswordChangeSuccess) handleClose()
  }, [isPasswordChangeSuccess])

  function handleAccept() {
    changePassword(password, newPassword, confirmedNewPassword)
  }

  function handleClose() {
    setUserUI("isChangingPassword", false)
    _.delay(resetInputs, 250)
  }

  function resetInputs() {
    setPassword("")
    setNewPassword("")
    setConfiredNewPassword("")
  }

  const inputs: PasswordInputsProps[] = [
    {
      placeholder: "Password",
      value: password,
      onChange: (event: any) => setPassword(event.target.value),
    },
    {
      placeholder: "New password",
      value: newPassword,
      onChange: (event: any) => setNewPassword(event.target.value),
    },
    {
      placeholder: "Confirm new password",
      value: confirmedNewPassword,
      onChange: (event: any) => setConfiredNewPassword(event.target.value),
    },
  ]

  const isNewPasswordConfirmed = checkNewPassword(
    password,
    newPassword,
    confirmedNewPassword,
  ).isConfirmed

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "done", handleClick: handleAccept },
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
          {isPasswordChangePending && (
            <Loader narration="Changing password..." />
          )}
        </>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
type PasswordInputsProps = {
  placeholder: string
  value: string
  onChange: (event: any) => void
}
function PasswordInputs({
  inputs,
  isNewPasswordConfirmed,
}: {
  inputs: PasswordInputsProps[]
  isNewPasswordConfirmed: boolean
}) {
  const theme = useTheme()

  const newPassword = inputs[1].value
  const validationReport = getPasswordValidation(newPassword)

  return (
    <Stack gap={theme.module[4]} padding={theme.module[4]}>
      {inputs.map((input: PasswordInputsProps, index: number) => {
        const styles = {
          background: theme.scale.gray[8],
          outline:
            index === 2 && input.value !== ""
              ? isNewPasswordConfirmed
                ? `2px solid ${theme.scale.green[6]}`
                : `2px solid ${theme.scale.red[6]}`
              : "",
        }

        return (
          <Input
            isPassword
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
