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