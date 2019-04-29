const util = require("util");
const fs = require("fs");

const JsSearch = require("js-search");

const scraper = require("./scraper");
const cinemas = require("./cinemas.json");

class Scraper {
  constructor() {}

  queryData(location, isCinemaSearch = false) {
    return new Promise((resolve, reject) => {
      if (isCinemaSearch) {
        const search = new JsSearch.Search("id");
        search.addIndex("name");
        search.addIndex("location");

        search.addDocuments(cinemas);

        const results = search.search(location);
        resolve(results);
      }
    });
  }
  async scrapeAll() {
    try {
      let results = new Array();
      for (let cinema of cinemas) {
        const result = await scraper.scrape(cinema.link);
        results.push(result);
      }
      return new Promise((resolve, reject) => {
        resolve(results);
      });
    } catch (e) {
      console.log(e);
    }
  }
  async getCinemaInfo(location) {
    try {
      const results = await this.queryData(location, true);
      const cinema = await scraper.scrape(
        results.map(result => result.link).join()
      );
      return new Promise((resolve, reject) => {
        resolve(cinema);
      });
    } catch (e) {
      console.log(e);
    }
  }
  async getMovieInfo(cinema, movie) {
    try {
      const shows = await this.getCinemaInfo(cinema);
      const search = new JsSearch.Search(")id");
      search.addIndex("title");
      search.addIndex("link");

      search.addDocuments(shows);

      const results = search.search(movie);
      return new Promise((resolve, reject) => {
        resolve(results);
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Scraper;
