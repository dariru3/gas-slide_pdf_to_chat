/**
 * Creates a custom menu in the Google Sheet UI 
 * with an option to manually trigger the 'dailyCheckAndSend' function.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Manual Send')
    .addItem('Send Message+PDF', 'weeklyCheckAndSend')
    .addToUi();
}

/**
 * Checks if the current date exists in the specified list of dates.
 * @return {boolean} - Returns true if today's date is in the list, otherwise false.
 */
function isTodayInDateList_() {
  // Connect to sheet
  const sheetName = CONFIG.dateListSheet;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  // Get list of dates
  const lastRow = sheet.getLastRow(); // Get the last row with content
  const dateListRaw = sheet.getRange(1, 1, lastRow).getValues().flat();
  const dateList = dateListRaw.map(date => Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd'));
  console.log(`date list: ${dateList}`);

  // Get today's date
  const today = new Date();
  const formattedToday = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy/MM/dd');
  console.log(`Today's date is: ${formattedToday}`);

  // Check if today is on the list, true or false
  const isInList = dateList.includes(formattedToday);
  
  return isInList;
}

/**
 * Triggered weekly (Monday and Tuesday in case of Monday holiday). 
 * If today's date is in the list, sends the message to chat.
 */
function weeklyCheckAndSend() {
  if (isTodayInDateList_()) {
    sendToChat_();
  }
}

/**
 * Retrieves the message from the specified sheet.
 * @return {string} - The retrieved message.
 */
function getMessageFromSheet_() {
  // Connect to sheet
  const sheetName = CONFIG.chatMessageSheet;
  const messageCell = 'A1';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  // Get and return message from cell
  const message = sheet.getRange(messageCell).getValue();
  return message;
}

/**
 * Sends a message with a link to the generated PDF to a Google Chat room using a webhook.
 */
function sendToChat_() {
  const webhookUrl = CONFIG.webhookUrl; // Chat bot URL
  const message = getMessageFromSheet_();

  // Create the PDF and get its Google Drive URL
  const pdfFile = saveSlideToPDF_();
  const pdfFileId = pdfFile.getId();
  DriveApp.getFileById(pdfFileId).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW);
  const pdfUrl = pdfFile.getUrl();

  const fullMessage = message + "\n\n" + pdfUrl; // Combine message with PDF URL

  // Send to chat
  const payload = {
    text: fullMessage
  };
  
  const params = {
    method: "POST",
    contentType: "application/json; charset=utf-8",
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(webhookUrl, params);
}
