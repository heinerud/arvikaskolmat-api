const rp = require('request-promise');
const cheerio = require('cheerio');

const preschool = {
    uri: 'https://mpi.mashie.com/public/menu/arvika+kommun/5adac478',
    transform: body => cheerio.load(body)
};

const school = {
    uri: 'https://mpi.mashie.com/public/menu/arvika+kommun/916571e2',
    transform: body => cheerio.load(body)
};

function getMenu(options) {
    return rp(options)
        .then(($) => {
            header = $('.nav-header--label').text().trim()
            dates = $.html()
                .split('\n')
                .filter(x => x.includes('js-date'))
                .map(x => x.slice(x.indexOf('js-date') + 9, -2))

            console.log($('#menu-week').text())

            food = $('.day-alternative').text()
                .split('\n')
                .map(x => x.trim())
                .filter(x => x.length > 0)
                .filter(x => x !== 'Lunch')

            if (dates.length !== food.length) {
                return { error: 'Array length mismatch' }
            }

            menu = dates.map((date, i) => {
                return { 'date': date, 'dish': food[i] }
            })
            return { title: header, menu: menu }
        })
        .catch((err) => console.log(err))
}

var appRouter = function (app) {
    app.get("/school", (req, res, next) => getMenu(school).then(menu => res.send(menu)))
    app.get("/preschool", (req, res, next) => getMenu(preschool).then(menu => res.send(menu)))
}

module.exports = appRouter;
