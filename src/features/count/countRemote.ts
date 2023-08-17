import { ref, remove, set } from "firebase/database"
import _ from "lodash"
import { store } from "../../app/store"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  CountMemberProps,
  CountMembersProps,
  CountMetadataProps,
  DeleteCountItemProps,
  SetCountResultsItemProps,
} from "./countSlice"
/*





*/
export async function setCountMemberOnDB(payload: CountMemberProps) {
  const memberUuid = payload.uuid
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    set(
      ref(dbReal, getDBPath.count(orgUuid).member(memberUuid).member),
      payload,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteCountMemberOnDB(memberUuid: string) {
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    remove(
      ref(dbReal, getDBPath.count(orgUuid).member(memberUuid).member),
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setCountResultsItemOnDB(
  payload: SetCountResultsItemProps,
) {
  const orgUuid = store.getState().organisation.org.uuid
  const memberUuid = payload.memberUuid
  const stockId = payload.stockId
  const item = _.omit(payload, "memberUuid")
  if (orgUuid) {
    set(
      ref(
        dbReal,
        getDBPath.count(orgUuid).memberResults(memberUuid).resultsItem(stockId)
          .item,
      ),
      item,
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteCountResultsItemOnDB(
  payload: DeleteCountItemProps,
) {
  const orgUuid = store.getState().organisation.org.uuid
  const memberUuid = payload.memberUuid
  const stockId = payload.stockId
  if (orgUuid) {
    remove(
      ref(
        dbReal,
        getDBPath.count(orgUuid).memberResults(memberUuid).resultsItem(stockId)
          .item,
      ),
    ).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setCountMembersOnDB(payload: CountMembersProps) {
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).members), payload).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setCountMetaDataOnDB(payload: CountMetadataProps) {
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).metadata), payload).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setCountPrepCommentsOnDB(comments: string[]) {
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).prepComments), comments).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setCountFinalCommentsOnDB(comments: string[]) {
  const orgUuid = store.getState().organisation.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).finalComments), comments).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function deleteCountOnDB(orgUuid: string) {
  remove(ref(dbReal, getDBPath.count(orgUuid).count)).catch((error) => {
    console.log(error)
  })
}
/*





*/
