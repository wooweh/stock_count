import { Divider, PopoverOrigin, Stack } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import MuiMenu from "@mui/material/Menu"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Switch } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon, { IconNames } from "../../components/icon"
import { ListItem } from "../../components/listItem"
import { Window } from "../../components/surface"
import { signOut } from "../user/userAuth"
import { selectIsDarkmode } from "./coreSliceSelectors"
import { toggleDarkmode } from "./coreSliceUtils"
import { routePaths } from "./pages"
/*




*/
type MenuItemProps = {
  id?: string
  label: string
  iconName: IconNames
  onChange: () => void
}
export function Menu() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const isDarkmode = useAppSelector(selectIsDarkmode)

  const [anchorEl, setAnchorEl] = useState(null)

  const path = location.pathname

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
      id: "menu-org-button",
      label: "Org",
      iconName: "org",
      onChange: () => handleMenuItemClick(routePaths.org.path),
    },
    {
      id: "menu-profile-button",
      label: "Profile",
      iconName: "profile",
      onChange: () => handleMenuItemClick(routePaths.profile.path),
    },
    {
      id: "menu-sign-out-button",
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
  const menuStyles = {
    "& .MuiPaper-root": {
      borderRadius: theme.module[3],
      outline: `2px solid ${theme.scale.gray[6]}`,
    },
  }

  return (
    <>
      <ButtonBase
        id="menu-button"
        disableRipple
        sx={buttonStyles}
        onClick={handleOpenMenu}
      >
        <Icon variation="menu" />
      </ButtonBase>
      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={origin}
        transformOrigin={origin}
        sx={menuStyles}
      >
        <Window padding={theme.module[2]} justifyContent={"flex-start"}>
          <ErrorBoundary componentName={"Menu"} featurePath={path}>
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
          </ErrorBoundary>
        </Window>
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
        id={props.item.id}
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
