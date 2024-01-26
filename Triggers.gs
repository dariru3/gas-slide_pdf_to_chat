/**
 * Checks if the current day is one of the designated days to send.
 * @returns {boolean} True if the current day is a day to send, otherwise false.
 */
function checkDayToSend_() {
  const daysToSend = CONFIG_TRIGGERS.daysToSend;
  const dayOfWeek = new Date().getDay();

  return dayOfWeek in daysToSend;
}

/**
 * Sets a trigger for the setSpecificTime_ function at the first trigger hour 
 * if it is a day to send.
 */
function triggerSpecificTime() {
  const triggerHour = CONFIG_TRIGGERS.firstTriggerHour;
  const dayToSend = checkDayToSend_();

  if (dayToSend) {
    const date = new Date(); 
    deleteExistingTriggers_('setSpecificTime_');
    date.setHours(triggerHour, 0, 0, 0);
    console.log(date)
    ScriptApp.newTrigger('setSpecificTime_')
      .timeBased()
      .at(date)
      .create();
  } else {
    return;
  }
}

/**
 * Determines the specific hour to trigger an event based on the current day.
 * @returns {number|null} The hour to trigger the event or null if it's not a day to send.
 */
function getTriggerHour_() {
  if (!checkDayToSend_()) {
    return null;
  }
  
  const dayHour = CONFIG_TRIGGERS.dayHour;
  const dayOfWeek = new Date().getDay();

  return dayHour[dayOfWeek] || null;
}

/**
 * Sets a trigger for the weeklyCheckAndSend function at a specific time 
 * based on the current day.
 */
function setSpecificTime_() {
  const date = new Date();
  const triggerHour = getTriggerHour_();
  date.setHours(triggerHour, 0, 0, 0);
  
  deleteExistingTriggers_('weeklyCheckAndSend');
  ScriptApp.newTrigger('weeklyCheckAndSend')
    .timeBased()
    .at(date)
    .create();
}

/**
 * Deletes all existing triggers associated with a specified function.
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
