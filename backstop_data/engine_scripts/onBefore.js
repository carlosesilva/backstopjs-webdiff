module.exports = async (page, scenario, vp) => {
  // If the scenario has a headers object, set the headers.
  await require("./setHeaders")(page, scenario);
};
