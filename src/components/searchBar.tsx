import ClickAwayListener from "@mui/base/ClickAwayListener"
import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import useTheme from "../common/useTheme"
import Animation from "../components/animation"
import { Button } from "../components/button"
/*





*/
type SearchBarProps = {
  list: any[]
  searchKeys: string[]
  handleSelect: (item: any) => void
  formatResult: (item: any) => JSX.Element
  heading?: string
  isOpen?: boolean
  borderColor?: string
  placeholder?: string
}
export function SearchBar(props: SearchBarProps) {
  const theme = useTheme()
  const [isSearching, setIsSearching] = useState(props.isOpen ?? false)

  function handleIconClick() {
    setIsSearching(!isSearching)
  }

  function handleClickAway() {
    setIsSearching(props.isOpen ?? false)
  }

  function handleSelect(item: any) {
    props.handleSelect(item)
    setIsSearching(props.isOpen ?? false)
  }

  const searchProps = {
    ...props,
    isSearching,
    handleSelect,
    handleIconClick,
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        width={"100%"}
        height={`calc(${theme.module[6]} * 1.25)`}
        justifyContent={"center"}
      >
        <Stack
          width={"100%"}
          position={"relative"}
          alignItems={"flex-end"}
          justifyContent={"center"}
          zIndex={10}
        >
          <Heading heading={props.heading} />
          <Stack
            width={"100%"}
            height={`calc(${theme.module[6]} * 1.125)`}
            direction={"row"}
            boxSizing={"border-box"}
            position={"absolute"}
            justifyContent={"flex-end"}
            zIndex={10}
          >
            <Search {...searchProps} />
            <ToggleButton {...searchProps} />
          </Stack>
        </Stack>
      </Stack>
    </ClickAwayListener>
  )
}
/*





*/
function Heading({ heading }: { heading: string | undefined }) {
  const theme = useTheme()
  return (
    !!heading && (
      <Stack
        direction={"row"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        padding={`0 ${theme.module[2]}`}
        boxSizing={"border-box"}
      >
        <Typography
          variant="h6"
          fontWeight={"bold"}
          color={theme.scale.gray[5]}
        >
          {heading}
        </Typography>
      </Stack>
    )
  )
}
/*





*/
type SearchProps = SearchBarProps & {
  isSearching: boolean
  handleSelect: any
  handleIconClick: any
}
function Search(props: SearchProps) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      direction={"row"}
      boxSizing={"border-box"}
      justifyContent={"flex-end"}
    >
      <Animation
        from={{ width: "0%", opacity: 0 }}
        to={{ width: "100%", opacity: 1 }}
        duration={props.isOpen ? 0 : 125}
        start={props.isSearching}
        sx={{
          justifyContent: "flex-end",
        }}
      >
        {props.isSearching && (
          <Stack
            width={"100%"}
            padding={theme.module[0]}
            boxSizing={"border-box"}
            position={"absolute"}
            zIndex={10}
          >
            <ReactSearchAutocomplete
              items={props.list}
              onSelect={props.handleSelect}
              fuseOptions={{ threshold: 0.4, keys: props.searchKeys }}
              formatResult={props.formatResult}
              showClear={false}
              maxResults={7}
              placeholder={props.placeholder ?? ""}
              autoFocus
              styling={{
                border: `1px solid ${props.borderColor ?? theme.scale.gray[6]}`,
                backgroundColor: theme.scale.gray[7],
                color: theme.scale.gray[4],
                iconColor: theme.scale.gray[5],
                lineColor: theme.scale.gray[5],
                placeholderColor: theme.scale.gray[5],
              }}
            />
          </Stack>
        )}
      </Animation>
    </Stack>
  )
}
/*





*/
function ToggleButton(props: SearchProps) {
  const theme = useTheme()

  return (
    !props.isOpen && (
      <Stack
        width={"100%"}
        direction={"row"}
        justifyContent={"flex-end"}
        position={"absolute"}
        top={5}
        right={2}
        zIndex={10}
      >
        <Button
          variation={"pill"}
          iconName={props.isSearching ? "cancel" : "search"}
          onClick={props.handleIconClick}
          outlineColor={props.isSearching ? "none" : theme.scale.gray[7]}
          bgColor={theme.scale.gray[9]}
          iconSize={"small"}
          sx={{ padding: theme.module[3] }}
        />
      </Stack>
    )
  )
}
/*





*/
