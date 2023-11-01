function isTodayInDateList() {
  const sheetName = '配信日時';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  const lastRow = sheet.getLastRow(); // Get the last row with content
  const dateListRaw = sheet.getRange(1, 1, lastRow).getValues().flat(); // Adjust the range based on lastRow
  const dateList = dateListRaw.map(date => Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd'));

  console.log(`date list: ${dateList}`);

  const today = new Date();
  const formattedToday = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy/MM/dd');

  console.log(`Today's date is: ${formattedToday}`);

  const isInList = dateList.includes(formattedToday);
  if(isInList) {
    console.log(`Today's date is in the list.`);
  } else {
    console.log(`Today's date is not in the list.`);
  }

  return isInList;
}

function dailyCheckAndSend() {
  if (isTodayInDateList()) {
    sendToChat();
  }
}

function getMessageFromSheet() {
  const sheetName = 'チャット文章';
  const messageCell = 'A1';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const message = sheet.getRange(messageCell).getValue();
  return message;
}

function sendToChat() {
  const webhookUrl = CONFIG.webhookUrl; // Store this in your CONFIG object or another safe place
  const message = getMessageFromSheet();

  // Create the PDF and get its Google Drive URL
  const pdfFile = saveSlideToPDF(); // Assuming this function returns the created file
  const pdfUrl = pdfFile.getUrl();

  const fullMessage = message + "\n\n" + pdfUrl; // Using Markdown-style link format

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
