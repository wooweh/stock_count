import { get, ref, remove, set } from "firebase/database"
import { store } from "../../app/store"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  CountCheckProps,
  CountCommentsProps,
  CountMemberProps,
  CountMembersProps,
  CountMetadataProps,
  CountProps,
  CountResultsProps,
  DeleteCountItemProps,
  SetCountResultsItemProps,
} from "./countSlice"
/*





*/
export async function setCountMemberOnDB(payload: CountMemberProps) {
  const memberUuid = payload.uuid
  const orgUuid = store.getState().org.org.uuid
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
  const orgUuid = store.getState().org.org.uuid
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
export async function getCountFromDB() {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    return get(ref(dbReal, getDBPath.count(orgUuid).count))
      .then((snapshot) => {
        const count = snapshot.val()
        return count
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
/*





*/
export async function setCountOnDB(payload: CountProps) {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).count), payload).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setCountResultsOnDB(payload: CountResultsProps) {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).results), payload).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setCountResultsItemOnDB(
  payload: SetCountResultsItemProps,
) {
  const orgUuid = store.getState().org.org.uuid
  const memberUuid = payload.memberUuid
  const item = payload.item
  const stockId = item.id
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
  console.log(payload)
  const orgUuid = store.getState().org.org.uuid
  const memberUuid = payload.memberUuid
  const stockId = payload.id
  if (!!orgUuid && !!memberUuid && !!stockId) {
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
  const orgUuid = store.getState().org.org.uuid
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
  const orgUuid = store.getState().org.org.uuid
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
export async function setCountChecksOnDB(payload: CountCheckProps[]) {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).checks), payload).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function setCountCommentsOnDB(comments: CountCommentsProps) {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    set(ref(dbReal, getDBPath.count(orgUuid).comments), comments).catch(
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
