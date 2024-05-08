import _ from "lodash"
import { describe, expect, expectTypeOf, it } from "vitest"
import { CountChecksProps, MembersProps } from "../org/orgSlice"
import countReducer, {
  CountCheckProps,
  CountCommentsProps,
  CountItemProps,
  CountMemberProps,
  CountMemberResultsProps,
  CountMembersProps,
  CountMetadataProps,
  CountResultsProps,
  CountState,
  DeleteCountItemProps,
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCount,
  setCountChecks,
  setCountComments,
  setCountMember,
  setCountMemberResults,
  setCountMembers,
  setCountMetaData,
  setCountResults,
  setCountResultsItem,
  setCountStep,
} from "./countSlice"
import {
  createCountChecksPayload,
  prepareCountMembersPayload,
  prepareFinalResults,
  prepareManagedCountMembers,
  prepareManagedCountResults,
} from "./countSliceUtils"
/*




*/
const PREP_START_TIME = 1698135256
const COUNT_START_TIME = PREP_START_TIME + 10 * 60
const REVIEW_START_TIME = COUNT_START_TIME + 10 * 60
const FINALIZE_START_TIME = REVIEW_START_TIME + 10 * 60
const FINAL_SUBMIT_TIME = FINALIZE_START_TIME + 10 * 60
/*




*/
describe("Count Reducer", () => {
  const initialState: CountState = {
    step: "dashboard",
    count: {},
  }

  const mockState: CountState = {
    step: "dashboard",
    count: {
      metadata: {
        type: "solo",
        prepStartTime: PREP_START_TIME,
        countStartTime: COUNT_START_TIME,
        reviewStartTime: REVIEW_START_TIME,
        finalSubmissionTime: FINAL_SUBMIT_TIME,
        isManaging: true,
        organiser: "mockUuid",
        counters: ["mockUuid"],
      },
      comments: {
        preparation: ["mockComment1", "mockComment2"],
        finalization: ["mockComment3", "mockComment4"],
      },
      results: {
        mockUuid: {
          mockStockId: {
            id: "mockStockId",
            name: "mockName",
            unit: "mockUnit",
            useableCount: 1,
            damagedCount: 2,
            obsoleteCount: 3,
          },
        },
      },
      members: {
        mockUuid: {
          uuid: "mockUuid",
          firstName: "mockName",
          lastName: "mockSurname",
          isOrganiser: true,
          isCounter: true,
          isCounting: true,
          isJoined: true,
          step: "dashboard",
        },
      },
    },
  }

  it("should handle initial state", () => {
    expect(countReducer(undefined, { type: "unknown" })).toEqual({
      ...initialState,
    })
  })

  it("should handle setCountStep", () => {
    const step = "setup"
    const actual = countReducer(
      initialState,
      setCountStep({ step, updateMember: false }),
    )
    expect(actual.step).toEqual(step)
  })

  it("should handle setCountMember", () => {
    const member: CountMemberProps = {
      uuid: "mockUuid",
      firstName: "mockName",
      lastName: "mockSurname",
      isCounter: false,
      isCounting: false,
      isJoined: false,
      isOrganiser: false,
      step: "dashboard",
    }
    const actual = countReducer(
      mockState,
      setCountMember({ member, updateDB: false }),
    )
    const members = actual.count.members as CountMembersProps
    expect(members[member.uuid]).toEqual(member)
  })

  it("should handle deleteCountMember", () => {
    const uuid = "mockUuid"
    const actual = countReducer(mockState, deleteCountMember({ uuid }))
    const members = actual.count.members as CountMembersProps
    expect(members["mockUuid"]).toEqual(undefined)
  })

  it("should handle setCountResultsItem", () => {
    const memberUuid = "mockUuid"
    const item: CountItemProps = {
      id: "mockStockId1",
      name: "mockName",
      unit: "mockUnit",
      useableCount: 1,
      damagedCount: 2,
      obsoleteCount: 3,
    }
    const updateDB = true
    const stockId = item.id
    const actual = countReducer(
      mockState,
      setCountResultsItem({ memberUuid, item, updateDB }),
    )
    const results = actual.count.results as CountResultsProps
    expect(results[memberUuid][stockId].useableCount).toEqual(1)
  })

  it("should handle deleteCountResultsItem", () => {
    const memberUuid = "mockUuid"
    const id = "mockStockId"
    const mockPayload: DeleteCountItemProps = {
      memberUuid,
      id,
      updateDB: true,
    }
    const actual = countReducer(mockState, deleteCountResultsItem(mockPayload))
    const results = actual.count.results as CountResultsProps
    expect(results[memberUuid][id]).toEqual(undefined)
  })

  it("should handle setCountMembers", () => {
    const uuid = "mockUuid1"
    const mockPayload: CountMembersProps = {
      mockUuid1: {
        uuid,
        firstName: "mockName",
        lastName: "mockSurname",
        isCounter: false,
        isCounting: false,
        isJoined: false,
        isOrganiser: false,
        step: "dashboard",
      },
    }
    const actual = countReducer(
      initialState,
      setCountMembers({ members: mockPayload, updateDB: false }),
    )
    const members = actual.count.members as CountMembersProps
    expect(members[uuid]).toEqual(mockPayload.mockUuid1)
  })

  it("should handle setCountMetaData", () => {
    const mockPayload: CountMetadataProps = {
      type: "dual",
      prepStartTime: PREP_START_TIME,
      countStartTime: COUNT_START_TIME,
      reviewStartTime: REVIEW_START_TIME,
      finalSubmissionTime: FINAL_SUBMIT_TIME,
      isManaging: false,
      organiser: "mockUuid",
      counters: ["mockUuid"],
    }
    const actual = countReducer(
      initialState,
      setCountMetaData({ metadata: mockPayload, updateDB: false }),
    )
    const metadata = actual.count.metadata as CountMetadataProps
    expect(metadata).toEqual(mockPayload)
  })

  it("should handle setCountChecks", () => {
    const checks: CountCheckProps[] = [
      { check: "mockCheck1", isChecked: true },
      { check: "mockCheck2", isChecked: false },
    ]
    const actual = countReducer(
      initialState,
      setCountChecks({ checks, updateDB: false }),
    )
    const countChecks = actual.count.checks as CountCheckProps[]
    expect(countChecks).toEqual(checks)
  })

  it("should handle setCountComments", () => {
    const comments: CountCommentsProps = {
      preparation: ["mockComment1", "mockComment2"],
      finalization: ["mockComment3", "mockComment4"],
    }
    const actual = countReducer(
      initialState,
      setCountComments({ comments, updateDB: false }),
    )
    const countComments = actual.count.comments as CountCommentsProps
    expect(countComments).toEqual(comments)
  })

  it("should handle setCountResults", () => {
    const mockResults = mockState.count.results as CountResultsProps
    const actual = countReducer(initialState, setCountResults(mockResults))
    const results = actual.count.results as CountResultsProps
    expect(results).toEqual(mockResults)
  })

  it("should handle setCountMemberResults", () => {
    const results = {
      mockStockId: {
        id: "mockStockId",
        name: "mockName",
        unit: "mockUnit",
        useableCount: 1,
        damagedCount: 2,
        obsoleteCount: 4,
      },
    }
    const memberUuid = "mockUuid"
    const actual = countReducer(
      mockState,
      setCountMemberResults({ memberUuid, results }),
    )
    const countResults = actual.count.results as CountResultsProps
    expect(countResults[memberUuid]).toEqual(results)
  })

  it("should handle setCount", () => {
    const mockPayload = { count: mockState.count, updateDB: true }
    const actual = countReducer(initialState, setCount(mockPayload))
    expect(actual.count).toEqual(mockPayload.count)
  })

  it("should handle deleteCount", () => {
    const actual = countReducer(mockState, deleteCount({ updateDB: true }))
    expect(actual.count).toEqual({})
  })
})
/*




*/
describe("Count SliceUtils", () => {
  const memberUuids = ["test-uuid1", "test-uuid2"]
  const userUuid = "test-uuid1"
  const members: MembersProps = {
    "test-uuid1": {
      uuid: "test-uuid1",
      firstName: "John",
      lastName: "Doe",
      role: "admin",
    },
    "test-uuid2": {
      uuid: "test-uuid2",
      firstName: "Jane",
      lastName: "Doe",
      role: "admin",
    },
  }

  it("should handle prepareCountMembersPayload", () => {
    const countMembers = prepareCountMembersPayload(
      memberUuids,
      userUuid,
      members,
    )

    expect(_.keys(countMembers)).toEqual(memberUuids)
    expect(countMembers[userUuid].firstName).toEqual(
      members[userUuid].firstName,
    )
    expectTypeOf(countMembers).toEqualTypeOf<CountMembersProps>()
  })

  it("should handle createCountChecksPayload", () => {
    const countChecks: CountChecksProps = {
      check1: "Check 1",
      check2: "Check 2",
      check3: "Check 3",
    }
    const satisfiedCheckUuids = ["check1", "check2"]
    const checks = createCountChecksPayload(countChecks, satisfiedCheckUuids)
    expect(checks.length).toEqual(3)
    expectTypeOf(checks).toEqualTypeOf<CountCheckProps[]>()
  })

  it("should handle prepareFinalResults", () => {
    const mockFinalResults: CountResultsProps = {
      mockCounterUuid1: {
        mockStockId1: {
          id: "mockStockId1",
          name: "mockName1",
          unit: "mockUnit1",
          useableCount: 2,
          damagedCount: 3,
          obsoleteCount: 4,
        },
      },
      mockCounterUuid2: {
        mockStockId2: {
          id: "mockStockId2",
          name: "mockName2",
          unit: "mockUnit2",
          useableCount: 2,
          damagedCount: 3,
          obsoleteCount: 4,
        },
      },
    }

    const finalResults = prepareFinalResults(mockFinalResults)
    expect(finalResults.mockStockId1).toEqual(
      mockFinalResults.mockCounterUuid1.mockStockId1,
    )
    expect(finalResults.mockStockId2).toEqual(
      mockFinalResults.mockCounterUuid2.mockStockId2,
    )
    expectTypeOf(finalResults).toEqualTypeOf<CountMemberResultsProps>()
  })

  it("should handle prepareManagedCountMembers", () => {
    const mockManagedCountMembers: CountMembersProps = {
      mockUuid1: {
        uuid: "mockUuid1",
        firstName: "mockName",
        lastName: "mockSurname",
        isCounter: false,
        isCounting: false,
        isJoined: false,
        isOrganiser: false,
        step: "dashboard",
      },
    }
    const mockOrgMembers: MembersProps = {
      mockUuid1: {
        uuid: "mockUuid1",
        firstName: "mockName",
        lastName: "mockSurname",
        role: "admin",
      },
      mockUuid2: {
        uuid: "mockUuid2",
        firstName: "mockName",
        lastName: "mockSurname",
        role: "admin",
      },
      mockUuid3: {
        uuid: "mockUuid3",
        firstName: "mockName",
        lastName: "mockSurname",
        role: "admin",
      },
    }
    const addedMembers = ["mockUuid2", "mockUuid3"]
    const removedMembers = ["mockUuid1"]
    const managedCountMembers = prepareManagedCountMembers(
      mockManagedCountMembers,
      mockOrgMembers,
      addedMembers,
      removedMembers,
    )
    expectTypeOf(managedCountMembers).toEqualTypeOf<CountMembersProps>()
    expect(managedCountMembers.mockUuid1).toEqual(undefined)
    expect(managedCountMembers.mockUuid2.uuid).toEqual(
      mockOrgMembers.mockUuid2.uuid,
    )
  })

  it("should handle prepareManagedCountResults", () => {
    const mockManagedCountResults: CountResultsProps = {
      mockUuid1: {
        mockStockId1: {
          id: "mockStockId1",
          name: "mockName1",
          unit: "mockUnit1",
          useableCount: 2,
          damagedCount: 3,
          obsoleteCount: 4,
        },
      },
      mockUuid2: {
        mockStockId2: {
          id: "mockStockId2",
          name: "mockName2",
          unit: "mockUnit2",
          useableCount: 2,
          damagedCount: 3,
          obsoleteCount: 4,
        },
      },
    }

    const addedMembers = ["mockUuid3"]
    const removedMembers = ["mockUuid1"]
    const transferredMembers = { mockUuid1: "mockUuid3" }

    const managedCountResults = prepareManagedCountResults(
      mockManagedCountResults,
      addedMembers,
      removedMembers,
      transferredMembers,
      false,
    )
    expectTypeOf(managedCountResults).toEqualTypeOf<CountResultsProps>()
    expect(managedCountResults.mockUuid1).toEqual(undefined)
    expect(managedCountResults.mockUuid2).toEqual(
      mockManagedCountResults.mockUuid2,
    )
    expect(managedCountResults.mockUuid3).toEqual(
      mockManagedCountResults.mockUuid1,
    )
  })
})
/*




*/
