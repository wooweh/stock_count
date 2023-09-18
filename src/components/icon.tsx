import AddOrgIcon from "@mui/icons-material/AddBusinessRounded"
import AddIcon from "@mui/icons-material/AddRounded"
import AdminIcon from "@mui/icons-material/AdminPanelSettingsRounded"
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded"
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"
import CheckedIcon from "@mui/icons-material/CheckBoxRounded"
import ClearIcon from "@mui/icons-material/ClearRounded"
import CopyIcon from "@mui/icons-material/ContentCopy"
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
import GroupIcon from "@mui/icons-material/Diversity3Rounded"
import DoneIcon from "@mui/icons-material/DoneRounded"
import EditIcon from "@mui/icons-material/EditRounded"
import InviteIcon from "@mui/icons-material/EmailRounded"
import HistoryIcon from "@mui/icons-material/HistoryRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import SignOutIcon from "@mui/icons-material/LogoutRounded"
import LeaveIcon from "@mui/icons-material/MeetingRoomRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import OptionsIcon from "@mui/icons-material/MoreVert"
import ProfileIcon from "@mui/icons-material/PersonRounded"
import SearchIcon from "@mui/icons-material/SearchRounded"
import SettingsIcon from "@mui/icons-material/Settings"
import OrgIcon from "@mui/icons-material/StoreRounded"
import TimelineIcon from "@mui/icons-material/TimelineRounded"
import UploadIcon from "@mui/icons-material/UploadRounded"
import ListIcon from "@mui/icons-material/ViewListRounded"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import KeyIcon from "@mui/icons-material/VpnKey"
import LightModeIcon from "@mui/icons-material/WbSunnyRounded"
import StockIcon from "@mui/icons-material/WidgetsRounded"
import StepIcon from "@mui/icons-material/LocationOnRounded"
import DownloadIcon from "@mui/icons-material/DownloadRounded"
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosRounded"
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import SubmitIcon from "@mui/icons-material/Publish"
import NotificationIcon from "@mui/icons-material/NotificationsActive"
import AddMembersIcon from "@mui/icons-material/GroupAddRounded"
import WarningIcon from "@mui/icons-material/WarningRounded"
import ObsoleteIcon from "@mui/icons-material/ScheduleRounded"
import UseableIcon from "@mui/icons-material/SellRounded"
import DamagedIcon from "@mui/icons-material/BrokenImageRounded"
import DualIcon from "@mui/icons-material/GroupRounded"
import CalendarIcon from "@mui/icons-material/CalendarTodayRounded"
import TimeIcon from "@mui/icons-material/AccessTimeRounded"
import ClipboardIcon from "@mui/icons-material/ContentPasteRounded"
import ChecklistIcon from "@mui/icons-material/ChecklistRtlRounded"
import { useAppSelector } from "../app/hooks"
import { SxProps } from "../common/types"
import useTheme from "../common/useTheme"
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
  | "joinGroup"
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
  | "upload"
  | "download"
  | "search"
  | "backArrow"
  | "checked"
  | "unchecked"
  | "org"
  | "addOrg"
  | "arrowRight"
  | "arrowLeft"
  | "submit"
  | "notification"
  | "addMembers"
  | "warning"
  | "checklist"
  | "useable"
  | "obsolete"
  | "damaged"
  | "step"
  | "dual"
  | "date"
  | "time"
  | "clipboard"

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
    invite: <InviteIcon fontSize={fontSize} sx={{ ...styles }} />,
    edit: <EditIcon fontSize={fontSize} sx={{ ...styles }} />,
    options: <OptionsIcon fontSize={fontSize} sx={{ ...styles }} />,
    copy: <CopyIcon fontSize={fontSize} sx={{ ...styles }} />,
    key: <KeyIcon fontSize={fontSize} sx={{ ...styles }} />,
    admin: <AdminIcon fontSize={fontSize} sx={{ ...styles }} />,
    visible: <VisibilityIcon fontSize={fontSize} sx={{ ...styles }} />,
    notVisible: <VisibilityOffIcon fontSize={fontSize} sx={{ ...styles }} />,
    upload: <UploadIcon fontSize={fontSize} sx={{ ...styles }} />,
    search: <SearchIcon fontSize={fontSize} sx={{ ...styles }} />,
    backArrow: <ArrowBackIcon fontSize={fontSize} sx={{ ...styles }} />,
    org: <OrgIcon fontSize={fontSize} sx={{ ...styles }} />,
    group: <GroupIcon fontSize={fontSize} sx={{ ...styles }} />,
    download: <DownloadIcon fontSize={fontSize} sx={{ ...styles }} />,
    arrowRight: <ArrowRightIcon fontSize={fontSize} sx={{ ...styles }} />,
    arrowLeft: <ArrowLeftIcon fontSize={fontSize} sx={{ ...styles }} />,
    submit: <SubmitIcon fontSize={fontSize} sx={{ ...styles }} />,
    notification: <NotificationIcon fontSize={fontSize} sx={{ ...styles }} />,
    addMembers: <AddMembersIcon fontSize={fontSize} sx={{ ...styles }} />,
    obsolete: <ObsoleteIcon fontSize={fontSize} sx={{ ...styles }} />,
    step: <StepIcon fontSize={fontSize} sx={{ ...styles }} />,
    dual: <DualIcon fontSize={fontSize} sx={{ ...styles }} />,
    date: <CalendarIcon fontSize={fontSize} sx={{ ...styles }} />,
    time: <TimeIcon fontSize={fontSize} sx={{ ...styles }} />,
    clipboard: <ClipboardIcon fontSize={fontSize} sx={{ ...styles }} />,
    checklist: <ChecklistIcon fontSize={fontSize} sx={{ ...styles }} />,
    useable: (
      <UseableIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.green[5] }}
      />
    ),
    damaged: (
      <DamagedIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.red[5] }}
      />
    ),
    warning: (
      <WarningIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.orange[5] }}
      />
    ),
    joinGroup: (
      <GroupIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.green[6] }}
      />
    ),
    addOrg: (
      <AddOrgIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.green[6] }}
      />
    ),
    checked: (
      <CheckedIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.blue[6] }}
      />
    ),
    unchecked: (
      <UncheckedIcon
        fontSize={fontSize}
        sx={{ ...styles, color: theme.scale.blue[8] }}
      />
    ),
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
