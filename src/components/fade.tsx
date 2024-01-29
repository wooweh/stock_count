import { Fade as MuiFade, Stack } from "@mui/material"
/*




*/
export function Fade({ children }: { children: any }) {
  return (
    <MuiFade appear in timeout={350}>
      <Stack
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {children}
      </Stack>
    </MuiFade>
  )
}
/*




*/
