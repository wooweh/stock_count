import { Divider, PopoverOrigin, Stack } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiMenu from "@mui/material/Menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Switch } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { ListItem } from "../../components/listItem"
import { signOut } from "../user/userAuth"
import { selectIsDarkmode } from "./coreSlice"
import { toggleDarkmode } from "./coreSliceUtils"
import { routePaths } from "./pages"
/*




*/
type MenuItemProps = {
  label: string
  iconName: IconNames
  onChange: () => void
}
export function Menu() {
  const theme = useTheme()
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
      label: "Org",
      iconName: "org",
      onChange: () => handleMenuItemClick(routePaths.org.path),
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
            outline: `2px solid ${theme.scale.gray[6]}`,
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
            <>
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
              {index !== menuItems.length - 1 && (
                <Divider
                  sx={{ width: "100%", borderColor: theme.scale.gray[6] }}
                />
              )}
            </>
          ))}
        </Stack>
      </MuiMenu>
    </>
  )
}
/*




*/
