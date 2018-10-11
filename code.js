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
};

// Global functions
function checkReplaced(haystack, needle) {
  Logger.log(haystack.indexOf(needle));
  // Check if term was replaced
  if (haystack.indexOf(needle) >= 0) {
    return true;
  } else {
    return false;
  };
};
function getShorty(list) {
  var listLengths = [];
  for (i in list) {
    listLengths.push(list[i].length);
  };
  var shortest = Math.min(...listLengths);
  var shortestIndex = listLengths.indexOf(shortest);
  return list[shortestIndex];
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

function getLangs(footer) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Select tab using product/tab name
  var sheet = ss.getSheetByName(footer.product);
  // Get number of rows
  var numRows = sheet.getLastRow() - 1;
  // Get langs
  var langsRange = sheet.getRange(2, 1, numRows, 2);
  var langs = langsRange.getValues();
  // Get offer column
  var col = Number(footer.offer) + firstCol;
  // Get content
  var footersRange = sheet.getRange(2, col, numRows, 1);
  var footers = footersRange.getValues();
  var validLangs = [];
  for (var i = 0; i < numRows; i++) {
    if(footers[i].toString().trim()) {
      validLangs.push(
        {
          "row" : i + 2,
          "langCode" : langs[i][0],
          "langName" : langs[i][1],
        }
      );
    };
  };
  // Stringify array
  return JSON.stringify(validLangs);
};

function getFooter(footer) {
  // Get spreadsheet
  var ss = SpreadsheetApp.openById(ssId);
  // Select tab using product/tab name
  var sheet = ss.getSheetByName(footer.product);
  var lang = footer.lang.split(",");
  var row = Number(lang[0]);
  var col = Number(footer.offer) + firstCol;
  var footerContent = sheet.getRange(row, col).getValue();
  // Filter footer content based on user options
  footerContent = footerFilter(footerContent, lang[1], footer.filters);
  // Stringify content
  return JSON.stringify(footerContent)
};

