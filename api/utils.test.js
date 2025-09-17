const { nextTimeFromNow } = require("./utils");

describe("nextTimeFromNow", () => {
  const MOCK_DATE = new Date("2025-09-17T12:00:00Z");
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns +3 min in HH:MM format", () => {
    // 12:00 UTC+2 + 3 min = 14:03 (system local time)
    expect(nextTimeFromNow(3)).toBe("14:03");
  });

  it("returns same result for default (no headway)", () => {
    expect(nextTimeFromNow()).toBe("14:03");
  });

  it("returns null for invalid headway (<=0)", () => {
    expect(nextTimeFromNow(0)).toBeNull();
    expect(nextTimeFromNow(-5)).toBeNull();
    expect(nextTimeFromNow("bad")).toBeNull();
  });
});
