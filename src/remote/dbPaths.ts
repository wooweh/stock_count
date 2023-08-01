/*






*/
type OrgPathsReturnProps = {
  org: string
  invites: string
  invite: Function
  members: string
  member: (memberUuid: string) => MemberReturnProps
  name: string
  uuid: string
}
type MemberReturnProps = {
  member: string
  name: string
  surname: string
  role: string
  uuid: string
}
function orgPaths(orgUuid: string): OrgPathsReturnProps {
  const org = `organisations/${orgUuid}`
  const invites = `${org}/invites`
  const members = `${org}/members`
  const name = `${org}/name`
  const uuid = `${org}/uuid`
  /*
  
  
  */
  function invite(inviteUuid: string) {
    const invite = `${invites}/${inviteUuid}`
    return invite
  }
  /*
        
        
*/
  function member(memberUuid: string): MemberReturnProps {
    const member = `${members}/${memberUuid}`
    const name = `${member}/name`
    const surname = `${member}/surname`
    const role = `${member}/role`
    const uuid = `${member}/uuid`
    return {
      member: member,
      name: name,
      surname: surname,
      role: role,
      uuid: uuid,
    }
  }
  /*
        
        
        */
  return {
    org: org,
    invites: invites,
    invite: invite,
    members: members,
    member: member,
    name: name,
    uuid: uuid,
  }
}
/*






*/
type UserPathsReturnProps = {
  user: string
  name: string
  surname: string
  email: string
  uuid: string
  orgRole: string
  orgUuid: string
}
function userPaths(userUuid: string): UserPathsReturnProps {
  const user = `users/${userUuid}`
  const name = `${user}/name`
  const surname = `${user}/surname`
  const email = `${user}/email`
  const uuid = `${user}/uuid`
  const orgRole = `${user}/orgRole`
  const orgUuid = `${user}/orgUuid`

  return {
    user: user,
    name: name,
    surname: surname,
    email: email,
    uuid: uuid,
    orgRole: orgRole,
    orgUuid: orgUuid,
  }
}
/*






*/
type InvitePathsReturnProps = string
function invitePaths(inviteKey: string): InvitePathsReturnProps {
  return `invites/${inviteKey}`
}
/*






*/
// TODO: Count paths
type StockItemReturnProps = { item: string }
type StockPathsReturnProps = {
  stock: string
  stockItem: (stockId: string) => StockItemReturnProps
}

function stockPaths(orgUuid: string): StockPathsReturnProps {
  const stock = `stock/${orgUuid}`
  /*


*/
  function stockItem(stockId: string): StockItemReturnProps {
    const stockItem = `${stock}/${stockId}`
    return { item: stockItem }
  }
  /*


*/
  return {
    stock: stock,
    stockItem: stockItem,
  }
}
/*






*/
// TODO: History paths
/*






*/
// TODO: stock paths
/*






*/
type GetDBPathProps = {
  org: (orgUuid: string) => OrgPathsReturnProps
  user: (userUuid: string) => UserPathsReturnProps
  invite: (inviteKey: string) => InvitePathsReturnProps
  stock: (stockKey: string) => StockPathsReturnProps
}
export const getDBPath: GetDBPathProps = {
  org: orgPaths,
  user: userPaths,
  invite: invitePaths,
  stock: stockPaths,
}
/*






*/
