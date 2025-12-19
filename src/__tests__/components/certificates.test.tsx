import { render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom";

// Example component test for LMS certificate page
describe("Certificate Page", () => {
  it("should render without crashing", () => {
    // This is a placeholder test to verify Jest is working
    expect(true).toBe(true);
  });

  it("should have proper test setup", () => {
    // Verify environment variables are loaded
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
  });
});
