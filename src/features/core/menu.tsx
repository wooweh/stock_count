import { Box, Divider, PopoverOrigin, Stack } from "@mui/material"
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
import { selectIsDarkmode } from "./coreSliceSelectors"
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
          boxSizing={"border-box"}
        >
          {menuItems.map((item: MenuItemProps, index: number) => (
            <MenuListitem
              item={item}
              control={
                !index ? (
                  <Switch value={isDarkmode} onChange={item.onChange} />
                ) : undefined
              }
              divider={index !== menuItems.length - 1}
              key={index}
            />
          ))}
        </Stack>
      </MuiMenu>
    </>
  )
}
/*




*/
type MenuListitemProps = {
  item: MenuItemProps
  control?: React.ReactElement
  divider?: boolean
}
function MenuListitem(props: MenuListitemProps) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={!props.divider ? "min-content" : theme.module[7]}
      justifyContent={"center"}
      gap={theme.module[2]}
    >
      <ListItem
        label={props.item.label}
        primarySlot={<Icon variation={props.item.iconName} />}
        secondarySlot={props.control}
        bgColor={theme.scale.gray[props.control ? 9 : 7]}
        onChange={props.item.onChange}
        tappable
      />
      {props.divider && (
        <Divider sx={{ width: "100%", borderColor: theme.scale.gray[6] }} />
      )}
    </Stack>
  )
}
/*




*/
