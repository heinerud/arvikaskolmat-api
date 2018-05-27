const rp = require('request-promise');

const preschool = 'https://mpi.mashie.com/public/menu/arvika+kommun/5adac478'
const school = 'https://mpi.mashie.com/public/menu/arvika+kommun/916571e2'

function getMenu(options) {
    return rp(options)
        .then(body => {
            data = body
                .split('\n')
                .filter(x => x.includes('weekData'))
                .map(x => x.slice(x.indexOf('{')))[0]
                .trim()
                .replace(/new Date\((\d+)\)/g, '$1')
            return JSON.parse(data)
        })
        .catch((err) => console.log(err))
}

var appRouter = function (app) {
    app.get("/school", (req, res, next) => getMenu(school).then(menu => res.send(menu)))
    app.get("/preschool", (req, res, next) => getMenu(preschool).then(menu => res.send(menu)))
}

module.exports = appRouter;
