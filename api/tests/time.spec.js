const { formatHHMM, computeNextHHMM } = require("../src/lib/time");

describe("formatHHMM", () => {
  describe("Cas normaux", () => {
    test("formate correctement 10:05", () => {
      const date = new Date(2025, 0, 1, 10, 5, 0);
      expect(formatHHMM(date)).toBe("10:05");
    });

    test("formate correctement 09:03 avec zéros de padding", () => {
      const date = new Date(2025, 0, 1, 9, 3, 0);
      expect(formatHHMM(date)).toBe("09:03");
    });

    test("formate correctement minuit 00:00", () => {
      const date = new Date(2025, 0, 1, 0, 0, 0);
      expect(formatHHMM(date)).toBe("00:00");
    });

    test("formate correctement 23:59", () => {
      const date = new Date(2025, 0, 1, 23, 59, 0);
      expect(formatHHMM(date)).toBe("23:59");
    });
  });

  describe("Validation des paramètres", () => {
    test("throw TypeError si pas une Date", () => {
      expect(() => formatHHMM("invalid")).toThrow(TypeError);
      expect(() => formatHHMM("invalid")).toThrow("Expected a Date instance");
    });

    test("throw TypeError si Date invalide", () => {
      const invalidDate = new Date("invalid");
      expect(() => formatHHMM(invalidDate)).toThrow(TypeError);
      expect(() => formatHHMM(invalidDate)).toThrow("Invalid Date");
    });

    test("throw TypeError si null", () => {
      expect(() => formatHHMM(null)).toThrow(TypeError);
    });
  });
});

describe("computeNextHHMM", () => {
  describe("Cas normaux", () => {
    test("10:00 + 3min → 10:03", () => {
      const base = new Date(2025, 0, 1, 10, 0, 0);
      expect(computeNextHHMM(base, 3)).toBe("10:03");
    });

    test("14:20 + 7min → 14:27", () => {
      const base = new Date(2025, 0, 1, 14, 20, 0);
      expect(computeNextHHMM(base, 7)).toBe("14:27");
    });

    test("headwayMin = 0 (même heure)", () => {
      const base = new Date(2025, 0, 1, 15, 30, 0);
      expect(computeNextHHMM(base, 0)).toBe("15:30");
    });
  });

  describe("Cas limites (edge cases)", () => {
    test("10:58 + 5min → 11:03 (wrap d'heure)", () => {
      const base = new Date(2025, 0, 1, 10, 58, 0);
      expect(computeNextHHMM(base, 5)).toBe("11:03");
    });

    test("23:59 + 5min → 00:04 (wrap de minuit)", () => {
      const base = new Date(2025, 0, 1, 23, 59, 0);
      expect(computeNextHHMM(base, 5)).toBe("00:04");
    });

    test("23:55 + 10min → 00:05 (wrap de minuit)", () => {
      const base = new Date(2025, 0, 1, 23, 55, 0);
      expect(computeNextHHMM(base, 10)).toBe("00:05");
    });

    test("12:45 + 30min → 13:15 (grande interval)", () => {
      const base = new Date(2025, 0, 1, 12, 45, 0);
      expect(computeNextHHMM(base, 30)).toBe("13:15");
    });
  });

  describe("Validation des paramètres", () => {
    test("throw TypeError si baseDate pas une Date", () => {
      expect(() => computeNextHHMM("invalid", 5)).toThrow(TypeError);
      expect(() => computeNextHHMM("invalid", 5)).toThrow(
        "Expected baseDate to be a Date instance"
      );
    });

    test("throw TypeError si baseDate invalide", () => {
      const invalidDate = new Date("invalid");
      expect(() => computeNextHHMM(invalidDate, 5)).toThrow(TypeError);
      expect(() => computeNextHHMM(invalidDate, 5)).toThrow("Invalid baseDate");
    });

    test("throw RangeError si headwayMin négatif", () => {
      const base = new Date(2025, 0, 1, 10, 0, 0);
      expect(() => computeNextHHMM(base, -5)).toThrow(RangeError);
      expect(() => computeNextHHMM(base, -5)).toThrow(
        "headwayMin must be a non-negative number"
      );
    });

    test("throw RangeError si headwayMin pas un nombre", () => {
      const base = new Date(2025, 0, 1, 10, 0, 0);
      expect(() => computeNextHHMM(base, "invalid")).toThrow(RangeError);
    });
  });
});
