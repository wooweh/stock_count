// @ts-check
import { test, expect } from "@playwright/test"
import { fileURLToPath } from "url"
import * as path from "path"
import { dirname } from "path"

test("should handle sign in", async ({ page }) => {
  // In dev mode the user is signed in automatically
  await page.goto("/")

  // Expect "Home" text in bar to be visible once signed in
  await expect(page.getByText("Home")).toBeVisible()
})

test("should handle user and org profile changes", async ({ page }) => {
  await page.goto("/")

  // Navigate to user profile
  await page.locator("#menu-button").click()
  await page.locator("#menu-profile-button").click()

  // Change user name
  const userName = "John"
  await page.locator("#profile-edit-button").click()
  await expect(page.locator("#profile-name-input")).toBeEnabled()
  await page.locator("#profile-name-input").clear()
  await page.locator("#profile-name-input").fill(userName)
  await page.locator("#profile-edit-accept-button").click()
  await expect(page.locator("#profile-name-input")).toBeDisabled()
  await expect(page.locator("#profile-name-input")).toHaveValue(userName)

  // Navigate to org profile
  await page.locator("#menu-button").click()
  await page.locator("#menu-org-button").click()

  // Change org name
  const orgName = "Johns Shop"
  await page.locator("#org-edit-button").click()
  await expect(page.locator("#org-name-input")).toBeEnabled()
  await page.locator("#org-name-input").clear()
  await page.locator("#org-name-input").fill(orgName)
  await page.locator("#org-edit-accept-button").click()
  await expect(page.locator("#org-name-input")).toBeDisabled()
  await expect(page.locator("#org-name-input")).toHaveValue(orgName)
})

test("should handle stock upload and count", async ({ page }) => {
  await page.goto("/")

  // Navigate to stock list
  await page.locator("#home-stock-button").click()

  // Upload stock sheet
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const testFilePath = path.join(__dirname, "stock_upload_test.csv")

  await page.locator("#stock-upload-button").click()
  await page
    .locator("#stock-upload-choose-file-input")
    .setInputFiles(testFilePath)
  await expect(page.locator("#stock-upload-table")).toBeVisible()
  await page.locator("#stock-upload-accept-button").click()

  // Navigate to home
  await page.locator("#home-button").click()

  // Navigate to count
  await page.locator("#home-count-button").click()

  // Start new count
  await page.locator("#count-new-count-button").click()

  // Setup count
  await page.locator("#count-setup-choose-team-button").click()
  await page.locator("#count-setup-available-counters-john-laing").click()
  await page.locator("#count-setup-add-counters-accept-button").click()
  await page.locator("#count-preparation-button").click()
  await page.locator("#count-start-count-button").click()
  await page.locator("#count-start-confirmation-accept-button").click()

  // Conduct count of 1 item of stock
  await page.locator("#count-add-item-button").click()
  await page.getByPlaceholder("Search stock items").fill("stock")
  await page.getByText("Stock item 1").click()
  await page.locator("#count-item-useable-readonly-input").focus()
  await page.locator("#count-item-useable-editable-input").fill("5")
  await page.locator("#count-item-record-accept-button").click()

  // Review count
  await page.locator("#count-review-button").click()
  await expect(page.getByText("stock_01")).toBeVisible()

  // Finalise count
  await page.locator("#count-finalize-button").click()
  await page.locator("#count-finalize-accept-button").click()
  await page.locator("#count-finalize-submit-button").click()
  await page.locator("#count-finalize-submit-accept-button").click()

  await expect(page.locator("#count-new-count-button")).toBeVisible()
})

test("should handle history and results download", async ({ page }) => {
  await page.goto("/")

  // Navigate to history
  await page.locator("#home-history-button").click()

  // Select count to view
  await page.locator("#history-list-item-0").click()
  await page.getByTestId("VisibilityIcon").click()

  // Navigate to results and download results
  await page.locator("#history-count-review-results-button").click()
  const downloadPromise = page.waitForEvent("download")
  await page.locator("#history-count-review-results-download-button").click()
  const download = await downloadPromise
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const testFilePath = path.join(__dirname, download.suggestedFilename())
  await download.saveAs(testFilePath)
})
