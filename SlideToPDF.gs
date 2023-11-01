function saveSlideToPDF() {
  const today = new Date();
  const todayDate = today.toLocaleDateString('ja-JP', { year: '2-digit', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '');

  const pdfFilename = todayDate + " Sales Calendar.pdf"
  const slideId = CONFIG.slideId; // Replace 'YOUR_SLIDE_ID' with the ID of your Google Slides presentation.
  const folderId = CONFIG.folderId;
  const saveFolder = DriveApp.getFolderById(folderId);
  
  // Define the URL to export the first slide as a PDF
  const url = 'https://docs.google.com/presentation/d/' + slideId + '/export/pdf?pageRanges=1';
  
  // Fetch the PDF
  const response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  // Save the PDF to Google Drive
  saveFolder.createFile(response.getBlob()).setName(pdfFilename);
}