import { DataSnapshot } from "firebase/database"
import { UserProps } from "../user/userSlice"
import { updateUser } from "../user/userSliceUtils"
import { OrgProps } from "../org/orgSlice"
import { leaveOrg, updateMemberStatus, updateOrg } from "../org/orgSliceUtils"
import { StockProps } from "../stock/stockSlice"
import { updateStock } from "../stock/stockSliceUtils"
import {
  CountCheckProps,
  CountCommentsProps,
  CountItemProps,
  CountMembersProps,
  CountMetadataProps,
} from "../count/countSlice"
import {
  removeCount,
  removeCountResultsItem,
  updateCountChecks,
  updateCountComments,
  updateCountMembers,
  updateCountMetadata,
  updateCountResultItem,
} from "../count/countSliceUtils"
import { HistoryProps } from "../history/historySlice"
import { updateHistory } from "../history/historySliceUtils"

/*




*/
export function handleDBUserOnValue(snapshot: DataSnapshot) {
  const dbUser: UserProps = snapshot.val()
  if (!!dbUser) updateUser(dbUser)
}
/*




*/
export function handleDBOrgOnValue(
  snapshot: DataSnapshot,
  userUuid: string,
  userOrgUuid: string,
) {
  const dbOrg: OrgProps = snapshot.val()
  const isUserMember = !!dbOrg && !!dbOrg.members![userUuid]
  const shouldLeaveOrg = !isUserMember && !!userOrgUuid
  if (isUserMember) updateOrg(dbOrg)
  if (shouldLeaveOrg) leaveOrg()
}
/*




*/
export function handleDBStockOnValue(snapshot: DataSnapshot) {
  const dbStock: StockProps = snapshot.val()
  if (!!dbStock) {
    updateStock(dbStock)
  } else {
    updateStock({})
  }
}
/*




*/
export function handleDBCountMetadataOnValue(
  snapshot: DataSnapshot,
  userUuid: string,
  isOrganiser: boolean,
) {
  const dbCountMetadata: CountMetadataProps = snapshot.val()
  if (!!dbCountMetadata) {
    updateCountMetadata(dbCountMetadata)
    const isRemoved =
      !dbCountMetadata.counters.includes(userUuid) &&
      !(dbCountMetadata.organiser === userUuid)
    if (isRemoved) removeCount(false)
  } else if (!isOrganiser) removeCount(false)
}
/*




*/
export function handleDBCountChecksOnValue(snapshot: DataSnapshot) {
  const dbCountChecks: CountCheckProps[] = snapshot.val()
  if (!!dbCountChecks) updateCountChecks(dbCountChecks)
}
/*




*/
export function handleDBCountCommentsOnValue(snapshot: DataSnapshot) {
  const dbCountComments: CountCommentsProps = snapshot.val()
  if (!!dbCountComments) updateCountComments(dbCountComments)
}
/*




*/
export function handleDBCountMembersOnValue(snapshot: DataSnapshot) {
  const dbCountMembers: CountMembersProps = snapshot.val()
  if (!!dbCountMembers) updateCountMembers(dbCountMembers)
}
/*




*/
export function handleDBCountResultsOnChildChanged(
  snapshot: DataSnapshot,
  memberUuid: string,
) {
  const result: CountItemProps = snapshot.val()
  if (!!result) updateCountResultItem(result, memberUuid, false)
}
/*




*/
export function handleDBCountResultsOnChildRemoved(
  snapshot: DataSnapshot,
  memberUuid: string,
) {
  const result: CountItemProps = snapshot.val()
  if (!!result) removeCountResultsItem(result.id, memberUuid, false)
}
/*




*/
export function handleDBHistoryOnValue(snapshot: DataSnapshot) {
  const dbHistory: HistoryProps = snapshot.val()
  if (!!dbHistory) {
    updateHistory(dbHistory)
  } else {
    updateHistory({})
  }
}
/*




*/
