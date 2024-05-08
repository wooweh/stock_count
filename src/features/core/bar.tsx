import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useNetworkState } from "react-use"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon from "../../components/icon"
import { Slot } from "../../components/surface"
import { selectIsUserCounting } from "../count/countSliceSelectors"
import { selectIsSystemBooted } from "./coreSliceSelectors"
import { getNetworkStateAttributes } from "./coreUtils"
import { Menu } from "./menu"
import { routePaths, routes } from "./pages"
/*




*/
export function Bar() {
  const theme = useTheme()
  const location = useLocation()

  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const isUserCounting = useAppSelector(selectIsUserCounting)

  const path = location.pathname

  return (
    isSystemBooted && (
      <ErrorBoundary componentName={"Bar"} featurePath={path}>
        <Slot
          position={"fixed"}
          top={0}
          height={theme.module[6]}
          bgcolor={theme.scale.gray[9]}
          justifyContent={isUserCounting ? "center" : "space-between"}
          paddingLeft={theme.module[3]}
          paddingRight={theme.module[3]}
          boxShadow={theme.shadow.neo[4]}
          zIndex={1000}
        >
          {isUserCounting ? <CountBanner /> : <NavigationBar />}
        </Slot>
      </ErrorBoundary>
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
      <Button
        id="home-button"
        variation={"pill"}
        onClick={handleClick}
        iconName={"home"}
      />
      <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
        {locationName}
      </Typography>
      <Menu />
    </>
  )
}
/*




*/
function CountBanner() {
  const theme = useTheme()
  const networkState = useNetworkState()

  const network = getNetworkStateAttributes(networkState)
  const color = theme.scale[network.statusColor as keyof typeof theme.scale][5]

  return (
    <Slot
      justifyContent={"space-between"}
      padding={`0 ${theme.module[3]}`}
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
      <Slot gap={theme.module[3]} justifyContent={"flex-end"}>
        <Icon variation={network.iconName} color={color} fontSize="small" />
        <Typography
          fontWeight={"medium"}
          color={color}
          variant={"caption"}
          lineHeight={0}
        >
          {network.status}
        </Typography>
      </Slot>
    </Slot>
  )
}
/*




*/
