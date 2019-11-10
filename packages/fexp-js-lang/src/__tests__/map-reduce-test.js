const mapReduce = require("../map-reduce");

describe("Map/Reduce", () => {
  it('will "map" results"', () => {
    expect(mapReduce.map([[1, 2, 3], i => i * i])).toMatchObject([1, 4, 9]);
  });
  it('will "reduce" results"', () => {
    expect(mapReduce.reduce([[1, 2, 3], (c, t) => c * t, 2])).toBe(12);
  });
  it('will "filter" results"', () => {
    expect(mapReduce.filter([[1, 2, 3], i => i === 1])).toMatchObject([1]);
  });
  it('will "find" results"', () => {
    expect(mapReduce.find([[1, 2, 3], i => i === 3])).toBe(3);
  });
});
