import TimeIcon from "@mui/icons-material/AccessTimeRounded"
import AddOrgIcon from "@mui/icons-material/AddBusinessRounded"
import AddIcon from "@mui/icons-material/AddRounded"
import AdminIcon from "@mui/icons-material/AdminPanelSettingsRounded"
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded"
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosRounded"
import DeclineIcon from "@mui/icons-material/BlockRounded"
import DamagedIcon from "@mui/icons-material/BrokenImageRounded"
import CalendarIcon from "@mui/icons-material/CalendarTodayRounded"
import CellularIcon from "@mui/icons-material/CellTowerRounded"
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
import RetryIcon from "@mui/icons-material/ReplayRounded"
import ObsoleteIcon from "@mui/icons-material/ScheduleRounded"
import SearchIcon from "@mui/icons-material/SearchRounded"
import UseableIcon from "@mui/icons-material/SellRounded"
import SettingsIcon from "@mui/icons-material/Settings"
import OrgIcon from "@mui/icons-material/StoreRounded"
import TransferIcon from "@mui/icons-material/SwapHorizRounded"
import TimelineIcon from "@mui/icons-material/TimelineRounded"
import UploadIcon from "@mui/icons-material/UploadRounded"
import ListIcon from "@mui/icons-material/ViewListRounded"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import KeyIcon from "@mui/icons-material/VpnKey"
import WarningIcon from "@mui/icons-material/WarningRounded"
import LightModeIcon from "@mui/icons-material/WbSunnyRounded"
import StockIcon from "@mui/icons-material/WidgetsRounded"
import WifiIcon from "@mui/icons-material/WifiRounded"
import EmailIcon from "@mui/icons-material/Email"
import CellphoneIcon from "@mui/icons-material/PhoneAndroid"
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
  | "retry"
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
  | "decline"
  | "obsolete"
  | "damaged"
  | "step"
  | "dual"
  | "cellular"
  | "wifi"
  | "date"
  | "time"
  | "clipboard"
  | "scrollToTop"
  | "comments"
  | "transfer"
  | "cellphone"
  | "email"

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
  const iconStyles = {
    ...styles,
    ...props.sx,
    color: props.color ? props.color : theme.scale.gray[4],
  }
  const fontSize = props.fontSize ? props.fontSize : "medium"
  const VARIATIONS = {
    settings: (
      <SettingsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    colorTheme: isDarkmode ? (
      <DarkModeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ) : (
      <LightModeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    home: (
      <HomeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    retry: (
      <RetryIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    decline: (
      <DeclineIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.red[5],
        }}
      />
    ),
    transfer: (
      <TransferIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    email: (
      <EmailIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    cellphone: (
      <CellphoneIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    stock: (
      <StockIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    menu: (
      <MenuIcon
        fontSize={props.fontSize ? props.fontSize : "medium"}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    add: (
      <AddIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    history: (
      <HistoryIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    timeline: (
      <TimelineIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    list: (
      <ListIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    cellular: (
      <CellularIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    profile: (
      <ProfileIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    signOut: (
      <SignOutIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    invite: (
      <InviteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    wifi: (
      <WifiIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    edit: (
      <EditIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    options: (
      <OptionsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    copy: (
      <CopyIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    key: (
      <KeyIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    admin: (
      <AdminIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    visible: (
      <VisibilityIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    notVisible: (
      <VisibilityOffIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    upload: (
      <UploadIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    search: (
      <SearchIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    backArrow: (
      <ArrowBackIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    org: (
      <OrgIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    group: (
      <GroupIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    download: (
      <DownloadIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    arrowRight: (
      <ArrowRightIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    arrowLeft: (
      <ArrowLeftIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    submit: (
      <SubmitIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    notification: (
      <NotificationIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    addMembers: (
      <AddMembersIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    obsolete: (
      <ObsoleteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    step: (
      <StepIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    dual: (
      <DualIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    date: (
      <CalendarIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    time: (
      <TimeIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    clipboard: (
      <ClipboardIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    checklist: (
      <ChecklistIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    comments: (
      <CommentsIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={iconStyles}
      />
    ),
    scrollToTop: (
      <ScrollToTopIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          transform: "rotate(90deg)",
        }}
      />
    ),
    useable: (
      <UseableIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.green[5],
        }}
      />
    ),
    damaged: (
      <DamagedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.red[5],
        }}
      />
    ),
    warning: (
      <WarningIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.orange[5],
        }}
      />
    ),
    joinGroup: (
      <GroupIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    addOrg: (
      <AddOrgIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    checked: (
      <CheckedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.blue[6],
        }}
      />
    ),
    unchecked: (
      <UncheckedIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.blue[8],
        }}
      />
    ),
    done: (
      <DoneIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.green[6],
        }}
      />
    ),
    cancel: (
      <ClearIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
    delete: (
      <DeleteIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
    leave: (
      <LeaveIcon
        fontSize={fontSize}
        fontWeight={props.fontWeight}
        sx={{
          ...iconStyles,
          color: props.color ? props.color : theme.scale.red[6],
        }}
      />
    ),
  }

  return VARIATIONS[props.variation as keyof typeof VARIATIONS]
}
