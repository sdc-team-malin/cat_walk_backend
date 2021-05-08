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

var outputObj = {}
var photosArr = []
var resultsArr = []
var totalOutput = {}
function pretty(arr){
arr.forEach((el)=>{
    outputObj.rating = el.rating
    outputObj.summary = el.summary
    outputObj.response = el.response
          outputObj.body = el.body
           outputObj.date = el.date
        outputObj.reviewer_name = el.reviewer_name
    outputObj.helpfulness = el.helpfulness
            outputObj.response = el.response
            outputObj.review_id = el.review_id

    var url = el.url
    var id = el.id
   photosArr.push({url, id})
  outputObj.photos = photosArr
})

resultsArr.push(outputObj)
totalOutput.page = 1
totalOutput.count = 5
totalOutput.results = resultsArr
return totalOutput
}


const getProductById = (req, res) => {

  var prodObj = {}
  var prodId = req.query.product_id

  pool.query(`SELECT reviews.rating, reviews.summary, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, photos.review_id, photos.id, photos.url FROM reviews INNER JOIN photos ON reviews.id = ${prodId} AND photos.review_id = ${prodId};`, (error, results) => {
    if (error) {
      throw error
    }
    var products = pretty(results.rows)


res.status(200).send(products)
  //  prodObj['results'] = results.rows

  //  console.log(prodObj)
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