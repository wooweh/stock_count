import { PopoverOrigin, Stack } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiMenu from "@mui/material/Menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import Icon from "../../components/icon"
import { List, ListFactory } from "../../components/list"
import { signOut } from "../user/userSlice"
import { selectIsDarkmode, toggleIsDarkmode } from "./coreSlice"
import { routePaths } from "./core"
/*





*/
export function Menu() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const isDarkmode = useAppSelector(selectIsDarkmode)
  /*
  
  
  
  
  */
  function handleOpenMenu(event: any) {
    setAnchorEl(event.currentTarget)
  }
  /*
  
  
  
  
  */
  function handleClose() {
    setAnchorEl(null)
  }
  /*
  
  
  
  
  */
  function handleSignOut() {
    setAnchorEl(null)
    dispatch(signOut())
  }
  /*
  
  
  
  
  */
  function handleMenuItemClick(path: string) {
    setAnchorEl(null)
    navigate(path)
  }
  /*
  
  
  
  
  */
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
      >
        <Stack
          width={"100%"}
          height={"100%"}
          padding={theme.module[2]}
          boxSizing={"border-box"}
        >
          <List>
            <ListFactory
              items={[
                {
                  label: "Darkmode",
                  iconName: "colorTheme",
                  controlName: "switch",
                  tappable: true,
                  value: isDarkmode,
                  onChange: () => dispatch(toggleIsDarkmode()),
                  hideBackground: false,
                },
                {
                  label: "Profile",
                  iconName: "profile",
                  tappable: true,
                  onChange: () => handleMenuItemClick(routePaths.profile.path),
                  hideBackground: true,
                },
                {
                  label: "Organisation",
                  iconName: "org",
                  tappable: true,
                  onChange: () =>
                    handleMenuItemClick(routePaths.organisation.path),
                  hideBackground: true,
                },
                {
                  label: "Sign out",
                  iconName: "signOut",
                  tappable: true,
                  onChange: handleSignOut,
                  hideBackground: true,
                },
              ]}
            />
          </List>
        </Stack>
      </MuiMenu>
    </>
  )
}
