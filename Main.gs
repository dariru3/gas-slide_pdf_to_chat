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
 * If today's date is in the list and okay checkbox is checked,
 * sends the message to chat.
 */
function weeklyCheckAndSend() {
  if (isTodayInDateList_() && isOkayToSend_()) {
    sendToChat();
  }
}

/**
 * Checks if the "okay to send" status in a specific cell is set to true.
 * This is used as a "kill switch" to control whether the sending process should proceed.
 * @return {boolean} - Returns true if the cell value is boolean true, indicating it's okay to send.
 */
function isOkayToSend_() {
  const sheet = connectToMainSheet_();
  const checkbox = CONFIG.checkboxCell;
  const checkboxRange = sheet.getRange(checkbox); 
  const okayToSend = checkboxRange.getValue();
  console.log(okayToSend, typeof(okayToSend))

  // Uncheck after sending
  if(okayToSend === true){
    checkboxRange.uncheck()
  }

  return okayToSend
}

/**
 * Checks if the current date exists in the specified list of dates.
 * @return {boolean} - Returns true if today's date is in the list, otherwise false.
 */
function isTodayInDateList_() {
  const dateList = getListOfDates_()

  // Get today's date
  const today = new Date();
  const formattedToday = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy/MM/dd');
  console.log(`Today's date is: ${formattedToday}`);

  // Check if today is on the list, true or false
  const isInList = dateList.includes(formattedToday);
  console.log("Is today's date in datelist?", isInList);
  
  return isInList;
}

function getListOfDates_() {
  const sheet = connectToMainSheet_();
  
  // Get list of dates
  const [startRow, startCol] = [CONFIG.dateListRowStart, CONFIG.dateListColStart];
  const lastRow = sheet.getLastRow(); // Get the last row with content
  const dateListRaw = sheet.getRange(startRow, startCol, lastRow).getValues().flat();
  console.log(dateListRaw);
  const dateList = dateListRaw.map(date => Utilities.formatDate(new Date(date), 'Asia/Tokyo', 'yyyy/MM/dd'));
  console.log(dateList)

  return dateList
}

/**
 * Retrieves the message from the specified sheet.
 * @return {string} - The retrieved message.
 */
function getMessageFromSheet_() {
  // Connect to sheet
  const sheetName = CONFIG.mainSheet;
  const messageCell = CONFIG.chatMessageCell;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  // Get and return message from cell
  const message = sheet.getRange(messageCell).getValue();
  return message;
}

function getPdfUrl_() {
  const pdfFile = saveSlideToPDF_();
  const pdfFileId = pdfFile.getId();
  DriveApp.getFileById(pdfFileId).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW);
  const pdfUrl = pdfFile.getUrl();

  return pdfUrl

}

/**
 * Sends a message with a link to the generated PDF to a Google Chat room using a webhook.
 */
function sendToChat() {
  const webhookUrl = CONFIG.webhookUrl; // Chat bot URL
  const message = getMessageFromSheet_();
  const pdfUrl = getPdfUrl_();

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
  console.log("Send to chat!")
  UrlFetchApp.fetch(webhookUrl, params);
}
