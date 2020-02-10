import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { battery } from "power";
import { charger } from "power";
import * as util from "../common/utils";

import { me as appbit } from "appbit";
import userActivity from "user-activity";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const hourLabel = document.getElementById("hourLabel");
const minLabel = document.getElementById("minLabel");
const batteryLabel = document.getElementById("batteryLabel");
const caloriesLabel = document.getElementById("caloriesLabel");
const batteryFullIcon = document.getElementById("batteryFullIcon");
const battery25Icon = document.getElementById("battery25Icon");
const battery50Icon = document.getElementById("battery50Icon");
const battery75Icon = document.getElementById("battery75Icon");
const dateLabel = document.getElementById("dateLabel");
const barcelonaLabel = document.getElementById("barcelonaLabel");
const californiaLabel = document.getElementById("californiaLabel");

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var ordinal = new Array();
ordinal[1] = "st";
ordinal[2] = "nd";
ordinal[3] = "rd";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Frida", "Saturday"];

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;

  // Clock.
  let hours = today.getHours();
  let formatted_hours = 0;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    formatted_hours = hours % 12 || 12;
  } else {
    // 24h format
    formatted_hours = util.zeroPad(hours);
  }
  let mins = today.getMinutes();
  let formatted_mins = util.zeroPad(mins);
  hourLabel.text = `${formatted_hours}`;
  minLabel.text = `:${formatted_mins}`;
  
  // Battery.
  if (!charger.connected) {
    let batteryLevel = battery.chargeLevel;
    batteryLabel.text = Math.floor(batteryLevel) + "%";
    if (batteryLevel > 75) {
      batteryFullIcon.style.display = "inline";
      batteryLabel.style.display = "inline";
    } else if (batteryLevel <= 75 && batteryLevel > 50) {
      battery75Icon.style.display = "inline";
      batteryLabel.style.display = "inline";
    } else if (batteryLevel <= 50 && batteryLevel > 25) {
      battery50Icon.style.display = "inline";
      batteryLabel.style.display = "inline";
    } else if (batteryLevel <= 25 && batteryLevel >= 17) {
      battery25Icon.style.display = "inline";
      batteryLabel.style.display = "inline";
    } else {
      battery25Icon.style.display = "none";
      battery50Icon.style.display = "none";
      battery75Icon.style.display = "none";
      batteryFullIcon.style.display = "none";
      batteryLabel.style.display = "none";
    }
  } else {
    battery25Icon.style.display = "none";
    battery50Icon.style.display = "none";
    battery75Icon.style.display = "none";
    batteryFullIcon.style.display = "none";
    batteryLabel.style.display = "none";
  }
  
  // Stats.
  if (appbit.permissions.granted("access_activity")) {
    caloriesLabel.text = `${userActivity.today.adjusted.calories}`;
  }
  
  let monthnum = today.getMonth();
  let day = today.getDate();
  let ordinalText = "th";
  if (day < 4) {
    ordinalText = ordinal[day];
  }
  let dayName = days[today.getDay()];
  dateLabel.text = dayName + ", " + `${day}` + `${ordinalText}` + " " + month[monthnum];
  
  // World clock.
  let bcnHour = hours + 6;
  if (bcnHour >= 24) {
    bcnHour = bcnHour - 24;
  }
  barcelonaLabel.text = `${bcnHour}:${formatted_mins}`;
  let californiaHour = hours - 3;
  californiaLabel.text = `${californiaHour}:${formatted_mins}`;
}
