import AddIcon from "@mui/icons-material/AddRounded"
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined"
import GroupIcon from "@mui/icons-material/Diversity3Rounded"
import HistoryIcon from "@mui/icons-material/HistoryRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import SignOutIcon from "@mui/icons-material/LogoutRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import ProfileIcon from "@mui/icons-material/PersonRounded"
import SettingsIcon from "@mui/icons-material/Settings"
import TimelineIcon from "@mui/icons-material/TimelineRounded"
import ListIcon from "@mui/icons-material/ViewListRounded"
import LightModeIcon from "@mui/icons-material/WbSunnyRounded"
import StockIcon from "@mui/icons-material/WidgetsRounded"
import { useAppSelector } from "../app/hooks"
import { SxProps } from "../common/types"
import useTheme from "../common/useTheme"
import EditIcon from "@mui/icons-material/EditRounded"
import DoneIcon from "@mui/icons-material/DoneRounded"
import ClearIcon from "@mui/icons-material/ClearRounded"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
import LeaveIcon from "@mui/icons-material/MeetingRoomRounded"
import InviteIcon from "@mui/icons-material/EmailRounded"
import OptionsIcon from "@mui/icons-material/MoreVert"
import CopyIcon from "@mui/icons-material/ContentCopy"
import KeyIcon from "@mui/icons-material/VpnKey"
import AdminIcon from "@mui/icons-material/AdminPanelSettingsRounded"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { selectIsDarkmode } from "../features/core/coreSlice"
/*





*/
export type IconNames =
  | "settings"
  | "colorTheme"
  | "home"
  | "stock"
  | "menu"
  | "add"
  | "history"
  | "timeline"
  | "list"
  | "profile"
  | "signOut"
  | "group"
  | "edit"
  | "done"
  | "cancel"
  | "delete"
  | "leave"
  | "invite"
  | "options"
  | "copy"
  | "key"
  | "admin"
  | "visible"
  | "notVisible"

type IconProps = {
  variation: IconNames
  color?: string
  transition?: string
  fontSize?: "small" | "medium" | "large"
  sx?: SxProps
}
export default function Icon(props: IconProps) {
  const theme = useTheme()
  const isDarkmode = useAppSelector(selectIsDarkmode)
  const styles = {
    color: props.color ? props.color : theme.scale.gray[4],
    transition: props.transition ? props.transition : "none",
    ...props.sx,
  }
  const fontSize = props.fontSize ? props.fontSize : "medium"
  const VARIATIONS = {
    settings: <SettingsIcon fontSize={fontSize} sx={{ ...styles }} />,
    colorTheme: isDarkmode ? (
      <DarkModeIcon fontSize={fontSize} sx={{ ...styles }} />
    ) : (
      <LightModeIcon fontSize={fontSize} sx={{ ...styles }} />
    ),
    home: <HomeIcon fontSize={fontSize} sx={{ ...styles }} />,
    stock: <StockIcon fontSize={fontSize} sx={{ ...styles }} />,
    menu: (
      <MenuIcon
        fontSize={props.fontSize ? props.fontSize : "medium"}
        sx={{ ...styles }}
      />
    ),
    add: <AddIcon fontSize={fontSize} sx={{ ...styles }} />,
    history: <HistoryIcon fontSize={fontSize} sx={{ ...styles }} />,
    timeline: <TimelineIcon fontSize={fontSize} sx={{ ...styles }} />,
    list: <ListIcon fontSize={fontSize} sx={{ ...styles }} />,
    profile: <ProfileIcon fontSize={fontSize} sx={{ ...styles }} />,
    signOut: <SignOutIcon fontSize={fontSize} sx={{ ...styles }} />,
    group: <GroupIcon fontSize={fontSize} sx={{ ...styles }} />,
    invite: <InviteIcon fontSize={fontSize} sx={{ ...styles }} />,
    edit: <EditIcon fontSize={fontSize} sx={{ ...styles }} />,
    options: <OptionsIcon fontSize={fontSize} sx={{ ...styles }} />,
    copy: <CopyIcon fontSize={fontSize} sx={{ ...styles }} />,
    key: <KeyIcon fontSize={fontSize} sx={{ ...styles }} />,
    admin: <AdminIcon fontSize={fontSize} sx={{ ...styles }} />,
    visible: <VisibilityIcon fontSize={fontSize} sx={{ ...styles }} />,
    notVisible: <VisibilityOffIcon fontSize={fontSize} sx={{ ...styles }} />,
    done: (
      <DoneIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.green[6] }}
      />
    ),
    cancel: (
      <ClearIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.red[6] }}
      />
    ),
    delete: (
      <DeleteIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.red[6] }}
      />
    ),
    leave: (
      <LeaveIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.red[6] }}
      />
    ),
  }

  return VARIATIONS[props.variation as keyof typeof VARIATIONS]
}
