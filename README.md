### Example

```javascript
const Scraper = require('./main');

const scraper = new Scraper();

// get all starcinemas data from different locations in UAE
scraper.scrapeAll().then(data => console.log(data));

// get data from a specific location, example: 'cineplex' or 'sharjah'
scraper.getCinemaInfo('cineplex').then(data => console.log(data));

// get movie data
scraper.getMovieInfo('cineplex', 'avengers').then(data => console.log(data));

```

### Changes

```javascript
// starcinemas has a public api for two locations, umm al quwain and khalifa city
const got = require('got');

const url = 'http://starapi1.binarynumbers.io/GetAllCinemasSch';

// get cinema by id
(async () => {
  let ids = [3, 5]; // 5 = umm al quwain, 3 = khalifa city abu dhabi
  try {
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      const {body} = await got.post(url, {
        body: JSON.stringify({
          LanguageID: '1',
          CountryID: '230',
          CinemaID: id,
        }),
      });
      console.log(body);
    }
  } catch (e) {
    console.log(e);
  }
})();

// get movie by date id
const url = 'http://starapi1.binarynumbers.io/GetCinemaSchedule'

(async () => {
  let ids = [3, 5]; // 5 = umm al quwain, 3 = khalifa city abu dhabi
  try {
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      const {body} = await got.post(url, {
        body: JSON.stringify({
          LanguageID: '1',
          CountryID: '230',
          CinemaID: id,
          MovieID: 11,
          DateID: 1929 // SchID
        }),
      });
      console.log(body);
    }
  } catch (e) {
    console.log(e);
  }
})();
```
