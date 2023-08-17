import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon from "../../components/icon"
import { routePaths, routes } from "./pages"
import { selectIsSystemBooted } from "./coreSlice"
import { Menu } from "./menu"
/*





*/
export function Bar() {
  const theme = useTheme()
  const location = useLocation()
  const isSystemBooted = useAppSelector(selectIsSystemBooted)
  const locationName = _.find(routes, { path: location.pathname })?.name
  const navigate = useNavigate()
  /*
  
  
  
  
  */
  function handleClick() {
    navigate(routePaths.home.path)
  }
  /*
  
  
  

  */
  return isSystemBooted ? (
    <Stack
      direction={"row"}
      position={"absolute"}
      top={0}
      width={"100%"}
      height={theme.module[6]}
      bgcolor={theme.scale.gray[9]}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingLeft={theme.module[3]}
      paddingRight={theme.module[3]}
      boxSizing={"border-box"}
    >
      <Stack>
        <Button
          variation={"pill"}
          onClick={handleClick}
          iconName={"home"}
        />
      </Stack>
      <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
        {locationName}
      </Typography>
      <Stack>
        <Menu />
      </Stack>
    </Stack>
  ) : undefined
}
