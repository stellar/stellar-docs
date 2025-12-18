export const combineAdjacentStrings = (list) =>
  list.reduce((accum, item) => {
    const lastIndex = accum.length - 1;
    if (typeof accum[lastIndex] === "string" && typeof item === "string") {
       
      accum[lastIndex] = `${accum[lastIndex]}${item}`;
    } else {
      accum.push(item);
    }
    return accum;
  }, []);

export const partition = (items, filter) =>
  items.reduce(
    (buckets, item) => {
      buckets[filter(item) ? 0 : 1].push(item);
      return buckets;
    },
    [[], []],
  );
