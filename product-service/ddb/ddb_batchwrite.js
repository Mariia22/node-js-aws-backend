let productsParams = require("./products");
let stocksParams = require("./stocks");
let AWS = require("aws-sdk"),
  { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb"),
  { DynamoDB } = require("@aws-sdk/client-dynamodb");

AWS.config.update({ region: process.env.PRODUCT_AWS_REGION });
let ddb = DynamoDBDocument.from(new DynamoDB());

let params; 
process.argv[2] === "products" ? params = productsParams : params = stocksParams;

ddb.batchWrite(params, function (err, data) {
  if (err) {
    console.log(params)
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});

//Run script node ddb_batchwrite.js products
