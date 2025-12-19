import { test, expect } from "@playwright/test";

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

test.describe("Authentication Flow", () => {
  test("should register a new user", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/register`);

    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "TestPassword123!");
    await page.fill('input[name="confirmPassword"]', "TestPassword123!");
    await page.fill('input[name="fullName"]', "Test User");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should login existing user", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=Welcome back")).toBeVisible();
  });

  test("should handle login errors", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});

test.describe("Course Browsing", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test("should display course catalog", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses`);

    await expect(page.locator('h1:has-text("Courses")')).toBeVisible();
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount({
      min: 1,
    });
  });

  test("should filter courses by category", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses`);

    await page.click('button:has-text("Programming")');
    await page.waitForTimeout(500); // Wait for filter

    const cards = page.locator('[data-testid="course-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test("should search courses", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses`);

    await page.fill('input[placeholder*="Search"]', "Python");
    await page.waitForTimeout(500);

    const results = page.locator('[data-testid="course-card"]');
    await expect(results.first()).toContainText(/python/i);
  });

  test("should view course details", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses`);

    await page.click('[data-testid="course-card"]:first-child');

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Enroll")).toBeVisible();
  });
});

test.describe("Course Enrollment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test("should enroll in free course", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses/1`); // Assuming course ID 1 is free

    await page.click('button:has-text("Enroll")');

    await expect(page.locator("text=Enrolled successfully")).toBeVisible();
    await expect(
      page.locator('button:has-text("Start Learning")'),
    ).toBeVisible();
  });

  test("should show enrollment in my courses", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/my-courses`);

    await expect(page.locator('[data-testid="enrolled-course"]')).toHaveCount({
      min: 1,
    });
  });
});

test.describe("Learning Experience", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test("should track lesson progress", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses/1/learn`);

    // Complete a lesson
    await page.click('button:has-text("Mark Complete")');

    await expect(page.locator("text=Progress updated")).toBeVisible();

    // Check progress bar updated
    const progressBar = page.locator('[role="progressbar"]');
    const ariaValue = await progressBar.getAttribute("aria-valuenow");
    expect(parseInt(ariaValue || "0")).toBeGreaterThan(0);
  });

  test("should take quiz", async ({ page }) => {
    await page.goto(`${BASE_URL}/lms/courses/1/quiz/1`);

    // Answer questions
    await page.click('input[type="radio"]:first-child');
    await page.click('button:has-text("Next")');

    await page.click('input[type="radio"]:first-child');
    await page.click('button:has-text("Submit")');

    await expect(page.locator("text=Quiz completed")).toBeVisible();
    await expect(page.locator("text=Score:")).toBeVisible();
  });

  test("should earn coins for lesson completion", async ({ page }) => {
    const initialCoins = await page
      .locator('[data-testid="coin-balance"]')
      .textContent();

    await page.goto(`${BASE_URL}/lms/courses/1/learn`);
    await page.click('button:has-text("Mark Complete")');

    await page.waitForTimeout(1000);

    const newCoins = await page
      .locator('[data-testid="coin-balance"]')
      .textContent();
    expect(parseInt(newCoins || "0")).toBeGreaterThan(
      parseInt(initialCoins || "0"),
    );
  });
});

test.describe("Gamification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test("should view achievements", async ({ page }) => {
    await page.goto(`${BASE_URL}/gamification/achievements`);

    await expect(page.locator('[data-testid="achievement-card"]')).toHaveCount({
      min: 1,
    });
  });

  test("should view leaderboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/gamification/leaderboard`);

    await expect(page.locator('[data-testid="leaderboard-entry"]')).toHaveCount(
      { min: 1 },
    );
  });

  test("should view challenges", async ({ page }) => {
    await page.goto(`${BASE_URL}/gamification/challenges`);

    await expect(page.locator("text=Daily Challenges")).toBeVisible();
    await expect(page.locator("text=Weekly Challenges")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have no accessibility violations on home page", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Basic accessibility checks
    await expect(page.locator("html")).toHaveAttribute("lang");
    await expect(page.locator("main")).toBeVisible();

    // All images should have alt text
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute("alt");
    }
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto(BASE_URL);

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT"]).toContain(focused);
  });
});

test.describe("Performance", () => {
  test("home page should load quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // Less than 3 seconds
  });

  test("should handle multiple rapid navigations", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', "student@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Rapid navigation
    for (let i = 0; i < 5; i++) {
      await page.goto(`${BASE_URL}/lms/courses`);
      await page.goto(`${BASE_URL}/dashboard`);
    }

    await expect(page.locator("h1")).toBeVisible();
  });
});
