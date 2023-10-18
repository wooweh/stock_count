import { PopoverOrigin, Stack } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiMenu from "@mui/material/Menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Switch } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { ListItem } from "../../components/listItem"
import { selectIsDarkmode } from "./coreSlice"
import { toggleDarkmode } from "./coreSliceUtils"
import { routePaths } from "./pages"
import { signOut } from "../user/userSliceUtils"
/*





*/
type MenuItemProps = {
  label: string
  iconName: IconNames
  onChange: () => void
}
export function Menu() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const isDarkmode = useAppSelector(selectIsDarkmode)

  const [anchorEl, setAnchorEl] = useState(null)

  function handleOpenMenu(e: any) {
    setAnchorEl(e.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSignOut() {
    setAnchorEl(null)
    signOut()
  }

  function handleMenuItemClick(path: string) {
    setAnchorEl(null)
    navigate(path)
  }

  const menuItems: MenuItemProps[] = [
    {
      label: "Darkmode",
      iconName: "colorTheme",
      onChange: () => toggleDarkmode(),
    },
    {
      label: "Organisation",
      iconName: "org",
      onChange: () => handleMenuItemClick(routePaths.organisation.path),
    },
    {
      label: "Profile",
      iconName: "profile",
      onChange: () => handleMenuItemClick(routePaths.profile.path),
    },
    {
      label: "Sign out",
      iconName: "signOut",
      onChange: handleSignOut,
    },
  ]
  const origin: PopoverOrigin = { vertical: "top", horizontal: "left" }
  const open = Boolean(anchorEl)
  const buttonStyles = {
    borderRadius: theme.module[5],
    padding: theme.module[2],
  }

  return (
    <>
      <ButtonBase disableRipple sx={buttonStyles} onClick={handleOpenMenu}>
        <Icon variation="menu" />
      </ButtonBase>
      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={origin}
        transformOrigin={origin}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: theme.module[3],
          },
        }}
      >
        <Stack
          width={"100%"}
          height={"100%"}
          padding={theme.module[2]}
          justifyContent={"flex-start"}
          gap={theme.module[3]}
          boxSizing={"border-box"}
        >
          {menuItems.map((item: MenuItemProps, index: number) => (
            <ListItem
              label={item.label}
              primarySlot={<Icon variation={item.iconName} />}
              secondarySlot={
                !index ? (
                  <Switch value={isDarkmode} onChange={item.onChange} />
                ) : undefined
              }
              bgColor={theme.scale.gray[!index ? 9 : 7]}
              onChange={item.onChange}
              tappable
              key={index}
            />
          ))}
        </Stack>
      </MuiMenu>
    </>
  )
}