function footerFilter(content, lang, filter) {
  // Optout copy library
  // Based on GMB footers
  // Needs to expanded
  var optout = {
    "af" : "teken asseblief hier uit",
    "am" : "እዚህ ከደንበኝነት ምዝገባ ይውጡ",
    "ar" : "يُرجى إلغاء الاشتراك من هنا",
    "bg" : "отпишете се тук",
    "bn" : "এখানে সদস্যতা পরিত্যাগ করুন।",
    "ca" : "cancel·la'n la subscripció",
    "cs" : "jejich odběr zde",
    "da" : "kan du afmelde dem her",
    "de" : "melden Sie sich hier ab",
    "el" : "καταργήστε την εγγραφή σας εδώ",
    "en_gb" : [
                "unsubscribe here",
                ["unsubscribe here: ${optout()}", "unsubscribe here"],
                ["click here: ${optout()}", "click here"]
              ],
    "en_us" : [
                "unsubscribe here",
                ["unsubscribe here: ${optout()}", "unsubscribe here"],
                ["click here: ${optout()}", "click here"]
              ],
    "es" : "cancelar la suscripción en esta página",
    "es-419" : "puedes anular la suscripción aquí",
    "et" : "tühistage nende tellimus siin",
    "eu" : "kendu harpidetza hemen",
    "fa" : "کنید، لطفاً اشتراکتان را اینجا لغو کنید",
    "fi" : "peruuta tilaus täällä",
    "fil" : "mangyaring mag-unsubscribe dito",
    "fr" : "veuillez vous désabonner",
    "fr_ca" : "veuillez vous désabonner ici",
    "gl" : "cancela a subscrición aquí",
    "gu" : "કૃપા કરીને અહીં અનસબ્સ્ક્રાઇબ કરો",
    "hi" : "तो कृपया यहां सदस्यता छोड़ें",
    "hr" : "pretplatu otkažite ovdje",
    "hu" : "iratkozz le itt",
    "id" : "silakan berhenti berlangganan di sini",
    "is" : "skaltu afskrá þig hér",
    "it" : "annulla l'iscrizione qui",
    "iw" : "בטל את הרישום כאן",
    "ja" : "こちらから配信停止の手続きを行ってください",
    "kn" : "ಇಲ್ಲಿ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್‌‌ ಮಾಡಿ",
    "ko" : "여기에서 수신거부를 요청하세요",
    "lt" : "atšaukti prenumeratą",
    "lv" : "anulējiet abonementu šeit",
    "ml" : "ഇവിടെ അൺസബ്‌സ്‌ക്രൈബ് ചെയ്യുക",
    "mr" : "कृपया येथे सदस्यता रद्द करा",
    "ms" : "sila nyahlanggan di sini",
    "nl" : "kunt u zich hier afmelden",
    "no" : "kan du avslutte abonnementet her",
    "pl" : "zrezygnuj z subskrypcji tutaj",
    "pt_br" : "cancele sua inscrição aqui",
    "pt_pt" : "anule a subscrição aqui",
    "ro" : "dezabonează-te aici",
    "ru" : "здесь",
    "sk" : "zrušte ich odber",
    "sl" : "se odjavite tukaj",
    "sr" : "опозовите пријаву овде",
    "sv" : "avsluta prenumerationen här",
    "sw" : "tafadhali jiondoe hapa",
    "ta" : "இங்கே குழுவிலகவும்",
    "te" : "దయచేసి చందాను ఇక్కడ తొలగించండి",
    "th" : "ยกเลิกการรับข่าวสารที่นี่",
    "tr" : "aboneliğinizi buradan iptal edebilirsiniz",
    "uk" : "скасуйте підписку тут",
    "ur" : "تو براہ کرم یہاں اَن سبسکرائب کریں۔ ",
    "vi" : "hủy đăng ký tại đây",
    "zh_cn" : "请在此处退订",
    "zh_hk" : "請在此取消訂閱",
    "zh_tw" : "請在這裡取消訂閱",
    "zu" : "sicela uzikhiphe ohlwini lapha"
  };
  if (filter.smartQuotes) {
    // Remove double quotes
    content = content.replace(/“|”/g, '"');
    // Remove single quotes
    content = content.replace(/‘|’/g, "'");
  };
  if (filter.optoutLink) {
    var terms = optout[lang];
    // Check if there are multiple optout terms
    if (Array.isArray(terms)) {
      // Initialize list of possible content
      var contentVersions = [];
      for (i in terms) {
        var term = terms[i];
        // Check if optout URL already exists in term
        if (Array.isArray(term)) {
          // Replace optout URL with hyperlinked version
          var newTerm = "<a href=\"${optout}\">" + term[1] + "</a>";
          var contentVersion = content.replace(term[0], newTerm);
          var contentLength = contentVersion.length;
          // Check if term was replaced
          var termReplaced = checkReplaced(contentVersion, newTerm);
          if (termReplaced) {
            contentVersions.push({contentLength: contentVersion});
          };
        } else {
          var newTerm = "<a href=\"${optout}\">" + term + "</a>";
          // REPLACE NOT WORKING
          var contentVersion = content.replace(term, newTerm);
          var contentLength = contentVersion.length;
          // Check if term was replaced
          var termReplaced = checkReplaced(contentVersion, newTerm);
          if (termReplaced) {
            contentVersions.push({contentLength: contentVersion});
          };
        };
      };
      // If no matching terms found
      if (!contentVersions.length) {
        return content;
      };
      content = getShorty(contentVersions);
    } else {
      content = content.replace(terms, "<a href=\"${optout}\">" + terms + "</a>");
      // If no matching terms found
      if (!termReplaced) {
        return content;
      };
    };
  };
  return content;
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
  var output = HtmlService.createHtmlOutput(htmlTemplate.evaluate());
  // Set favicon and title
  // output.setFaviconUrl('https://services.google.com/fh/files/emails/proofing_tool_favicon_128x128.png');
  output.setTitle("go/Footer2 - Email Footer Tool");
  return output;
};