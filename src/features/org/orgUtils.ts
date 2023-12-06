import { CountMemberProps, CountMembersProps } from "../count/countSlice"
import {
  HistoryItemMemberProps,
  HistoryItemMembersProps,
} from "../history/historySlice"
import { MemberProps, MembersProps } from "./orgSlice"

/*




*/
export function getInviteKeyValidation(key: string) {
  if (!!key && typeof key === "string" && key.length === 36) {
    return true
  } else {
    return false
  }
}
/*




*/
type NameMemberProps = MemberProps | CountMemberProps | HistoryItemMemberProps
export function getMemberShortName(member: NameMemberProps) {
  if (!!member) {
    const shortName = `${member.firstName[0]}. ${member.lastName}`
    return shortName
  } else {
    return ""
  }
}
/*




*/
type NameMembersProps =
  | MembersProps
  | CountMembersProps
  | HistoryItemMembersProps
export function getMembersShortNames(
  members: NameMembersProps,
  uuids: string[],
) {
  const shortNames = uuids.map(
    (uuid) => `${members[uuid].firstName[0]}. ${members[uuid].lastName}`,
  )
  return shortNames
}
/*




*/
export function getMemberName(member: NameMemberProps) {
  const name = `${member.firstName} ${member.lastName}`
  return name
}
/*




*/
