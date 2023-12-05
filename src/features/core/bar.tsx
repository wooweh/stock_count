import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useNetworkState } from "react-use"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon from "../../components/icon"
import { selectIsUserCounting } from "../count/countSliceSelectors"
import { selectIsSystemBooted } from "./coreSliceSelectors"
import { Menu } from "./menu"
import { routePaths, routes } from "./pages"
/*




*/
export function Bar() {
  const theme = useTheme()

  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const isUserCounting = useAppSelector(selectIsUserCounting)

  return (
    isSystemBooted && (
      <Stack
        direction={"row"}
        position={"fixed"}
        top={0}
        width={"100%"}
        height={theme.module[6]}
        bgcolor={theme.scale.gray[9]}
        justifyContent={isUserCounting ? "center" : "space-between"}
        alignItems={"center"}
        paddingLeft={theme.module[3]}
        paddingRight={theme.module[3]}
        boxShadow={theme.shadow.neo[4]}
        boxSizing={"border-box"}
        zIndex={1000}
      >
        {isUserCounting ? <CountBanner /> : <NavigationBar />}
      </Stack>
    )
  )
}
/*




*/
function NavigationBar() {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  function handleClick() {
    navigate(routePaths.home.path)
  }

  const locationName = _.find(routes, { path: location.pathname })?.name

  return (
    <>
      <Stack>
        <Button variation={"pill"} onClick={handleClick} iconName={"home"} />
      </Stack>
      <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
        {locationName}
      </Typography>
      <Stack>
        <Menu />
      </Stack>
    </>
  )
}
/*




*/
function CountBanner() {
  const theme = useTheme()
  const networkState = useNetworkState()
  const isWifi = networkState.type === "wifi"
  const isOnline = networkState.online
  const speed = networkState.downlink ?? 0
  const slow = speed < 1
  const medium = speed >= 1 && speed < 10
  const color = slow
    ? theme.scale.red[6]
    : medium
    ? theme.scale.orange[6]
    : theme.scale.green[6]
  const status = isOnline
    ? slow
      ? "Slow"
      : medium
      ? "Medium"
      : "Fast"
    : "Offline"

  const iconName = isWifi ? "wifi" : "cellular"

  return (
    <Stack
      width={"100%"}
      direction={"row"}
      justifyContent={"space-between"}
      padding={`0 ${theme.module[3]}`}
      alignItems={"center"}
      boxSizing={"border-box"}
      position={"relative"}
    >
      <Stack
        width={"100%"}
        alignItems={"center"}
        position={"absolute"}
        left={0}
        zIndex={10}
      >
        <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
          Counting...
        </Typography>
      </Stack>
      <Stack
        width={"100%"}
        direction={"row"}
        gap={theme.module[3]}
        alignItems={"center"}
        justifyContent={"flex-end"}
      >
        <Icon variation={iconName} color={color} fontSize="small" />
        <Typography
          fontWeight={"medium"}
          color={color}
          variant={"caption"}
          lineHeight={0}
        >
          {status}
        </Typography>
      </Stack>
    </Stack>
  )
}
/*




*/
