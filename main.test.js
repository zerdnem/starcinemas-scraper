const Scraper = require('./main');
const scraper = new Scraper();

test('the getMovieInfo fails with an error', async () => {
  try {
    await scraper.getMovieInfo('sharjah', 'fasdfasdf');
  } catch (e) {
    expect(e).toMatch('Not found.');
    expect.assertions(1);
  }
});
test('the getCinemaInfo fails with an error', async () => {
  try {
    await scraper.getCinemaInfo('fadfa');
  } catch (e) {
    expect(e).toMatch('Not found.');
    expect.assertions(1);
  }
});
test('the scrapeAll fails with an error', async () => {
  try {
    await scraper.scrapeAll();
  } catch (e) {
    expect(e).toMatch("Can't get data from source");
    expect.assertions(1);
  }
});
