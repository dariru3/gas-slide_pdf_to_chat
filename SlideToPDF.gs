function saveSlideToPDF() {
  var slideId = 'YOUR_SLIDE_ID'; // Replace 'YOUR_SLIDE_ID' with the ID of your Google Slides presentation.
  
  // Define the URL to export the first slide as a PDF
  var url = 'https://docs.google.com/presentation/d/' + slideId + '/export/pdf?pageRanges=1';
  
  // Fetch the PDF
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  // Save the PDF to Google Drive
  DriveApp.createFile(response.getBlob()).setName('FirstSlide.pdf');
}
