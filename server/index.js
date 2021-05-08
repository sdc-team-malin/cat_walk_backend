const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const Pool = require('pg').Pool

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pool = new Pool({
  host: "localhost",
  user: "me",
  database: "sdc_api",
  password: "Clooney1!",
  port: 5432
});
const getProductById = (req, res) => {

  var prodObj = {}
  var prodId = req.query.product_id
  pool.query(`SELECT * FROM reviews WHERE id = ${prodId}`, (error, results) => {
    if (error) {
      throw error
    }


   prodObj['results'] = results.rows

   console.log(prodObj)
  })
}

app.get('/reviews', getProductById)
///////////////////////////////////
// const pool = new Pool({
//   host: "localhost",
//   user: "me",
//   database: "sdc_api",
//   password: "Clooney1!",
//   port: 5432
// });
const getPhotostById = (req, res) => {
  // var prodObj = {}
  // var prodId = req.query.product_id
  pool.query(`SELECT * FROM photos WHERE id = 2742539;`, (error, results) => {
    if (error) {
      throw error
    }

console.log(results.rows)
  })
}

app.get('/photos', getPhotostById)

const getCharsById = (req, res) => {
  // var prodObj = {}
  // var prodId = req.query.product_id
  pool.query(`SELECT * FROM characteristics WHERE id = 99;`, (error, results) => {
    if (error) {
      throw error
    }

console.log(results.rows)
  })
}

// app.get('/reviews', getCharsById)

// const getReviewsById = (req, res) => {
//   // var prodObj = {}
//   // var prodId = req.query.product_id
//   pool.query(`SELECT * FROM characteristics WHERE id = 5774639;`, (error, results) => {
//     if (error) {
//       throw error
//     }

// console.log(results.rows)
//   })
// }

// app.get('/reviews', getReviewsById)


app.listen(port, function() {
  console.log(`listening on port ${port}`);
});