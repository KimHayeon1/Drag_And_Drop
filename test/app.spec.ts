import { test, expect } from "@playwright/test";

test("should add item to the list on button click", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const column = page.locator("#no-status");
  const addBtn = column.locator("button");

  const cnt = await column.locator("ul > li").count();
  await addBtn.click();

  await expect(column.locator("ul > li")).toHaveCount(cnt + 1);
});
