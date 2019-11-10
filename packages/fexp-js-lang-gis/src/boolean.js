const turfBooleanWithin = require("@turf/boolean-within").default;
const turfBooleanContains = require("@turf/boolean-contains").default;
const turfBooleanDisjoint = require("@turf/boolean-disjoint").default;
const turfBooleanCrosses = require("@turf/boolean-crosses").default;
const turfBooleanOverlap = require("@turf/boolean-overlap").default;

const geoWithin = args => turfBooleanWithin(...args);
const geoContains = args => turfBooleanContains(...args);
const geoDisjoint = args => turfBooleanDisjoint(...args);
const geoCrosses = args => turfBooleanCrosses(...args);
const geoOverlap = args => turfBooleanOverlap(...args);

module.exports = {
  "geo-within": geoWithin,
  "geo-contains": geoContains,
  "geo-disjoint": geoDisjoint,
  "geo-crosses": geoCrosses,
  "geo-overlap": geoOverlap
};
