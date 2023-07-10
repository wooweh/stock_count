import { Global, css } from "@emotion/react"
import { useAppSelector } from "../app/hooks"
import useTheme from "./useTheme"
import { selectIsMobile } from "../features/core/coreSlice"

export default function GlobalStyles() {
  const theme = useTheme()
  const isMobile = useAppSelector(selectIsMobile)
  return (
    <Global
      styles={css`
        ::-webkit-scrollbar {
          height: 0;
          display: flex;
          flex-shrink: 0;
          width: ${isMobile
            ? theme.module[0]
            : theme.module[2]}; /* Remove scrollbar space */
          background: transparent; /* Optional: just make scrollbar invisible */
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme.scale.purple[6]};
        }
        .MuiSwitch-root {
          overflow: visible !important;
          height: ${theme.module[5]} !important;
          width: min-content !important;
          padding: 0 !important;
        }
        .Mui-checked {
          color: ${theme.scale.blue[5]} !important;
        }
        .MuiSwitch-switchBase {
          color: ${theme.scale.gray[9]};
          padding: 0 !important;
        }
        .MuiSwitch-thumb {
          margin: ${theme.module[0]} !important;
          height: calc(${theme.module[5]} - 2 * ${theme.module[0]}) !important;
          width: calc(${theme.module[5]} - 2 * ${theme.module[0]}) !important;
        }
        .MuiSwitch-track {
          background: ${theme.scale.gray[4]};
          width: calc(${theme.module[6]} + ${theme.module[0]}) !important;
          border-radius: ${theme.module[5]} !important;
        }
        .MuiSlider-root {
          color: ${theme.scale.blue[5]};
          box-sizing: border-box;
        }
        .MuiSlider-thumb {
          box-shadow: 1px 1px 3px -1px ${theme.scale.black} !important;
          border: none !important;
          &:focus &:hover &.Mui-active &.Mui-focusVisible {
            box-shadow: 1px 1px 3px -1px ${theme.scale.black} !important;
          }
          &:before {
            display: none !important;
          }
        }
        ,
        .MuiInputBase-root {
          background: ${theme.scale.gray[7]};
          color: ${theme.scale.gray[3]} !important;
          padding: ${theme.module[1]} ${theme.module[3]};
          border-radius: ${theme.module[2]};
        }
        .MuiInputBase-input {
          &.Mui-disabled {
            -webkit-text-fill-color: ${theme.scale.gray[3]} !important;
          }
        }
        .MuiMenu-paper {
          background: ${theme.scale.gray[7]} !important;
          border-radius: ${theme.module[3]} !important;
          box-sizing: border-box;
        }
        .MuiMenu-list {
          background: ${theme.scale.gray[7]};
          padding: 0 !important;
        }
        .MuiTypography-root {
          font-family: "Roboto", san-serif;
          color: ${theme.scale.gray[3]};
          margin: 0;
          padding: 0;
        }
        .gradient-text {
          background: linear-gradient(
            to right,
            ${theme.scale.purple[6]} 60%,
            ${theme.scale.blue[7]}
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-gray-3 {
          color: ${theme.scale.gray[3]};
        }
        .underline-text {
          font-weight: 900;
          color: ${theme.scale.gray[3]};
        }
        h2.MuiTypography-root {
          font-family: "Roboto", san-serif;
          font-weight: 900;
        }
        body1.MuiTypography-root {
          font-family: "Roboto", san-serif;
          font-weight: 700;
        }
        h4.MuiTypography-root {
          font-family: "Roboto", san-serif;
          font-weight: 400;
        }
        h5.MuiTypography-root {
          font-family: "Roboto", san-serif;
          font-weight: 900;
        }
        h3.MuiTypography-root {
          font-family: "Roboto", san-serif;
          font-weight: 900;
        }
        .MuiTypography-root.MuiLink-root {
          font-family: "Roboto", san-serif;
          font-weight: 500;
        }
        .MuiButtonBase-root {
          white-space: nowrap;
          &:focus {
            outline: none;
          }
        }
      `}
    />
  )
}