function checkDayToSend_() {
  const daysToSend = CONFIG_TRIGGERS.daysToSend;
  const dayOfWeek = new Date().getDay();

  return dayOfWeek in daysToSend; // true or false
}

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

function getTriggerHour_() {
  if (!checkDayToSend_()) {
    return null;
  }
  
  const dayHour = CONFIG_TRIGGERS.dayHour;
  const dayOfWeek = new Date().getDay();

  return dayHour[dayOfWeek] || null;
}

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