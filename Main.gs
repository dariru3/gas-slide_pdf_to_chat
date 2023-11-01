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
