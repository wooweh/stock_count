import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createContext, useContext, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Control } from "../../components/control"
import Icon from "../../components/icon"
import Modal from "../../components/modal"
import { ProfileSurface } from "../../components/profileSurface"
import {
  deleteUser,
  selectUser,
  setUserEmail,
  setUserName,
  setUserSurname,
} from "./userSlice"
/*





*/
type UserProfileContextProps = {
  isEditing?: boolean
  setIsEditing?: any
  isDeleting?: boolean
  setIsDeleting?: any
  isSubmitted?: boolean
  setIsSubmitted?: any
}
const UserProfileContext = createContext({})

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [context, setContext] = useState({
    isEditing: isEditing,
    setIsEditing: setIsEditing,
    isDeleting: isDeleting,
    setIsDeleting: setIsDeleting,
    isSubmitted: isSubmitted,
    setIsSubmitted: setIsSubmitted,
  })

  useEffect(() => {
    setContext({
      isEditing: isEditing,
      setIsEditing: setIsEditing,
      isDeleting: isDeleting,
      setIsDeleting: setIsDeleting,
      isSubmitted: isSubmitted,
      setIsSubmitted: setIsSubmitted,
    })
  }, [isEditing, isDeleting, isSubmitted])

  return (
    <ProfileSurface>
      <UserProfileContext.Provider value={context}>
        <ProfileItems />
        <ButtonTray />
        <DeleteProfileConfirmation />
      </UserProfileContext.Provider>
    </ProfileSurface>
  )
}
/*





*/
function ProfileItems() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const profileItems = [
    {
      label: "Name",
      value: user.name,
      onSubmit: (name: string) => dispatch(setUserName(name)),
    },
    {
      label: "Surname",
      value: user.surname,
      onSubmit: (surname: string) => dispatch(setUserSurname(surname)),
    },
    {
      label: "Email",
      value: user.email,
      onSubmit: (email: string) => dispatch(setUserEmail(email)),
    },
  ]

  return (
    <Stack gap={theme.module[5]}>
      {profileItems.map((item: any, index: number) => {
        return (
          <ProfileItem
            label={item.label}
            value={item.value ?? ""}
            onSubmit={item.onSubmit}
            key={index}
          />
        )
      })}
    </Stack>
  )
}
/*





*/
type ProfileItemProps = {
  label: string
  value: string
  onSubmit: Function
}
function ProfileItem(props: ProfileItemProps) {
  const theme = useTheme()
  const [value, setValue] = useState(props.value)
  const context: UserProfileContextProps = useContext(UserProfileContext)

  useEffect(() => {
    if (context.isSubmitted) {
      props.onSubmit(value)
      context.setIsSubmitted(false)
    }
    if (!context.isEditing) {
      setValue(props.value)
    }
  }, [props, context, value])
  /*
  
  
  */
  function handleChange(event: any) {
    setValue(event.target.value)
  }
  /*
  
  
  */
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
          value={value}
          placeholder={
            value === ""
              ? `Fill in your ${props.label.toLowerCase()}`
              : undefined
          }
          onChange={handleChange}
          disabled={context.isEditing ? false : true}
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            background: context.isEditing
              ? theme.scale.gray[8]
              : theme.scale.gray[9],
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
  const context: UserProfileContextProps = useContext(UserProfileContext)
  /*
  
  
  */
  function handleEdit() {
    context.setIsEditing(true)
  }
  /*
  
  
  */
  function handleAccept() {
    context.setIsSubmitted(true)
    context.setIsEditing(false)
  }
  /*
  
  
  */
  function handleCancel() {
    context.setIsEditing(false)
  }
  /*
  
  
  */
  function handleDelete() {
    context.setIsDeleting(true)
  }
  /*
  
  
  */
  return (
    <Stack width={"100%"} paddingTop={theme.module[6]} gap={theme.module[5]}>
      <Button
        variation={"profile"}
        onClick={context.isEditing ? handleAccept : handleEdit}
      >
        <Icon
          variation={context.isEditing ? "done" : "edit"}
          fontSize={"large"}
        />
      </Button>
      <Button
        variation={"profile"}
        onClick={context.isEditing ? handleCancel : handleDelete}
      >
        <Icon
          variation={context.isEditing ? "cancel" : "delete"}
          fontSize={"large"}
        />
      </Button>
    </Stack>
  )
}
/*





*/
function DeleteProfileConfirmation() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const context: UserProfileContextProps = useContext(UserProfileContext)
  /*
  
  
  */
  function handleAccept() {
    dispatch(deleteUser())
    context.setIsDeleting(false)
  }
  /*
  
  
  */
  function handleCancel() {
    context.setIsDeleting(false)
  }
  /*
  
  
  */
  function handleClose() {
    context.setIsDeleting(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isDeleting as boolean}
      heading={"Delete Profile"}
      body={
        <Typography>Are you sure you want to delete your profile?</Typography>
      }
      footer={
        <Stack direction={"row"} gap={theme.module[4]} width={"100%"}>
          <Button variation={"modal"} onClick={handleCancel}>
            <Icon variation={"cancel"} />
          </Button>
          <Button variation={"modal"} onClick={handleAccept}>
            <Icon variation={"done"} />
          </Button>
        </Stack>
      }
      onClose={handleClose}
    />
  )
}
/*





*/
