import { ButtonBase, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import Icon from "../../components/icon"
import { selectIsLoggedIn } from "../user/userSlice"
import { Menu } from "./menu"
import { routePaths, routes } from "./core"
import { Button } from "../../components/button"

/*





*/
export function Bar() {
  const theme = useTheme()
  const location = useLocation()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const locationName = _.find(routes, { path: location.pathname })?.name
  const navigate = useNavigate()
  /*
  
  
  
  
  */
  function handleClick() {
    navigate(routePaths.home.path)
  }
  /*
  
  
  

  */
  return isLoggedIn ? (
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
        <Button variation={"icon"} onClick={handleClick}>
          <Icon variation="home" />
        </Button>
      </Stack>
      <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
        {locationName}
      </Typography>
      <Stack>
        <Menu />
      </Stack>
    </Stack>
  ) : null
}
