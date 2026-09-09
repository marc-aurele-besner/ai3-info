import { expect, test } from "@playwright/test";
import {
  contributionShare,
  formatBytes,
  storageBytes,
} from "../src/utils/storage";

const reading = {
  blockHeight: 4321987,
  spacePledged: "2.40 PB",
  blockchainSize: "18.60 TB",
  spacePledgedBytes: "2400000000000000",
  blockchainSizeBytes: "18600000000000",
  updatedAt: new Date().toISOString(),
  cached: false,
};

test("storage calculations preserve decimal units and reject unavailable values", () => {
  expect(storageBytes(undefined, "2.40 PB")).toBe(2.4e15);
  expect(storageBytes("2400123456789000", "2.40 PB")).toBe(2400123456789000);
  expect(storageBytes(undefined, "Error fetching data")).toBeNull();
  expect(storageBytes(undefined, "1.0.0 TB")).toBeNull();
  expect(formatBytes(0)).toBe("0 B");
  expect(formatBytes(1e12)).toBe("1 TB");
  expect(contributionShare(100, 2.4e15)).toBe(4);
});

test("explore live readings, model controls, inspection, and contribution", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ json: reading }),
  );
  await page.goto("/space/mainnet");
  await expect(page.getByText("Live network", { exact: true })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("button", { name: "Pause rotation" }).click();
  await expect(
    page.getByRole("button", { name: "Resume rotation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Storage lab", exact: true }).click();
  await page.getByRole("button", { name: "Lattice", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Lattice", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Spread apart").fill("80");
  await page.getByRole("button", { name: "Inspect a cell" }).click();
  await expect(page.getByText("Cell 001", { exact: true })).toBeVisible();
  await expect(page.getByText(/Represents 19.2 TB/)).toBeVisible();
  await page.getByRole("button", { name: /Chain size/ }).click();
  await expect(page.getByText(/Represents 148.8 GB/)).toBeVisible();
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(page.getByLabel("Spread apart")).toHaveValue("15");
  await page.getByRole("button", { name: "100 TB", exact: true }).click();
  await expect(page.locator(".sandbox-result strong")).toHaveText("4%");
  await page.getByRole("button", { name: "Explore sample data" }).click();
  await expect(page.getByText("Sample data", { exact: true })).toBeVisible();
  await expect(page.getByText(/illustrative sample values/)).toBeVisible();
  expect(errors).toEqual([]);
});

test("failed refresh retains the last reading and retry recovers", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/data/**", (route) => {
    requests++;
    return requests === 2
      ? route.fulfill({ status: 503, json: {} })
      : route.fulfill({
          json: { ...reading, blockHeight: reading.blockHeight + requests },
        });
  });
  await page.goto("/space/mainnet");
  await expect(page.getByText("4,321,988", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Refresh network data" }).click();
  await expect(
    page.getByText("Last known reading", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("4,321,988", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry connection" }).click();
  await expect(page.getByText("4,321,990", { exact: true })).toBeVisible();
  await expect(page.getByText("Live network", { exact: true })).toBeVisible();
});

test("initial failure, sample mode, cached data, and route changes are honest", async ({
  page,
}) => {
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ status: 500, json: {} }),
  );
  await page.goto("/space/mainnet");
  await expect(
    page.getByText("Connection unavailable", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".sandbox-result strong")).toHaveText("—");
  await page.getByRole("button", { name: "Explore sample data" }).click();
  await expect(page.locator(".sandbox-result strong")).toHaveText("0.414938%");
  await page.unroute("**/api/data/**");
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ json: { ...reading, cached: true } }),
  );
  await page.getByRole("button", { name: "Return to live data" }).click();
  await expect(page.getByText("Cached reading", { exact: true })).toBeVisible();
  await page.getByLabel("You’re exploring").selectOption("taurus");
  await expect(page).toHaveURL(/\/space\/taurus$/);
  await expect(page.getByLabel("You’re exploring")).toHaveValue("taurus");
  await expect(page.getByText("Cached reading", { exact: true })).toBeVisible();
  const response = await page.goto("/space/not-a-network");
  expect(response?.status()).toBe(404);
});

test("mobile and reduced motion keep all controls usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ json: reading }),
  );
  await page.goto("/space/mainnet");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resume rotation" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Storage lab", exact: true }).click();
  await page.getByRole("button", { name: "Lattice", exact: true }).click();
  await page.getByRole("button", { name: "Inspect a cell" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Cell 001", { exact: true })).toBeVisible();
  await page.getByLabel("Your storage contribution").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByLabel("Your storage contribution")).toHaveValue("11");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("WebGL failure preserves the data and calculator", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ json: reading }),
  );
  await page.goto("/space/mainnet");
  await expect(page.getByText("Your observatory, in 2D.")).toBeVisible();
  await page.getByRole("button", { name: "100 TB", exact: true }).click();
  await expect(page.locator(".sandbox-result strong")).toHaveText("4%");
});

test("loads mainnet directly and preserves the original scene, branding, and footer", async ({
  page,
}) => {
  const assets = new Set<string>();
  page.on("response", (response) => {
    if (response.ok()) assets.add(new URL(response.url()).pathname);
  });
  await page.route("**/api/data/**", (route) =>
    route.fulfill({ json: reading }),
  );
  await page.goto("/");
  await expect(page).toHaveURL(/\/space\/mainnet$/);
  await expect(
    page.getByRole("button", { name: "Network space", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(
      () =>
        assets.has("/models/ring.glb") &&
        assets.has("/models/cube.glb") &&
        assets.has("/images/Autonomys.svg") &&
        assets.has("/fonts/GeistVF.woff"),
    )
    .toBe(true);
  await expect(page.getByText("Loading network models…")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Visit Marc-Aurèle on X (Twitter)" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Inspect a cell" }).click();
  await expect(page.getByText(/Represents 37.5 TB/)).toBeVisible();
  expect(
    await page
      .locator("body")
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe("rgb(0, 0, 0)");
});
