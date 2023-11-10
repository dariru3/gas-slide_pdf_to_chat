// Note: Set manual trigger for checkDayofWeek in Apps Script dashboard: Mondays and Tuesdays at 9 AM

/**
 * Checks if the "okay to send" status in a specific cell is set to true.
 * This is used as a "kill switch" to control whether the sending process should proceed.
 * @return {boolean} - Returns true if the cell value is boolean true, indicating it's okay to send.
 */
function isOkayToSend_() {
  // Connect to spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.mainSheet);
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
 * This function checks if the current day is a Monday or Tuesday.
 * If it's either of those days, it creates a trigger to run the 
 * setSpecificTime_ function at 11:00 AM on the same day.
 */
function checkDayOfWeek() {
  const monday = 1;
  const tuesday = 2;
  const triggerHour = 11;
  const triggerMinute = 0;
  const date = new Date(); 
  console.log(date)
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek == monday || dayOfWeek == tuesday) { 
    deleteExistingTriggers_('setSpecificTime_');
    date.setHours(triggerHour, triggerMinute, 0, 0);
    console.log(date)
    ScriptApp.newTrigger('setSpecificTime_')
      .timeBased()
      .at(date)
      .create();
  } 
}

/**
 * This function sets a trigger for the weeklyCheckAndSend function 
 * to run exactly at 16:00 on the current day.
 */
function setSpecificTime_() {
  const triggerHour = 16;
  const triggerMinute = 0;
  let date = new Date();
  date.setHours(triggerHour);
  date.setMinutes(triggerMinute);
  
  deleteExistingTriggers_('weeklyCheckAndSend');
  ScriptApp.newTrigger('weeklyCheckAndSend')
    .timeBased()
    .at(date)
    .create();
}

/**
 * This function deletes all existing triggers associated with a specified function.
 * @param {string} funcName - The name of the function for which to delete associated triggers.
 */
function deleteExistingTriggers_(funcName) {
  const triggers = ScriptApp.getProjectTriggers();
  
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === funcName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
