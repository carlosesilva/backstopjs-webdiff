module.exports = async (page, scenario) => {
  if (scenario.headers) {
    await page.setExtraHTTPHeaders(scenario.headers);
  }
};
