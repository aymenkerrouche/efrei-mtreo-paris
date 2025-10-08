/**
 * Formate une date en "HH:MM"
 * @param {Date} date - La date à formater
 * @returns {string} L'heure formatée en "HH:MM"
 * @throws {TypeError} Si date n'est pas une instance de Date
 */
function formatHHMM(date) {
  if (!(date instanceof Date)) {
    throw new TypeError("Expected a Date instance");
  }

  if (isNaN(date.getTime())) {
    throw new TypeError("Invalid Date");
  }

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Calcule l'heure d'arrivée du prochain métro
 * @param {Date} baseDate - L'heure de base
 * @param {number} headwayMin - L'intervalle en minutes (doit être >= 0)
 * @returns {string} L'heure d'arrivée formatée en "HH:MM"
 * @throws {TypeError} Si baseDate n'est pas une Date valide
 * @throws {RangeError} Si headwayMin est négatif
 */
function computeNextHHMM(baseDate, headwayMin) {
  if (!(baseDate instanceof Date)) {
    throw new TypeError("Expected baseDate to be a Date instance");
  }

  if (isNaN(baseDate.getTime())) {
    throw new TypeError("Invalid baseDate");
  }

  if (typeof headwayMin !== "number" || headwayMin < 0) {
    throw new RangeError("headwayMin must be a non-negative number");
  }

  const nextTime = new Date(baseDate.getTime() + headwayMin * 60 * 1000);
  return formatHHMM(nextTime);
}

module.exports = {
  formatHHMM,
  computeNextHHMM,
};
