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

function getProducts(indexStart) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  var sheets = ss.getSheets();
  var tabNames = [];
  for (var i = indexStart; i < sheets.length; i++) {
    var tabName = sheets[i].getName();
    tabNames.push(tabName);
  };
  return tabNames;
};

function getOfferTypes(product) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName(product);
  var numCols = sheet.getLastColumn() - firstCol + 1;
  var offerTypes = sheet.getRange(1, firstCol, 1, numCols);
  return offerTypes.getValues();
};

function doGet() {
  // Initialize data object
  var data = {};
  // Get list of products
  data.products = getProducts(firstTabIndex);
  // Render the template
  var htmlTemplate = HtmlService.createTemplateFromFile("index");
  // Push variables to template
  htmlTemplate.data = data;
  return htmlTemplate.evaluate();
};

function selectProduct(product) {
  // Initialize data object
  var data = {};
  // Get list of products
  data.products = getProducts(firstTabIndex);
  // Get offer types for the selected product
  data.offerTypes = getOfferType(product, firstCol);
  // Render the template
  var htmlTemplate = HtmlService.createTemplateFromFile("index");
  // Render the template
  var htmlTemplate = HtmlService.createTemplateFromFile("index");
  // Push variables to template
  htmlTemplate.data = data;
  return htmlTemplate.evaluate();
};

// need to update the template vars after product is selected