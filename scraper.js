//TODO: refactor
// shitty code but it works for now
const request = require("request");
const cheerio = require("cheerio");
const uuid = require("uuid/v4");

const scraper = {
  scrape: url => {
    return new Promise((resolve, reject) => {
      const options = {
        url: url,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
      };
      request(options, (err, res, body) => {
        if (!err && res.statusCode) {
          const $ = cheerio.load(body);

          const starcinema_link = [];
          $("div.cinema_show_time").each((i, e) => {
            starcinema_link.push(
              $(e)
                .find("a")
                .attr("onclick")
            );
          });

          const results = [];
          $("div#divAllMovie")
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
              schedules.push(v.split("AED"));
            }
          });

          const images = [];
          $("img.imgmovie").each((i, e) => {
            const r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            const match = $(e)
              .attr("src")
              .match(r);
            if (match) {
              const image = $(e).attr("src");
              var regexp = /[\w-]+.(jpg|png|txt)/;
              var filename = image.match(regexp);
            } else {
            }
            images.push($(e).attr("src"));
          });

          const data = [];
          $("a.cinema_tittle").each((i, e) => {
            const title = $(e).text();
            const link = "https://www.starcinemas.ae/" + $(e).attr("href");

            const image = images.slice(1)[i];
            const schedule = schedules[i];
            data.push({ title, link, image, schedule });
          });
          const not_final = [];
          data.map((movie, index) => {
            const id = movie.schedule[0].split(" - ")[0]; //.replace(/\s/g, '');
            const price = movie.schedule[0].split(" - ")[1].replace(/\s/g, "");
            const time = movie.schedule[1].match(
              /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] [APap][mM]/g
            );
            const match = movie.schedule[1].match(
              /STAR SELECT - [0-9][0-9].[0-9][0-9]/g
            );
            const regex = /'([^']*)'/;
            const link_to_page =
              "https://starcinemas.ae/" +
              starcinema_link[index].match(regex)[1];

            if (match) {
              const second_id = movie.schedule[1]
                .match(/STAR SELECT - [0-9][0-9].[0-9][0-9]/g)[0]
                .split(" - ")[0];

              if (!second_id) {
                second_id = movie.schedule[1]
                  .match(/STAR LUX - [0-9][0-9].[0-9][0-9]/g)[0]
                  .split(" - ")[0];
              }

              const second_price = movie.schedule[1]
                .match(/STAR SELECT - [0-9][0-9].[0-9][0-9]/g)[0]
                .split(" - ")[1];

              const second_time = movie.schedule[2].match(
                /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] [APap][mM]/g
              );

              not_final.push({
                id: uuid(),
                title: movie.title,
                link: movie.link,
                image: movie.image,
                schedule: [
                  { id, price, time },
                  {
                    id: second_id,
                    price: second_price,
                    time: second_time
                  }
                ]
              });
              resolve(not_final);
            } else {
              not_final.push({
                id: uuid(),
                title: movie.title,
                link: movie.link,
                image: movie.image,
                schedule: [{ id, price, time }]
              });
              resolve(not_final);
            }
          });
        } else {
          reject();
        }
      });
    });
  }
};

module.exports = scraper;
