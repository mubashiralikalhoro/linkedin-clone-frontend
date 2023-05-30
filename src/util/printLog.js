const printLog = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

export default printLog;
