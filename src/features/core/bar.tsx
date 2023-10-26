import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { selectIsUserCounting } from "../count/countSlice"
import { selectIsSystemBooted } from "./coreSlice"
import { Menu } from "./menu"
import { routePaths, routes } from "./pages"
import { getIsElementScrolling } from "../../common/utils"
/*




*/
export function Bar() {
  const theme = useTheme()

  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const isUserCounting = useAppSelector(selectIsUserCounting)

  const myElement = document.getElementById("pages_container")
  const isScrolling = getIsElementScrolling(myElement)
  console.log(isScrolling)

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

  return (
    <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
      Counting in Progress
    </Typography>
  )
}
/*




*/
