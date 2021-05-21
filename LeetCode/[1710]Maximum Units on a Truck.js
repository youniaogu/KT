/**
 * @param {number[][]} boxTypes
 * @param {number} truckSize
 * @return {number}
 */
var maximumUnits = function (boxTypes, truckSize) {
  boxTypes.sort((prev, curr) => curr[1] - prev[1]);

  let total = 0;
  for (let i = 0; i < boxTypes.length && truckSize > 0; i++) {
    const unit = boxTypes[i][1];
    const size = Math.min(boxTypes[i][0], truckSize);

    total += size * unit;
    truckSize -= size;
  }

  return total;
};
