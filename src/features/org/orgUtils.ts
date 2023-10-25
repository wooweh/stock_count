import { CountMemberProps } from "../count/countSlice"
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
export function getMemberShortName(member: MemberProps | CountMemberProps) {
  const shortName = `${member.firstName[0]}. ${member.lastName}`
  return shortName
}
/*




*/
export function getMembersShortNames(members: MembersProps, uuids: string[]) {
  const shortNames = uuids.map(
    (uuid) => `${members[uuid].firstName[0]}. ${members[uuid].lastName}`,
  )
  return shortNames
}
/*




*/
export function getMemberName(member: MemberProps | CountMemberProps) {
  const name = `${member.firstName}. ${member.lastName}`
  return name
}
/*




*/
