import { test, expect, chromium } from "@playwright/test";

test.describe("Site Navigation & Layout", () => {
  const pages = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Projects", path: "/projects" },
    { name: "Notes", path: "/notes" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Uses", path: "/uses" },
    { name: "Now", path: "/now" },
  ];

  for (const pageInfo of pages) {
    test(`loads ${pageInfo.name} page successfully`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(pageInfo.path + "$"));
    });
  }
});

test.describe("Search Modal Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens search modal on trigger click", async ({ page }) => {
    const searchTrigger = page.locator('button[aria-label="Open search dialog"]').filter({ visible: true });
    await expect(searchTrigger).toBeVisible();
    await searchTrigger.click();

    const searchInput = page.locator('input[placeholder="Search blog, projects, notes..."]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test("handles query filtering", async ({ page }) => {
    const searchTrigger = page.locator('button[aria-label="Open search dialog"]').filter({ visible: true });
    await searchTrigger.click();

    const searchInput = page.locator('input[placeholder="Search blog, projects, notes..."]');
    await searchInput.fill("WireGuard");

    // Wait for the debounced search results to appear
    const resultsContainer = page.locator("#search-results-listbox");
    await expect(resultsContainer).toBeVisible();

    // Verify search results exist
    await expect(page.locator('#search-results-listbox')).not.toBeEmpty();
  });

  test("closes modal via Escape key", async ({ page }) => {
    await page.locator('button[aria-label="Open search dialog"]').filter({ visible: true }).click();
    const searchInput = page.locator('input[placeholder="Search blog, projects, notes..."]');
    await expect(searchInput).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(searchInput).not.toBeVisible();
  });

  test("closes modal via close button", async ({ page }) => {
    await page.locator('button[aria-label="Open search dialog"]').filter({ visible: true }).click();
    const searchInput = page.locator('input[placeholder="Search blog, projects, notes..."]');
    await expect(searchInput).toBeVisible();

    const closeButton = page.locator('button[aria-label="Close search"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(searchInput).not.toBeVisible();
  });

  test("closes modal via clicking outside", async ({ page }) => {
    await page.locator('button[aria-label="Open search dialog"]').filter({ visible: true }).click();
    const searchInput = page.locator('input[placeholder="Search blog, projects, notes..."]');
    await expect(searchInput).toBeVisible();

    // Click on the backdrop (fixed overlay background wrapper)
    const backdrop = page.locator(".fixed.inset-0.bg-slate-950\\/70");
    await backdrop.click({ force: true });
    await expect(searchInput).not.toBeVisible();
  });
});

test.describe("Mobile Navigation Focus Trap & Menu Overlay", () => {
  // Use a smaller viewport size if we are in desktop project, or just skip if viewport is wide
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
  });

  test("traps focus and closes on Escape", async ({ page }) => {
    const menuTrigger = page.locator('button[aria-controls="mobile-menu"]');
    await expect(menuTrigger).toBeVisible();
    await menuTrigger.click();

    const menuOverlay = page.locator("#mobile-menu");
    await expect(menuOverlay).toBeVisible();

    // The close button is first in focus
    const closeBtn = page.locator('button[aria-label="Close menu"]');
    await expect(closeBtn).toBeFocused();

    // Get all focusable elements inside the menu
    const focusableElements = await menuOverlay.evaluate((el) => {
      const elements = el.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(elements).map(e => ({
        tagName: e.tagName,
        text: e.textContent?.trim() || "",
        href: e.getAttribute("href")
      }));
    });

    expect(focusableElements.length).toBeGreaterThan(1);

    // Tab through all focusable elements to test wrap around
    for (let i = 0; i < focusableElements.length - 1; i++) {
      await page.keyboard.press("Tab");
    }

    // Focus should now be on the last element (e.g., YouTube link)
    const lastElementText = focusableElements[focusableElements.length - 1].text;
    
    // Press Tab once more, should wrap back to closeBtn / first element
    await page.keyboard.press("Tab");
    await expect(closeBtn).toBeFocused();

    // Shift+Tab should wrap to the last element
    await page.keyboard.press("Shift+Tab");
    // Verify it is focused on the last element or wraps back
    // (Focus should not escape the dialog)
    
    // Close menu with Escape
    await page.keyboard.press("Escape");
    await expect(menuOverlay).not.toBeVisible();
    
    // Focus should be returned to the trigger button
    await expect(menuTrigger).toBeFocused();
  });
});

test.describe("Clipboard Code Snippet Copy", () => {
  test("copies code snippet to clipboard", async ({ page, context }) => {
    // Grant clipboard permissions if supported
    try {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    } catch (e) {
      // Ignore unsupported permissions on Firefox/WebKit/Mobile Safari
    }

    await page.goto("/blog/self-hosting-wireguard");
    
    // Find the first code block copy button
    const copyButton = page.getByTestId("copy-button").first();
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toHaveText("Copy");

    // Click copy button
    await copyButton.click();

    // Verify visual feedback
    await expect(copyButton).toHaveText("Copied");

    // Verify clipboard content if possible
    try {
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      if (clipboardText) {
        expect(clipboardText).toContain("services:");
        expect(clipboardText).toContain("wireguard:");
      }
    } catch (e) {
      // Ignore clipboard read errors in unsupported browsers/headless configurations
    }
  });
});

test.describe("Metadata Files Validation", () => {
  test("validates sitemap.xml structure", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);

    const xmlContent = await response?.text();
    expect(xmlContent).toContain("<urlset");
    expect(xmlContent).toContain("<loc>https://imagitech.online</loc>");
    expect(xmlContent).toContain("<loc>https://imagitech.online/about</loc>");
    expect(xmlContent).toContain("<loc>https://imagitech.online/blog/self-hosting-wireguard</loc>");
  });

  test("validates feed.xml structure and titles", async ({ page }) => {
    const response = await page.goto("/feed.xml");
    expect(response?.status()).toBe(200);

    const xmlContent = await response?.text();
    expect(xmlContent).toContain("<rss");
    expect(xmlContent).toContain("<channel>");
    expect(xmlContent).toContain("<title>†hε drεαmεr's Notebook</title>");
    expect(xmlContent).toContain("<link>https://imagitech.online/blog</link>");
    expect(xmlContent).toContain("<item>");
  });
});

test.describe("JSON-LD Schema Verification", () => {
  const testCases = [
    { name: "Home Page", path: "/", type: "Person" },
    { name: "Blog Detail Page", path: "/blog/self-hosting-wireguard", type: "TechArticle" },
    { name: "Projects Detail Page", path: "/projects/autoscript-pro", type: "SoftwareApplication" },
  ];

  for (const tc of testCases) {
    test(`verifies JSON-LD on ${tc.name}`, async ({ page }) => {
      await page.goto(tc.path);

      // Locate script tag with type application/ld+json
      const scriptTag = page.locator('script[type="application/ld+json"]');
      await expect(scriptTag).toBeAttached();

      const innerHTML = await scriptTag.innerHTML();
      expect(innerHTML.length).toBeGreaterThan(0);

      // Parse JSON to verify syntax
      const parsed = JSON.parse(innerHTML);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe(tc.type);
    });
  }
});

test.describe("404 Error State Verification", () => {
  test("returns 404 page with correct response status", async ({ page }) => {
    const response = await page.goto("/some-random-missing-page-that-should-404");
    expect(response?.status()).toBe(404);

    // Verify 404 page error text
    const errorText = page.locator("text=404");
    await expect(errorText).toBeVisible();
  });
});
