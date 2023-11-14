import TimeIcon from "@mui/icons-material/AccessTimeRounded"
import AddOrgIcon from "@mui/icons-material/AddBusinessRounded"
import AddIcon from "@mui/icons-material/AddRounded"
import AdminIcon from "@mui/icons-material/AdminPanelSettingsRounded"
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded"
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosRounded"
import DamagedIcon from "@mui/icons-material/BrokenImageRounded"
import CalendarIcon from "@mui/icons-material/CalendarTodayRounded"
import CommentsIcon from "@mui/icons-material/ChatRounded"
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"
import CheckedIcon from "@mui/icons-material/CheckBoxRounded"
import ChecklistIcon from "@mui/icons-material/ChecklistRtlRounded"
import ClearIcon from "@mui/icons-material/ClearRounded"
import CopyIcon from "@mui/icons-material/ContentCopy"
import ClipboardIcon from "@mui/icons-material/ContentPasteRounded"
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
import GroupIcon from "@mui/icons-material/Diversity3Rounded"
import DoneIcon from "@mui/icons-material/DoneRounded"
import DownloadIcon from "@mui/icons-material/DownloadRounded"
import EditIcon from "@mui/icons-material/EditRounded"
import InviteIcon from "@mui/icons-material/EmailRounded"
import ScrollToTopIcon from "@mui/icons-material/FirstPage"
import AddMembersIcon from "@mui/icons-material/GroupAddRounded"
import DualIcon from "@mui/icons-material/GroupRounded"
import HistoryIcon from "@mui/icons-material/HistoryRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import StepIcon from "@mui/icons-material/LocationOnRounded"
import SignOutIcon from "@mui/icons-material/LogoutRounded"
import LeaveIcon from "@mui/icons-material/MeetingRoomRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import OptionsIcon from "@mui/icons-material/MoreVert"
import NotificationIcon from "@mui/icons-material/NotificationsActive"
import ProfileIcon from "@mui/icons-material/PersonRounded"
import SubmitIcon from "@mui/icons-material/Publish"
import ObsoleteIcon from "@mui/icons-material/ScheduleRounded"
import SearchIcon from "@mui/icons-material/SearchRounded"
import UseableIcon from "@mui/icons-material/SellRounded"
import SettingsIcon from "@mui/icons-material/Settings"
import OrgIcon from "@mui/icons-material/StoreRounded"
import TimelineIcon from "@mui/icons-material/TimelineRounded"
import UploadIcon from "@mui/icons-material/UploadRounded"
import ListIcon from "@mui/icons-material/ViewListRounded"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import KeyIcon from "@mui/icons-material/VpnKey"
import WarningIcon from "@mui/icons-material/WarningRounded"
import LightModeIcon from "@mui/icons-material/WbSunnyRounded"
import StockIcon from "@mui/icons-material/WidgetsRounded"
import { useAppSelector } from "../app/hooks"
import useTheme from "../common/useTheme"
import { selectIsDarkmode } from "../features/core/coreSliceSelectors"
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
  | "scrollToTop"
  | "comments"

type IconProps = {
  variation: IconNames
  color?: string
  transition?: string
  fontSize?: "small" | "medium" | "large"
  fontWeight?: "normal" | "bold"
  sx?: any
}
export default function Icon(props: IconProps) {
  const theme = useTheme()
  const isDarkmode = useAppSelector(selectIsDarkmode)
  const styles = {
    color: theme.scale.gray[4],
    transition: props.transition ? props.transition : "none",
  }
  const fontSize = props.fontSize ? props.fontSize : "medium"
  const VARIATIONS = {
    settings: (
      <SettingsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    colorTheme: isDarkmode ? (
      <DarkModeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ) : (
      <LightModeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    home: (
      <HomeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    stock: (
      <StockIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    menu: (
      <MenuIcon
        fontSize={props.fontSize ? props.fontSize : "medium"}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    add: (
      <AddIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    history: (
      <HistoryIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    timeline: (
      <TimelineIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    list: (
      <ListIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    profile: (
      <ProfileIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    signOut: (
      <SignOutIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    invite: (
      <InviteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    edit: (
      <EditIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    options: (
      <OptionsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    copy: (
      <CopyIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    key: (
      <KeyIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    admin: (
      <AdminIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    visible: (
      <VisibilityIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    notVisible: (
      <VisibilityOffIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    upload: (
      <UploadIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    search: (
      <SearchIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    backArrow: (
      <ArrowBackIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    org: (
      <OrgIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    group: (
      <GroupIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    download: (
      <DownloadIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    arrowRight: (
      <ArrowRightIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    arrowLeft: (
      <ArrowLeftIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    submit: (
      <SubmitIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    notification: (
      <NotificationIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    addMembers: (
      <AddMembersIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    obsolete: (
      <ObsoleteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    step: (
      <StepIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    dual: (
      <DualIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    date: (
      <CalendarIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    time: (
      <TimeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    clipboard: (
      <ClipboardIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    checklist: (
      <ChecklistIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    comments: (
      <CommentsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
        }}
      />
    ),
    scrollToTop: (
      <ScrollToTopIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.gray[4],
          transform: "rotate(90deg)",
        }}
      />
    ),
    useable: (
      <UseableIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.green[5],
        }}
      />
    ),
    damaged: (
      <DamagedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.red[5],
        }}
      />
    ),
    warning: (
      <WarningIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.orange[5],
        }}
      />
    ),
    joinGroup: (
      <GroupIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    addOrg: (
      <AddOrgIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    checked: (
      <CheckedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.blue[6],
        }}
      />
    ),
    unchecked: (
      <UncheckedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.blue[8],
        }}
      />
    ),
    done: (
      <DoneIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    cancel: (
      <ClearIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
    delete: (
      <DeleteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
    leave: (
      <LeaveIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...styles,
          ...props.sx,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
  }

  return VARIATIONS[props.variation as keyof typeof VARIATIONS]
}
