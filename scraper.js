//TODO: refactor
// shitty code but it works for now
const request = require('request');
const cheerio = require('cheerio');
const uuid = require('uuid/v4');

const scraper = {
  scrape: url => {
    return new Promise((resolve, reject) => {
      const options = {
        url: url,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        },
      };
      request(options, (err, res, body) => {
          const data = new Array
        if (!err && res.statusCode) {
          const $ = cheerio.load(body);

          const starcinema_link = [];
          $('div.cinema_show_time').each((i, e) => {
            starcinema_link.push(
              $(e)
                .find('a')
                .attr('onclick'),
            );
          });

          if (starcinema_link.length == 0)
            reject("Can't get data from source.");
          const results = [];
          $('div#divAllMovie')
            .children()
            .children()
            .children()
            .children()
            .each((i, e) => {
              results.push($(e).text());
            });

          const schedules = [];
          results.map((v, i) => {
            if (i % 2 !== 0) {
              schedules.push(v.split('AED'));
            }
          });

          const images = [];
          $('img.imgmovie').each((i, e) => {
            const r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            const match = $(e)
              .attr('src')
              .match(r);
            if (match) {
              const image = $(e).attr('src');
              var regexp = /[\w-]+.(jpg|png|txt)/;
              var filename = image.match(regexp);
            } else {
            }
            images.push($(e).attr('src'));
          });

          $('a.cinema_tittle').each((i, e) => {
            const title = $(e).text();
            const link = 'https://www.starcinemas.ae/' + $(e).attr('href');

            const image = images.slice(1)[i];
            const schedule = schedules[i];

			data.push({title, link, image, schedule:get(schedule)})
          });
          resolve(data)
        } else {
          reject("Can't access source.");
        }
      });
    });
  },
};

function get(data) {
  const id = new Array();
  const price = new Array();
  const time = new Array();
  const result = new Array()
  let initialTime;
  for (var i = 0; i < data.length; i++) {
    let [initialId, initialPrice] = data[i].split(' - ');
    initialId = initialId.match(
      /(STAR\s[a-zA-Z]*\s[a-zA-Z]*)|(STAR\s[a-zA-Z]*)/g,
    );
    if (i >= 1) {
      initialTime = data[i].match(
        /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] [APap][mM]/g,
      );
      initialTime = initialTime.join(', ');
      time.push(initialTime);
    }
    if (initialId) {
      initialId = initialId.join(', ');
      id.push(initialId);
      price.push(initialPrice);
    }
  }
  for (var i = 0; i < id.length; i++) {
    result.push({id: id[i], price: price[i], time: time[i]});
  }
  return result
}
module.exports = scraper;
