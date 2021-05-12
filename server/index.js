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

app.get('/test', (req, res) => {
  res.status(200).send('hey')
})
///////////////GET REVIEWS///////////////////////
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


  var prodId = req.query.product_id

  pool.query(`SELECT reviews.rating, reviews.summary, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, photos.review_id, photos.id, photos.url FROM reviews INNER JOIN photos ON reviews.id = ${prodId} AND photos.review_id = ${prodId};`, (error, results) => {
    if (error) {
      throw error
    }
    var products = pretty(results.rows)


res.status(200).send(products)

  })

}
app.get('/reviews', getProductById)


//////////////REVIEWS META//////////////////
var output = {}
var valOutput = {}
var outputMeta = {}
var rate = {}
var rec = {}
var T = 0
var F = 0
var chars = {}
var allTheChars = {}
var fit = []
var length = []
var comfort = []
var quality = []
var size = []
var width = []
function averageChar(array){
    if(array.length === 0){
        return
    }

     average = array.reduce(function (sum, value) {
        return sum + value;
    }, 0) / array.length;
return average.toFixed(4)
}


function metaMaker(arr){
for ( var i=0; i < arr.length; i++ ) {

   if(chars[arr[i].name] === undefined){
       chars[arr[i].name] = {}
   }

valOutput[arr[i].charrevid] = arr[i]
output[arr[i].id] = arr[i]
    }
for(var key in valOutput){


if(valOutput[key].name === 'Fit'){

    fit.push(valOutput[key].value)
   allTheChars.Fit = {value: averageChar(fit)}

}
if(valOutput[key].name === 'Length'){
    length.push(valOutput[key].value)
}

allTheChars.Length = {value: averageChar(length)}

if(valOutput[key].name === 'Quality'){

   quality.push(valOutput[key].value)
}
allTheChars.Quality = {value: averageChar(quality)}

if(valOutput[key].name === 'Size'){

    size.push(valOutput[key].value)
}
allTheChars.Size = {value: averageChar(size)}

if(valOutput[key].name === 'Width'){

    width.push(valOutput[key].value)
}
allTheChars.Width = {value: averageChar(width)}

if(valOutput[key].name === 'Comfort'){

    comfort.push(valOutput[key].value)
}
allTheChars.Comfort = {value: averageChar(comfort)}

}

// for(var i = 0; i < arr.length; i++){

//  //  console.log(allTheChars)
// }


for(var key in output){
    outputMeta.product_id = output[key].product_id
    if(rate[output[key].rating] === undefined){
       rate[output[key].rating] = 1
    } else {
        rate[output[key].rating]++
    }
    if(output[key].recommend === 'true'){
        T++
       rec[1] = T
    }if(output[key].recommend === 'false'){
        F++
       rec[0] = F
    }

}

outputMeta.recommend = rec
outputMeta.ratings = rate
outputMeta.characteristics = allTheChars;
return outputMeta
}

const getMetaData = (req, res) => {

var prodId = req.query.product_id


  pool.query(`SELECT reviews.id, reviews.product_id, reviews.rating, reviews.recommend, characteristics.id AS charID, characteristics.product_id AS charPId, characteristics.name, char_reviews.id AS charrevid, char_reviews.characteristic_id, char_reviews.review_id, char_reviews.value FROM reviews INNER JOIN characteristics ON reviews.product_id = ${prodId} AND characteristics.product_id = ${prodId} INNER JOIN char_reviews ON characteristics.id = char_reviews.characteristic_id`, (error, results) => {
    if (error) {
      throw error
    }


    var output = metaMaker(results.rows)
    res.status(200).send(output)
 })

 }
app.get('/reviews/meta', getMetaData)


//////////////ADD HELPFUL//////////////////
const addHelpful = (req, res) => {

  // console.log(Number(req.query.helpfulness), req.params.review_id)

  pool.query(`UPDATE reviews SET helpfulness = ${Number(req.query.helpfulness)} WHERE id = ${req.params.review_id}`, (error, results) => {
    if (error) {
      throw error
    }
   res.status(200).send(`Review modified with ID: ${req.params.review_id}`)
 })
}
app.put('/reviews/:review_id/helpful', addHelpful)


////////////////CHANGE REPORTED///////////////////
async function changeReported (req, res){
var reportId = req.query.reported
var paramId = req.params.review_id
try{

  await pool.query(`UPDATE reviews SET reported = ${reportId} WHERE id = ${paramId}`)

} catch (error) {
  throw error
}
res.sendStatus(200)

}
app.put('/reviews/:review_id/report', changeReported)

/////////////////////POST REVIEWS/////////////////////////////////////
async function postReview(req, res){
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.query
  var k = Object.keys(JSON.parse(characteristics))
  var v = Object.values(JSON.parse(characteristics))

let response;
let response2;
try {
  response = await pool.query(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING reviews.id`, [product_id, rating, summary, body, recommend, name, email])
} catch (error) {
  throw error
}
try {
  response2 = await pool.query(`INSERT INTO photos (review_id, url) VALUES ($1, $2) RETURNING photos.review_id`, [response.rows[0].id, photos])
} catch (error) {
  throw error
}

try {
  for(var i = 0; i < k.length; i++){

    response = await pool.query(`INSERT INTO char_reviews (review_id, characteristic_id, value) VALUES ($1, $2, $3)`, [response2.rows[0].review_id, k[i], v[i]])
  }
  res.status(200).send('saved')
} catch (error) {
  throw error
}


}

app.post('/reviews', postReview)

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});