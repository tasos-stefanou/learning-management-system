const trimValuesOfObject = (obj) => {
  const newObj = {};
  for (const key in obj) {
    newObj[key] = obj[key].trim();
  }
  return newObj;
};

export { trimValuesOfObject };
