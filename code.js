// Global Variables
// Id for the footer master trix
var ssId = "1fY5Jadl0QP_H9-8DrhzCKH6SjwHZqlrMAmGHsJmUCFM";
// Index of first tab containing footer content
var firstTabIndex = 4;
// Index of first column containing footer content
var firstCol = 3;

// Global functions
// Determine if a string exists in a larger string
function checkReplaced(haystack, needle) {
  // Check if term was replaced
  if (haystack.indexOf(needle) >= 0) {
    return true;
  } else {
    return false;
  };
};
// Find the shortest string in an array
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

// Get offer types from a spreadsheet tab
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

// Get list of languages from a spreadsheet tab
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
  // Ignore languages with missing content
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

// Get footer content for specified product, offer type, and lang
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

// Filter/reformat footer content
function footerFilter(content, lang, filter) {
  // Optout copy library
  // Based on GMB footers
  // Needs to expanded
  var optout = {
  "af" : [
    "teken asseblief hier uit",
    ["teken asseblief hier uit: ${optout()}", "<a href=\"${optout()}\">teken asseblief hier uit</a>."]
    ],
  "am" : [
    "እዚህ ከደንበኝነት ምዝገባ ይውጡ",
    ["እዚህ ከደንበኝነት ምዝገባ ይውጡ: ${optout()}", "<a href=\"${optout()}\">እዚህ ከደንበኝነት ምዝገባ ይውጡ</a>."]
    ],
  "ar" : [
    "يُرجى إلغاء الاشتراك من هنا",
    ["يُرجى إلغاء الاشتراك من هنا: ${optout()}", "<a href=\"${optout()}\">يُرجى إلغاء الاشتراك من هنا</a>."]
    ],
  "bg" : [
    "отпишете се тук",
    ["отпишете се тук: ${optout()}", "<a href=\"${optout()}\">отпишете се тук</a>."]
    ],
  "bn" : [
    "এখানে সদস্যতা পরিত্যাগ করুন।",
    ["এখানে সদস্যতা পরিত্যাগ করুন।: ${optout()}", "<a href=\"${optout()}\">এখানে সদস্যতা পরিত্যাগ করুন।</a>."]
    ],
  "ca" : [
    "cancel·la'n la subscripció",
    ["cancel·leu-hi la subscripció: ${optout()}", "<a href=\"${optout()}\">cancel·leu-hi la subscripció</a>."]
    ],
  "cs" : [
    "jejich odběr zde",
    ["jejich odběr zde: ${optout()}", "<a href=\"${optout()}\">jejich odběr zde</a>."]
    ],
  "da" : [
    "kan du afmelde dem her",
    ["kan du afmelde dig her: ${optout()}", "<a href=\"${optout()}\">kan du afmelde dig her</a>."]
    ],
  "de" : [
    "melden Sie sich hier ab",
    ["sich abzumelden: ${optout()}", "<a href=\"${optout()}\">sich abzumelden</a>."]
    ],
  "el" : [
    "καταργήστε την εγγραφή σας εδώ",
    ["καταργήστε την εγγραφή σας εδώ: ${optout()}", "<a href=\"${optout()}\">καταργήστε την εγγραφή σας εδώ</a>."]
    ],
  "en_au" : [
    "unsubscribe here",
    ["unsubscribe here: ${optout()}", "<a href=\"${optout()}\">unsubscribe here</a>."],
    ["click here: ${optout()}", "<a href=\"${optout()}\">click here</a>."],
    ["clicking here: ${OptoutID}","clicking <a href=\"${OptoutID}\">here</a>."],
    ["click here to unsubscribe: ${optout()}","<a href=\"${optout()}\">click here</a> to unsubscribe."]
    ],
  "en_gb" : [
    "unsubscribe here",
    ["unsubscribe here: ${optout()}", "<a href=\"${optout()}\">unsubscribe here</a>."],
    ["click here: ${optout()}", "<a href=\"${optout()}\">click here</a>."],
    ["clicking here: ${OptoutID}","clicking <a href=\"${OptoutID}\">here</a>."],
    ["click here to unsubscribe: ${optout()}","<a href=\"${optout()}\">click here</a> to unsubscribe."]
    ],
  "en_us" : [
    "unsubscribe here",
    ["unsubscribe here: ${optout()}", "<a href=\"${optout()}\">unsubscribe here</a>."],
    ["click here: ${optout()}", "<a href=\"${optout()}\">click here</a>."],
    ["clicking here: ${OptoutID}","clicking <a href=\"${OptoutID}\">here</a>."],
    ["click here to unsubscribe: ${optout()}","<a href=\"${optout()}\">click here</a> to unsubscribe."]
    ],
  "es" : [
    "cancelar la suscripción en esta página",
    ["cpuedes anular la suscripción aquí: ${optout()}", "<a href=\"${optout()}\">cpuedes anular la suscripción aquí</a>."]
    ],
  "es-419" : [
    "puedes anular la suscripción aquí",
    ["anula la suscripción aquí: ${optout()}", "<a href=\"${optout()}\">anula la suscripción aquí</a>."]
    ],
  "et" : [
    "tühistage nende tellimus siin",
    ["tellimusest siin: ${optout()}", "<a href=\"${optout()}\">tellimusest siin</a>."]
    ],
  "eu" : [
    "kendu harpidetza hemen",
    ["kendu harpidetza hemen: ${optout()}", "<a href=\"${optout()}\">kendu harpidetza hemen</a>."]
    ],
  "fa" : [
    "کنید، لطفاً اشتراکتان را اینجا لغو کنید",
    ["کنید، لطفاً اشتراکتان را اینجا لغو کنید: ${optout()}", "<a href=\"${optout()}\">کنید، لطفاً اشتراکتان را اینجا لغو کنید</a>."]
    ],
  "fi" : [
    "peruuta tilaus täällä",
    ["peruuta tilaus täältä: ${optout()}", "<a href=\"${optout()}\">peruuta tilaus täältä</a>."]
    ],
  "fil" : [
    "mangyaring mag-unsubscribe dito",
    ["mag-unsubscribe dito: ${optout()}", "<a href=\"${optout()}\">mag-unsubscribe dito</a>."]
    ],
  "fr" : [
    "veuillez vous désabonner",
    ["vous désabonner ici : ${optout()}", "<a href=\"${optout()}\">vous désabonner ici</a>."]
    ],
  "fr_ca" : [
    "veuillez vous désabonner ici",
    ["veuillez vous désabonner ici : ${optout()}", "<a href=\"${optout()}\">veuillez vous désabonner ici</a>."]
    ],
  "gl" : [
    "cancela a subscrición aquí",
    ["cancela a subscrición aquí: ${optout()}", "<a href=\"${optout()}\">cancela a subscrición aquí</a>."]
    ],
  "gu" : [
    "કૃપા કરીને અહીં અનસબ્સ્ક્રાઇબ કરો",
    ["કૃપા કરીને અહીં અનસબ્સ્ક્રાઇબ કરો: ${optout()}", "<a href=\"${optout()}\">કૃપા કરીને અહીં અનસબ્સ્ક્રાઇબ કરો</a>."]
    ],
  "hi" : [
    "तो कृपया यहां सदस्यता छोड़ें",
    ["तो कृपया यहां सदस्यता छोड़ें: ${optout()}", "<a href=\"${optout()}\">तो कृपया यहां सदस्यता छोड़ें</a>."]
    ],
  "hr" : [
    "pretplatu otkažite ovdje",
    ["otkažite pretplatu ovdje: ${optout()}", "<a href=\"${optout()}\">otkažite pretplatu ovdje</a>."]
    ],
  "hu" : [
    "iratkozz le itt",
    ["itt iratkozhat le: ${optout()}", "<a href=\"${optout()}\">itt iratkozhat le</a>."]
    ],
  "id" : [
    "silakan berhenti berlangganan di sini",
    ["berhenti berlangganan di sini: ${optout()}", "<a href=\"${optout()}\">berhenti berlangganan di sini</a>."]
    ],
  "is" : [
    "skaltu afskrá þig hér",
    ["áskrift hér: ${optout()}", "<a href=\"${optout()}\">áskrift hér</a>."]
    ],
  "it" : [
    "annulla l'iscrizione qui",
    ["annulla l'iscrizione qui: ${optout()}", "<a href=\"${optout()}\">annulla l'iscrizione qui</a>."]
    ],
  "iw" : [
    "בטל את הרישום כאן",
    ["בטל את הרישום כאן: ${optout()}", "<a href=\"${optout()}\">בטל את הרישום כאן</a>."]
    ],
  "ja" : [
    "こちらから配信停止の手続きを行ってください",
    ["こちらから配信停止の手続きを行ってください: ${optout()}", "<a href=\"${optout()}\">こちらから配信停止の手続きを行ってください</a>。"]
    ],
  "kn" : [
    "ಇಲ್ಲಿ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್‌‌ ಮಾಡಿ",
    ["ಇಲ್ಲಿ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್‌‌ ಮಾಡಿ: ${optout()}", "<a href=\"${optout()}\">ಇಲ್ಲಿ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್‌‌ ಮಾಡಿ</a>."]
    ],
  "ko" : [
    "여기에서 수신거부를 요청하세요",
    ["여기에서 수신거부를 요청하세요: ${optout()}", "<a href=\"${optout()}\">여기에서 수신거부를 요청하세요</a>."]
    ],
  "lt" : [
    "atšaukti prenumeratą",
    ["atšaukite prenumeratą čia: ${optout()}", "<a href=\"${optout()}\">atšaukite prenumeratą čia</a>."]
    ],
  "lv" : [
    "anulējiet abonementu šeit",
    ["atteikt abonēšanu šeit: ${optout()}", "<a href=\"${optout()}\">atteikt abonēšanu šeit</a>."]
    ],
  "ml" : [
    "ഇവിടെ അൺസബ്‌സ്‌ക്രൈബ് ചെയ്യുക",
    ["ഇവിടെ അൺസബ്‌സ്‌ക്രൈബ് ചെയ്യുക: ${optout()}", "<a href=\"${optout()}\">ഇവിടെ അൺസബ്‌സ്‌ക്രൈബ് ചെയ്യുക</a>."]
    ],
  "mr" : [
    "कृपया येथे सदस्यता रद्द करा",
    ["कृपया येथे सदस्यता रद्द करा: ${optout()}", "<a href=\"${optout()}\">कृपया येथे सदस्यता रद्द करा</a>."]
    ],
  "ms" : [
    "sila nyahlanggan di sini",
    ["sila nyahlanggan di sini: ${optout()}", "<a href=\"${optout()}\">sila nyahlanggan di sini</a>."]
    ],
  "nl" : [
    "kunt u zich hier afmelden",
    ["kunt u zich hier afmelden: ${optout()}", "<a href=\"${optout()}\">kunt u zich hier afmelden</a>."]
    ],
  "no" : [
    "kan du avslutte abonnementet her",
    ["kan du avslutte abonnementet her: ${optout()}", "<a href=\"${optout()}\">kan du avslutte abonnementet her</a>."]
    ],
  "pl" : [
    "zrezygnuj z subskrypcji tutaj",
    ["możesz z nich zrezygnować tutaj: ${optout()}", "<a href=\"${optout()}\">możesz z nich zrezygnować tutaj</a>."]
    ],
  "pt_br" : [
    "cancele sua inscrição aqui",
    ["cancele a inscrição aqui: ${optout()}", "<a href=\"${optout()}\">cancele a inscrição aqui</a>."]
    ],
  "pt_pt" : [
    "anule a subscrição aqui",
    ["anule a subscrição aqui: ${optout()}", "<a href=\"${optout()}\">anule a subscrição aqui</a>."]
    ],
  "ro" : [
    "dezabonează-te aici",
    ["dezabona dând clic aici: ${optout()}", "<a href=\"${optout()}\">dezabona dând clic aici</a>."]
    ],
  "ru" : [
    "здесь",
    ["здесь: ${optout()}", "<a href=\"${optout()}\">здесь</a>."]
    ],
  "sk" : [
    "zrušte ich odber",
    ["zrušte ich odber: ${optout()}", "<a href=\"${optout()}\">zrušte ich odber</a>."]
    ],
  "sl" : [
    "se odjavite tukaj",
    ["se odjavite tukaj: ${optout()}", "<a href=\"${optout()}\">se odjavite tukaj</a>."]
    ],
  "sr" : [
    "опозовите пријаву овде",
    ["опозовите пријаву овде: ${optout()}", "<a href=\"${optout()}\">опозовите пријаву овде</a>."]
    ],
  "sv" : [
    "avsluta prenumerationen här",
    ["avsluta prenumerationen här: ${optout()}", "<a href=\"${optout()}\">avsluta prenumerationen här</a>."]
    ],
  "sw" : [
    "tafadhali jiondoe hapa",
    ["tafadhali jiondoe hapa: ${optout()}", "<a href=\"${optout()}\">tafadhali jiondoe hapa</a>."]
    ],
  "ta" : [
    "இங்கே குழுவிலகவும்",
    ["இங்கே குழுவிலகவும்: ${optout()}", "<a href=\"${optout()}\">இங்கே குழுவிலகவும்</a>."]
    ],
  "te" : [
    "దయచేసి చందాను ఇక్కడ తొలగించండి",
    ["దయచేసి చందాను ఇక్కడ తొలగించండి: ${optout()}", "<a href=\"${optout()}\">దయచేసి చందాను ఇక్కడ తొలగించండి</a>."]
    ],
  "th" : [
    "ยกเลิกการรับข่าวสารที่นี่",
    ["ยกเลิกการรับข่าวสารที่นี่: ${optout()}", "<a href=\"${optout()}\">ยกเลิกการรับข่าวสารที่นี่</a>."]
    ],
  "tr" : [
    "aboneliğinizi buradan iptal edebilirsiniz",
    ["kullanarak e-posta listesinden çıkabilirsiniz: ${optout()}", "<a href=\"${optout()}\">kullanarak e-posta listesinden çıkabilirsiniz</a>."]
    ],
  "uk" : [
    "скасуйте підписку тут",
    ["скасуйте підписку тут: ${optout()}", "<a href=\"${optout()}\">скасуйте підписку тут</a>."]
    ],
  "ur" : [
    "تو براہ کرم یہاں اَن سبسکرائب کریں۔ ",
    ["تو براہ کرم یہاں اَن سبسکرائب کریں۔ : ${optout()}", "<a href=\"${optout()}\">تو براہ کرم یہاں اَن سبسکرائب کریں۔ </a>."]
    ],
  "vi" : [
    "hủy đăng ký tại đây",
    ["hủy đăng ký tại đây: ${optout()}", "<a href=\"${optout()}\">hủy đăng ký tại đây</a>."]
    ],
  "zh_cn" : [
    "请在此处退订",
    ["请在此处退订: ${optout()}", "<a href=\"${optout()}\">请在此处退订</a>。"]
    ],
  "zh_hk" : [
    "請在此取消訂閱",
    ["請在此取消訂閱: ${optout()}", "<a href=\"${optout()}\">請在此取消訂閱</a>。"]
    ],
  "zh_tw" : [
    "請在這裡取消訂閱",
    ["請在這裡取消訂閱: ${optout()}", "<a href=\"${optout()}\">請在這裡取消訂閱</a>。"]
    ],
  "zu" : [
    "sicela uzikhiphe ohlwini lapha",
    ["sicela uzikhiphe ohlwini lapha: ${optout()}", "<a href=\"${optout()}\">sicela uzikhiphe ohlwini lapha</a>."]
    ]
  };
  if (filter.smartQuotes) {
    // Remove double quotes
    content = content.replace(/“|”/g, '"');
    // Remove single quotes
    content = content.replace(/‘|’/g, "'");
  };
  if (filter.emailAddress) {
    // Unlink email address
    content = content.replace("${EmailAddress}", "<a href=\"#\" class=\"unstyle-link\" style=\"color:inherit; cursor:text; font-size:inherit; line-height:inherit; pointer-events:none; text-decoration:none\">${EmailAddress}</a>");
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
          var contentVersion = content.replace(term[0], term[1]);
          // Check if term was replaced
          var termReplaced = checkReplaced(contentVersion, term[1]);
          if (termReplaced) {
            contentVersions.push(contentVersion);
          };
        } else {
          var newTerm = "<a href=\"${optout()}\">" + term + "</a>.";
          // REPLACE NOT WORKING
          var contentVersion = content.replace(term, newTerm);
          // Check if term was replaced
          var termReplaced = checkReplaced(contentVersion, newTerm);
          if (termReplaced) {
            contentVersions.push(contentVersion);
          };
        };
      };
      // If no matching terms found
      if (!contentVersions.length) {
        return content;
      };
      content = getShorty(contentVersions);
    } else {
      content = content.replace(terms, "<a href=\"${optout()}\">" + terms + "</a>.");
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

function renderArb(product, offertype, langs, filters) {
  // Create folder stucture
  // Create ARBs for each folder
  for (i in langs) {
    var langObj = langs[i];
    // Check for languages with region codes
    var langSplit = lang.split("_");
    var langFormatted = "";
    // If region code exists reformat to match EPT lang-REGION
    if (langSplit[1]) {
      langFormatted = langSplit[0] + "-" langSplit[1].toUpperCase();
    } else {
      langFormatted = langSplit[0];
    };

    var footer = {};
    // Get product
    footer.product = product;
    // Get offer type
    footer.offer = offerType;
    // Get language
    footer.lang = [];
    footer.lang.push(langObj[lang]);
    footer.lang.push(langObj[row]);
    // Get filters
    footer.filters = fitlers;

    var arbTemplate = HtmlService.createTemplateFromFile("arbTemplate");
    var data = {};
    // Get footer for each lang
    data.content = getFooter(footer);
    arbTemplate.data = data;
    var output = HtmlService.createHtmlOutput(arbTemplate.evaluate());
  };
  // Zip folder
  // Download zip
};