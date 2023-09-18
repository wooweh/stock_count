import _ from "lodash"
import { describe, expect, expectTypeOf, it } from "vitest"
import {
  CountChecksProps,
  MembersProps,
} from "../organisation/organisationSlice"
import {
  CountCheckProps,
  CountCommentsProps,
  CountMemberProps,
  CountMembersProps,
  CountMetadataProps,
} from "./countSlice"
import {
  createCountChecksPayload,
  createCountMetadataPayload,
  prepareCountMembersPayload,
  updateCountMetadataPayload,
  updateCountMemberPayload,
  updateCountCommentsPayload,
} from "./countUtils"

describe("Count Members Utils", () => {
  const memberUuids = ["test-uuid1", "test-uuid2"]
  const userUuid = "test-uuid1"
  const members: MembersProps = {
    "test-uuid1": {
      uuid: "test-uuid1",
      name: "John",
      surname: "Doe",
      role: "admin",
    },
    "test-uuid2": {
      uuid: "test-uuid2",
      name: "Jane",
      surname: "Doe",
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
    expect(countMembers[userUuid].name).toEqual(members[userUuid].name)
    expectTypeOf(countMembers).toEqualTypeOf<CountMembersProps>()
  })
})

describe("Count Member Utils", () => {
  const memberUuid = "test-uuid"
  const path = "isCounting"
  const value = true
  const members: CountMembersProps = {
    [memberUuid]: {
      uuid: memberUuid,
      name: "John",
      surname: "Doe",
      isOrganiser: false,
      isCounter: false,
      isJoined: false,
      isCounting: false,
      step: "dashboard",
    },
  }
  it("should handle updateCountMemberPayload", () => {
    const member = members[memberUuid]
    const payload = {
      [path]: value,
    }
    const updatedMember = updateCountMemberPayload(member, payload)

    expect(updatedMember[path]).toEqual(value)
    expectTypeOf(updatedMember).toEqualTypeOf<CountMemberProps>()
  })
})

describe("Count Metadata Utils", () => {
  const type = "solo"
  const mockData: CountMetadataProps = {
    type: type,
    organiser: "test-uuid",
    counters: ["test-uuid"],
    prepStartTime: "test",
  }
  it("should handle createCountMetadataPayload", () => {
    const metadata = createCountMetadataPayload(mockData)
    expect(metadata.type).toEqual(type)
    expectTypeOf(metadata).toEqualTypeOf<CountMetadataProps>()
  })

  it("should handle updateCountMetadataPayload", () => {
    const mockTime = "test"
    const updatedMockData: Partial<CountMetadataProps> = {
      reviewStartTime: mockTime,
    }
    const metadata = updateCountMetadataPayload(mockData, updatedMockData)
    expect(metadata.reviewStartTime).toEqual(mockTime)
    expectTypeOf(metadata).toEqualTypeOf<CountMetadataProps>()
  })
})

describe("Count Check Utils", () => {
  const countChecks: CountChecksProps = {
    check1: "Check 1",
    check2: "Check 2",
    check3: "Check 3",
  }
  const satisfiedCheckUuids = ["check1", "check2"]
  it("should handle createCountChecksPayload", () => {
    const checks = createCountChecksPayload(countChecks, satisfiedCheckUuids)
    expect(checks.length).toEqual(3)
    expectTypeOf(checks).toEqualTypeOf<CountCheckProps[]>()
  })
})

describe("Count Comment Utils", () => {
  const countComments: CountCommentsProps = {
    preparation: ["preparation 1", "preparation 2"],
  }
  const mockPayload: Partial<CountCommentsProps> = {
    finalization: ["finalization 1", "finalization 2"],
  }
  it("should handle updateCountCommentsPayload", () => {
    const comments = updateCountCommentsPayload(countComments, mockPayload)
    expect(comments.finalization).toEqual(mockPayload.finalization)
    expectTypeOf(comments).toEqualTypeOf<CountCommentsProps>()
  })
})
