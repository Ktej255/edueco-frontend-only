import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingSkeleton } from "../LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders card variant correctly", () => {
    render(<LoadingSkeleton variant="card" count={1} />);
    const skeleton =
      screen.getByTestId("loading-skeleton") ||
      document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders multiple skeletons when count is specified", () => {
    const { container } = render(<LoadingSkeleton variant="list" count={3} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("applies custom className", () => {
    const { container } = render(
      <LoadingSkeleton variant="text" className="custom-class" />,
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("renders list variant with correct structure", () => {
    const { container } = render(<LoadingSkeleton variant="list" count={1} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders table variant", () => {
    const { container } = render(<LoadingSkeleton variant="table" count={1} />);
    expect(container.querySelector(".grid")).toBeInTheDocument();
  });
});
