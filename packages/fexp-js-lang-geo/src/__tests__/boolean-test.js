const boolean = require("../boolean");

describe("Boolean GEO checks", () => {
  it('will return boolean true evaluation for "geo-contains"', () => {
    const geoA = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    const geoB = { type: "Point", coordinates: [1, 2] };
    expect(boolean["geo-contains"]([geoA, geoB])).toBe(true);
  });
  it('will return boolean false evaluation for "geo-contains"', () => {
    const geoA = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    const geoB = { type: "Point", coordinates: [2, 1] };
    expect(boolean["geo-contains"]([geoA, geoB])).toBe(false);
  });
  it('will return boolean true evaluation for "geo-disjoint"', () => {
    const geoA = { type: "Point", coordinates: [2, 1] };
    const geoB = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    expect(boolean["geo-disjoint"]([geoA, geoB])).toBe(true);
  });
  it('will return boolean false evaluation for "geo-disjoint"', () => {
    const geoA = { type: "Point", coordinates: [1, 2] };
    const geoB = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    expect(boolean["geo-disjoint"]([geoA, geoB])).toBe(false);
  });
  it('will return boolean true evaluation for "geo-crosses"', () => {
    const geoA = { type: "LineString", coordinates: [[-2, 2], [4, 2]] };
    const geoB = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    expect(boolean["geo-crosses"]([geoA, geoB])).toBe(true);
  });
  it('will return boolean false evaluation for "geo-crosses"', () => {
    const geoA = {
      type: "LineString",
      coordinates: [[-2, -2], [-4, -4]]
    };
    const geoB = {
      type: "LineString",
      coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]]
    };
    expect(boolean["geo-crosses"]([geoA, geoB])).toBe(false);
  });
  it('will return boolean true evaluation for "geo-overlap"', () => {
    const geoA = {
      type: "Polygon",
      coordinates: [[[0, 0], [0, 5], [5, 5], [5, 0], [0, 0]]]
    };
    const geoB = {
      type: "Polygon",
      coordinates: [[[1, 1], [1, 6], [6, 6], [6, 1], [1, 1]]]
    };
    expect(boolean["geo-overlap"]([geoA, geoB])).toBe(true);
  });
  it('will return boolean false evaluation for "geo-overlap"', () => {
    const geoA = {
      type: "Polygon",
      coordinates: [[[1, 1], [1, 6], [6, 6], [6, 1], [1, 1]]]
    };
    const geoB = {
      type: "Polygon",
      coordinates: [[[10, 10], [10, 15], [15, 15], [15, 10], [10, 10]]]
    };
    expect(boolean["geo-overlap"]([geoA, geoB])).toBe(false);
  });
});
