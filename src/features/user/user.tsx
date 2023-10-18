import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { Loader } from "../../components/loader"
import Modal from "../../components/modal"
import { ProfileSurface } from "../../components/profileSurface"
import { generateNotification } from "../core/coreUtils"
import {
  PasswordValidationCheck,
  getPasswordValidation,
} from "./authentication"
import {
  selectIsPasswordChangePending,
  selectIsPasswordChangeSuccess,
  selectUserEmail,
  selectUserName,
} from "./userSlice"
import { removeUser, updateUserEmail, updateUserName } from "./userSliceUtils"
import { changeUserPassword, checkUserNewPassword } from "./userUtils"
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
const useUserStore = create<UseUserState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "user-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

function setUseUser(path: UseUserKeys, value: boolean | string) {
  useUserStore.setState({ [path]: value })
}

export function resetUseUser() {
  useUserStore.setState(initialState)
}
/*





*/
export function UserProfile() {
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
  const email = useAppSelector(selectUserEmail)

  const isEditing = useUserStore((state: any) => state.isEditing)
  const editableName = useUserStore((state: any) => state.name)
  const editableSurname = useUserStore((state: any) => state.surname)
  const editableEmail = useUserStore((state: any) => state.email)

  useEffect(() => {
    if (name?.first) setUseUser("name", name.first)
    if (name?.last) setUseUser("surname", name.last)
    if (email) setUseUser("email", email)
  }, [isEditing, name, email])

  const fields = [
    {
      label: "Name",
      value: editableName ? editableName : name?.first,
      handleChange: (event: any) => setUseUser("name", event.target.value),
    },
    {
      label: "Surname",
      value: editableSurname ? editableSurname : name?.last,
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

  const oldEmail = useAppSelector(selectUserEmail)

  const isEditing = useUserStore((state: any) => state.isEditing)
  const name = useUserStore((state: any) => state.name)
  const surname = useUserStore((state: any) => state.surname)
  const newEmail = useUserStore((state: any) => state.email)
  /*
  
  
  */
  function handleEdit() {
    setUseUser("isEditing", true)
  }
  /*
  
  
  */
  function handleAccept() {
    if (!!name && !!surname) {
      setUseUser("isEditing", false)
      updateUserName(name, surname)
      if (!!newEmail && !!oldEmail) {
        updateUserEmail(newEmail, oldEmail)
      }
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
  const dispatch = useAppDispatch()

  const isDeleting = useUserStore((state: any) => state.isDeleting)

  const [password, setPassword] = useState("")
  /*
  
  
  */
  function handleAccept() {
    removeUser(password)
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
          <Input
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            isPassword
          />
        </Stack>
      }
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
  const isPasswordChangeSuccess = useAppSelector(selectIsPasswordChangeSuccess)
  const isPasswordChangePending = useAppSelector(selectIsPasswordChangePending)

  const isChangingPassword = useUserStore(
    (state: any) => state.isChangingPassword,
  )

  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmedNewPassword, setConfiredNewPassword] = useState("")

  const isNewPasswordConfirmed = checkUserNewPassword(
    password,
    newPassword,
    confirmedNewPassword,
  ).isConfirmed

  useEffect(() => {
    if (isPasswordChangeSuccess) handleClose()
  }, [isPasswordChangeSuccess])

  function handleAccept() {
    changeUserPassword(password, newPassword, confirmedNewPassword)
  }

  function handleClose() {
    setUseUser("isChangingPassword", false)
    setTimeout(() => {
      setPassword("")
      setNewPassword("")
      setConfiredNewPassword("")
    }, 250)
  }

  const inputs: InputsProps[] = [
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
          {isPasswordChangePending ||
            (isPasswordChangeSuccess && (
              <Loader narration="Changing password..." />
            ))}
        </>
      }
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
type InputsProps = {
  placeholder: string
  value: string
  onChange: (event: any) => void
}
function PasswordInputs({
  inputs,
  isNewPasswordConfirmed,
}: {
  inputs: InputsProps[]
  isNewPasswordConfirmed: boolean
}) {
  const theme = useTheme()

  const newPassword = inputs[1].value
  const validationReport = getPasswordValidation(newPassword)

  return (
    <Stack gap={theme.module[4]} padding={theme.module[4]}>
      {inputs.map((input: InputsProps, index: number) => {
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
