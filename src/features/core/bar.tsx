import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { selectIsUserCounting } from "../count/countSlice"
import { selectIsSystemBooted } from "./coreSlice"
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
        position={"absolute"}
        top={0}
        width={"100%"}
        height={theme.module[6]}
        bgcolor={theme.scale.gray[9]}
        justifyContent={isUserCounting ? "center" : "space-between"}
        alignItems={"center"}
        paddingLeft={theme.module[3]}
        paddingRight={theme.module[3]}
        boxSizing={"border-box"}
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
  const dispatch = useAppDispatch()
  const location = useLocation()
  const locationName = _.find(routes, { path: location.pathname })?.name
  const navigate = useNavigate()

  function handleClick() {
    navigate(routePaths.home.path)
    // dispatch(deleteCount())
  }

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

  return (
    <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
      Counting in Progress
    </Typography>
  )
}
/*





*/
