import { ClickAwayListener, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import useTheme from "../common/useTheme"
import Animation from "../components/animation"
import { Button } from "../components/button"
import { ErrorBoundary } from "./errorBoundary"
import { Slot } from "./surface"
/*





*/
type SearchBarProps = {
  list: SearchListProps
  onSelect: (item: SearchItemProps) => void
  heading?: string
  isOpen?: boolean
  borderColor?: string
  placeholder?: string
}
export function SearchBar(props: SearchBarProps) {
  const theme = useTheme()
  const location = useLocation()

  const [isSearching, setIsSearching] = useState(props.isOpen ?? false)

  const path = location.pathname

  function handleIconClick() {
    setIsSearching(!isSearching)
  }

  function handleClickAway() {
    setIsSearching(props.isOpen ?? false)
  }

  function handleSelect(item: any) {
    props.onSelect(item)
    setIsSearching(props.isOpen ?? false)
  }

  const searchProps = {
    ...props,
    isSearching,
    onSelect: handleSelect,
    onIconClick: handleIconClick,
  }

  return (
    <ErrorBoundary componentName={"SearchBar"} featurePath={path}>
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
            <Slot
              height={`calc(${theme.module[6]} * 1.125)`}
              position={"absolute"}
              justifyContent={"flex-end"}
              zIndex={10}
            >
              <Search {...searchProps} />
              <ToggleButton {...searchProps} />
            </Slot>
          </Stack>
        </Stack>
      </ClickAwayListener>
    </ErrorBoundary>
  )
}
/*





*/
function Heading({ heading }: { heading: string | undefined }) {
  const theme = useTheme()
  return (
    !!heading && (
      <Slot justifyContent={"flex-start"} padding={`0 ${theme.module[2]}`}>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          color={theme.scale.gray[5]}
        >
          {heading}
        </Typography>
      </Slot>
    )
  )
}
/*





*/
type SearchProps = SearchBarProps & {
  isSearching: boolean
  onSelect: any
  onIconClick: any
}
export type SearchItemProps = {
  id: string
  name: string
  description: string
}
export type SearchListProps = SearchItemProps[]
function Search(props: SearchProps) {
  const theme = useTheme()

  function formatResult(item: SearchItemProps) {
    return (
      <Stack>
        <Typography>{item.name}</Typography>
        <Typography color={theme.scale.gray[5]}>{item.description}</Typography>
      </Stack>
    )
  }

  const searchKeys = ["name", "description"]

  return (
    <Slot justifyContent={"flex-end"}>
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
            paddingRight={theme.module[1]}
            boxSizing={"border-box"}
            position={"absolute"}
            zIndex={10}
          >
            <ReactSearchAutocomplete
              items={props.list}
              onSelect={props.onSelect}
              fuseOptions={{ threshold: 0.4, keys: searchKeys }}
              formatResult={formatResult}
              showClear={false}
              maxResults={7}
              placeholder={props.placeholder ?? ""}
              autoFocus
              styling={{
                border: `2px solid ${props.borderColor ?? theme.scale.gray[6]}`,
                backgroundColor: theme.scale.gray[7],
                hoverBackgroundColor: theme.scale.gray[6],
                color: theme.scale.gray[4],
                iconColor: theme.scale.gray[5],
                lineColor: theme.scale.gray[5],
                placeholderColor: theme.scale.gray[5],
              }}
            />
          </Stack>
        )}
      </Animation>
    </Slot>
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
        top={6}
        right={2}
        zIndex={10}
      >
        <Button
          variation={"pill"}
          iconName={props.isSearching ? "cancel" : "search"}
          onClick={props.onIconClick}
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
