//import moment from 'moment';
const csv = require('csv-parser')
const fs = require('fs')
const Pool = require("pg").Pool;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const fastcsv = require("fast-csv");

var results = [];
var photosResults = [];
var char = [];
var charReviews = [];

//////REVIEW PHOTOS////

// fs.createReadStream('csv/reviews_photos.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//    if(data.url === undefined){
//      data.url = 'null'
//    }
//    photosResults.push(data)


//   })
//   .on('end', () => {
//   //  console.log(photosResults)
//         const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csvWriter = createCsvWriter({
//     path: 'csv/clean_reviews_photos.csv',
//     header: [
//       // id,review_id,url
//         {id: 'id', title: 'id'},
//         {id: 'review_id', title: 'review_id'},
//         {id: 'url', title: 'url'}
//     ]
// });



// csvWriter.writeRecords(photosResults)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });

// const pool = new Pool({
//   host: "localhost",
//   user: "me",
//   database: "sdc_api",
//   password: "Clooney1!",
//   port: 5432
// });
// const query =
//   "INSERT INTO photos (id, review_id, url) VALUES ($1, $2, $3)";
//   pool.connect((err, client, done) => {
//     if (err) throw err;

//     const start = new Date(Date.now());
//      console.log('START', start)
//       photosResults.forEach(row => {

//         client.query(query, [row.id, row.review_id, row.url])
//         .then(res => {
//           console.log("inserted " + res.rowCount + " row:", row)
//         })
//         .catch(e => console.error(e.stack))

//       });

//   });
//   const end = new Date(Date.now());
//      console.log("END", end)
// });









/////REVIEWS////
fs.createReadStream('csv/reviews.csv')

  .pipe(csv())
  .on('data', (data)=> {


  if (data.helpfulness === undefined){
    data.helpfulness = data.response
    data.response = data.reviewer_email
    data.reviewer_email = data.reviewer_name
    data.reviewer_name = data.reported
    data.reported = data.recommend
    data.recommend = data.body
    data.body = data.summary
    data.summary = data.date
    data.date = data.rating
    data.rating = 'null'

  }
  var arrDate = data.date.split('')
  var num = Number(arrDate[1])
  if(num){
  // console.log(arrDate.join(''))

   var date1 =  arrDate.join('');
   //console.log(date1)
   //MIGHT NEED TO TURN INTO A STRING
   var objDate = new Date(Number(date1))

   data.date = JSON.stringify(objDate)
  } else if(!Number(arrDate[0]))  {

      var date2 = Date.parse(arrDate.join(""))
     var objDate2 = new Date(date2)
     data.date = JSON.stringify(objDate2)

    // var date2 = arrDate.join('')
    // console.log(date2)

  }
  results.push(data)

  })


  .on('end', () => {

    const pool = new Pool({
      host: "localhost",
      user: "me",
      database: "sdc_api",
      password: "Clooney1!",
      port: 5432
    });
    const query =


      "INSERT INTO reviews (id,product_id, rating, date, summary, body, recommend, reported, reviewer_name,reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
      pool.connect((err, client, done) => {
        if (err) throw err;

        //try {

          results.forEach(row => {

            client.query(query, [row.id, row.product_id, row.rating, row.date, row.summary, row.body, row.recommend, row.reported, row.reviewer_name, row.reviewer_email, row.response, row.helpfulness], (err, res) =>{
              if(err) {
                console.log(err.stack)
              }
            })
            // .then(res => {
            //   console.log("inserted " + res.rowCount + " row:", row)
            // })
            // .catch(e => console.error(e.stack))

          });


      });


 });

/////CHARACTERSTICS////

// var num = 0
// fs.createReadStream('csv/characteristics.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     if(data.name === undefined){
//       data.name = ''
//     }


//     char.push(data)
//     // id,product_id,name

//   })
//   .on('end', () => {
//    console.log(char)
//     const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csvWriter = createCsvWriter({
//     path: 'csv/clean_characeristics.csv',
//     header: [
//         {id: 'id', title: 'id'},
//         {id: 'product_id', title: 'product_id'},
//         {id: 'name', title: 'name'}
//     ]
// });



// csvWriter.writeRecords(char)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });

//     const pool = new Pool({
//       host: "localhost",
//       user: "me",
//       database: "sdc_api",
//       password: "Clooney1!",
//       port: 5432
//     });
//     const query =
//       "INSERT INTO characteristics (id,product_id, name) VALUES ($1, $2, $3)";
//       pool.connect((err, client, done) => {
//         if (err) throw err;
//          char.forEach(row => {

//             client.query(query, [row.id, row.product_id, row.name], (err, res) =>{
//               if(err) {
//                 console.log(err.stack)
//               } else {
//                 console.log(num++)
//               }
//             })
//           });
//       });

// });


///////char-reviews//////
// var num = 0
// fs.createReadStream('csv/characteristics_test.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     if(data.name === undefined){
//       data.name = ''
//     }
//     char.push(data)
//   })
//   .on('end', () => {
//         const pool = new Pool({
//       host: "localhost",
//       user: "me",
//       database: "sdc_api",
//       password: "Clooney1!",
//       port: 5432
//     });
//     const query =
//       "INSERT INTO characteristics (id,product_id, name) VALUES ($1, $2, $3)";
//       pool.connect((err, client, done) => {
//         if (err) throw err;
//          char.forEach(row => {

//             client.query(query, [row.id, row.product_id, row.name], (err, res) =>{
//               if(err) {
//                 console.log(err.stack)
//               } else {
//                 console.log(num++)
//               }
//             })
//           });
//       });
// });


// var num = 0
// fs.createReadStream('csv/characteristic_reviews_test.csv')
//   .pipe(csv())
//   .on('data', (data) => {

//     charReviews.push(data)
//   })
//   .on('end', () => {
//         const pool = new Pool({
//       host: "localhost",
//       user: "me",
//       database: "sdc_api",
//       password: "Clooney1!",
//       port: 5432
//     });
//     // id,characteristic_id,review_id,value
//     const query =
//       "INSERT INTO char_reviews (id, characteristic_id, review_id, value) SELECT * FROM characteristics WHERE review_id NOT IN (SELECT id FROM characteristics) VALUES ($1, $2, $3, $4)";

//       pool.connect((err, client, done) => {
//         if (err) throw err;
//          charReviews.forEach(row => {

//             client.query(query, [row.id, row.characteristic_id, row.review_id, row.value], (err, res) =>{
//               if(err) {
//                 console.log(err.stack)
//               } else {
//                 console.log(num++)
//               }
//             })
//           });
//       });
// });

//    var func = function(array){
//     //debugger
//   var output =''
// for(var i= 0; i < array.length; i++){
//  output +=  array[i].id + ","
//  output += array[i].review_id + ","
//  output += array[i].url + "\n"
// }
// return output
// }
// func(characteristicsResults)