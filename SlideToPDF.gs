function saveSlideToPDF_() {
  // Get date and set filename
  const today = new Date();
  const todayDate = today.toLocaleDateString('ja-JP', { year: '2-digit', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '');
  const pdfFilename = todayDate + " Sales Calendar.pdf"

  // Connect to slide and save folder
  const slideId = CONFIG.slideId; // Replace 'YOUR_SLIDE_ID' with the ID of your Google Slides presentation.
  const folderId = CONFIG.folderId;
  const saveFolder = DriveApp.getFolderById(folderId);
  
  // Define the URL to export the first slide as a PDF
  const url = 'https://docs.google.com/presentation/d/' + slideId + '/export/pdf?pageRanges=1'; // Export first slide (pageRanges)
  
  // Fetch the PDF
  const response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  // Save the PDF to Google Drive folder
  return saveFolder.createFile(response.getBlob()).setName(pdfFilename);
}