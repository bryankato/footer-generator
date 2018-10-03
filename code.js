// Global Variables
// Id for the footer master trix
var ssId = "1fY5Jadl0QP_H9-8DrhzCKH6SjwHZqlrMAmGHsJmUCFM";
// Index of first tab containing footer content
var firstTabIndex = 4;
// Index of first column containing footer content
var firstCol = 3;

// create tab list for dropdown - done
// get program name headers -  done
// get languages for dropdown
// get footer content
// show footer content
function test() {
  Logger.log("test worked");
};

// Get a list of products/tabs
// with option to define index
// of first tab
function getProducts(indexStart) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Get sheets/tabs/product names
  // All 3 names can be used interchangeably
  var sheets = ss.getSheets();
  // Initialize list of products
  var products = [];
  // Add sheets/tabs/product names to list
  for (var i = indexStart; i < sheets.length; i++) {
    var product = sheets[i].getName();
    products.push(product);
  };
  return products;
};

function getOfferTypes(product) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Select tab using product/tab name
  var sheet = ss.getSheetByName(product);
  // Start getting headers while
  // skipping row and language
  // columns
  var numCols = sheet.getLastColumn() - firstCol + 1;
  // Get range of offer type headers
  var offerTypesRange = sheet.getRange(1, firstCol, 1, numCols);
  // Get list of offer types
  var offerTypes = offerTypesRange.getValues();
  // Client side functions can only return strings
  // so the array must be converted first
  return JSON.stringify(offerTypes);
};

function getLangs(product) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Select tab using product/tab name
  var sheet = ss.getSheetByName(product);
  // Get number of rows
  var numRows = sheet.getLastRow() - 1;
  // Get langs
  var langsRange = sheet.getRange(2, 1, numRows, 2);
  var langs = langsRange.getValues();
  // Client side functions can only return strings
  // so the array must be converted first
  return JSON.stringify(langs);
};

function getFooter(product, colIndex, rowIndex) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Select tab using product/tab name
  var sheet = ss.getSheetByName(product);
  var row = Number(rowIndex + 2);
  var col = Number(colIndex + firstCol);
  var footer = sheet.getRange(row, col).getValue();
  // Client side functions can only return strings
  // so the array must be converted first
  return JSON.stringify(footer)
};

function doGet() {
  // Create template from index.html file
  var htmlTemplate = HtmlService.createTemplateFromFile("index");
  // Initialize template data
  var data = {};
  // Add list of products to template data
  data.products = getProducts(firstTabIndex);
  // Merge data with template
  htmlTemplate.data = data;
  // Render the template with data
  return htmlTemplate.evaluate();
};