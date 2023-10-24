import { child, get, ref, remove, set } from "firebase/database"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import { StockItemProps, StockProps } from "./stockSlice"
import { store } from "../../app/store"

/*





*/
export async function getStockFromDB(orgUuid: string) {
  return get(child(ref(dbReal), getDBPath.stock(orgUuid).stock))
    .then((snapshot) => {
      const stock = snapshot.val()
      return stock
    })
    .catch((error) => {
      console.error(error)
    })
}
/*





*/
export async function setStockItemOnDB(
  stockId: string,
  stockItem: StockItemProps,
) {
  const orgUuid = store.getState().org.org.uuid
  if (!!orgUuid) {
    set(
      ref(dbReal, getDBPath.stock(orgUuid).stockItem(stockId).item),
      stockItem,
    ).catch((error: any) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteStockItemOnDB(stockId: string) {
  const orgUuid = store.getState().org.org.uuid
  if (!!orgUuid) {
    remove(ref(dbReal, getDBPath.stock(orgUuid).stockItem(stockId).item)).catch(
      (error: any) => console.log(error),
    )
  }
}
/*





*/
export async function setStockOnDB(stock: StockProps) {
  const orgUuid = store.getState().org.org.uuid
  if (!!orgUuid) {
    set(ref(dbReal, getDBPath.stock(orgUuid).stock), stock).catch(
      (error: any) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function deleteStockOnDB(orgUuid: string) {
  if (!!orgUuid) {
    remove(ref(dbReal, getDBPath.stock(orgUuid).stock)).catch((error: any) =>
      console.log(error),
    )
  }
}
/*





*/
