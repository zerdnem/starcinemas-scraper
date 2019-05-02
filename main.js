const JsSearch = require('js-search');

const scraper = require('./scraper');
const cinemas = require('./cinemas.json');

class Scraper {
  async queryData(location, isCinemaSearch = false) {
    if (isCinemaSearch) {
      const search = new JsSearch.Search('id');
      search.addIndex('name');
      search.addIndex('location');

      search.addDocuments(cinemas);

      const result = search.search(location);
      if (result.length == 0) throw new Error('Not found');
      return result;
    }
  }
  async scrapeAll() {
    try {
      let results = new Array();
      for (let cinema of cinemas) {
        const result = await scraper.scrape(cinema.link);
        results.push(result);
      }
      return results;
    } catch (e) {
      console.log(e);
    }
  }
  async getCinemaInfo(location) {
    try {
      const results = await this.queryData(location, true);
      for (let result of results) {
        const cinema = await scraper.scrape(result.link);
        if (!cinema) return;
        return cinema;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getMovieInfo(cinema, movie) {
    try {
      const shows = await this.getCinemaInfo(cinema);
      if (!shows) return;
      const search = new JsSearch.Search(')id');
      search.addIndex('title');
      search.addIndex('link');

      search.addDocuments(shows);

      return search.search(movie);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Scraper;
