import { Typography } from "@mui/material"
import { Button } from "../../components/button"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import { useNavigate } from "react-router-dom"
import useTheme from "../../common/useTheme"
import Icon from "../../components/icon"
import { routePaths } from "./core"
/*





*/
export function Home() {
  const theme = useTheme()
  const navigate = useNavigate()

  const homeItems = [
    { label: "New Count", icon: "add", path: routePaths.newCount.path },
    { label: "Stock List", icon: "list", path: routePaths.stockList.path },
    { label: "History", icon: "history", path: routePaths.history.path },
    { label: "Analysis", icon: "timeline", path: routePaths.analysis.path },
  ]

  return (
    <Stack width={theme.module[10]}>
      <Grid container spacing={4}>
        {homeItems.map((item: any, index: number) => {
          /*
          
          
          */
          function handleClick() {
            navigate(item.path)
          }
          /*
          
          
          */
          return (
            <Grid width={"100%"} key={index}>
              <Button
                variation={"home"}
                onClick={handleClick}
                animationDuration={150}
              >
                <Stack
                  width={"100%"}
                  direction={"row"}
                  gap={theme.module[5]}
                  alignItems={"center"}
                  padding={theme.module[2]}
                  boxSizing={"border-box"}
                >
                  <Stack
                    bgcolor={theme.scale.gray[9]}
                    borderRadius={theme.module[2]}
                    padding={theme.module[5]}
                  >
                    <Icon
                      color={theme.scale.gray[5]}
                      variation={item.icon}
                      fontSize="large"
                    />
                  </Stack>
                  <Stack>
                    <Typography color={theme.scale.gray[5]} variant="h5">
                      {item.label}
                    </Typography>
                  </Stack>
                </Stack>
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
