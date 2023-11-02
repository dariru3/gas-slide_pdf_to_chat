// Note: Set manual trigger for checkDayofWeek in Apps Script dashboard: Mondays and Tuesdays at 9 AM

/**
 * This function checks if the current day is a Monday or Tuesday.
 * If it's either of those days, it creates a trigger to run the 
 * setSpecificTime_ function at 11:00 AM on the same day.
 */
function checkDayOfWeek() {
  const monday = 1;
  const tuesday = 4; // 2;
  const triggerHour = 15; // 11;
  const triggerMinute = 15; // TEST
  const date = new Date(); 
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek == monday || dayOfWeek == tuesday) { 
    deleteExistingTriggers_('setSpecificTime_');
    ScriptApp.newTrigger('setSpecificTime_')
      .timeBased()
      .atHour(triggerHour)
      .nearMinute(triggerMinute)
      .everyDays(1) // TEST
      .create();
  } 
}

/**
 * This function sets a trigger for the weeklyCheckAndSend function 
 * to run exactly at 16:00 (4:00 PM) on the current day.
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
