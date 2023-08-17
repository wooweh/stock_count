/*






*/
type OrgPathsReturnProps = {
  org: string
  invites: string
  invite: (inviteUuid: string) => InviteReturnProps
  members: string
  member: (memberUuid: string) => MemberReturnProps
  name: string
  uuid: string
}
type InviteReturnProps = {
  invite: string
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
    return { invite }
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
      member,
      name,
      surname,
      role,
      uuid,
    }
  }
  /*
        
        
        */
  return {
    org,
    invites,
    invite,
    members,
    member,
    name,
    uuid,
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
    user,
    name,
    surname,
    email,
    uuid,
    orgRole,
    orgUuid,
  }
}
/*






*/
type InvitePathsReturnProps = { invite: string }
function invitePaths(inviteKey: string): InvitePathsReturnProps {
  const invite = `invites/${inviteKey}`
  return { invite }
}
/*






*/
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
    const item = `${stock}/${stockId}`
    return { item }
  }
  /*


*/
  return {
    stock,
    stockItem,
  }
}
/*






*/
// TODO: Count paths
type CountPathsReturnProps = {
  count: string
  metadata: string
  comments: string
  prepComments: string
  finalComments: string
  results: string
  memberResults: (memberUuid: string) => MemberResultsReturnProps
  members: string
  member: (memberUuid: string) => CountMemberReturnProps
}
type MemberResultsReturnProps = {
  results: string
  resultsItem: (stockId: string) => ResultsItemReturnProps
}
type ResultsItemReturnProps = StockItemReturnProps
type CountMemberReturnProps = { member: string }
function countPaths(orgUuid: string): CountPathsReturnProps {
  const count = `count/${orgUuid}`
  const metadata = `${count}/metadata`
  const comments = `${count}/comments`
  const prepComments = `${comments}/preparation`
  const finalComments = `${comments}/finalization`
  const results = `${count}/results`
  function memberResults(memberUuid: string): MemberResultsReturnProps {
    const memberResults = `${results}/${memberUuid}`
    return {
      results: memberResults,
      resultsItem: (stockId: string) => {
        const resultsItem = `${memberResults}/${stockId}`
        return { item: resultsItem }
      },
    }
  }
  const members = `${count}/members`
  function member(memberUuid: string) {
    const member = `${members}/${memberUuid}`
    return { member }
  }
  return {
    count: count,
    metadata: metadata,
    comments: comments,
    prepComments: prepComments,
    finalComments: finalComments,
    results: results,
    memberResults: memberResults,
    members: members,
    member: member,
  }
}
/*






*/
// TODO: History paths
/*






*/
type GetDBPathProps = {
  org: (orgUuid: string) => OrgPathsReturnProps
  user: (userUuid: string) => UserPathsReturnProps
  invite: (inviteKey: string) => InvitePathsReturnProps
  stock: (orgUuid: string) => StockPathsReturnProps
  count: (orgUuid: string) => CountPathsReturnProps
}
export const getDBPath: GetDBPathProps = {
  org: orgPaths,
  user: userPaths,
  invite: invitePaths,
  stock: stockPaths,
  count: countPaths,
}
/*






*/
