const moment = require("moment");
const argv = require("minimist")(process.argv.slice(2));

let year = argv.hasOwnProperty("y") ? argv.y : moment().year();
let month = argv.hasOwnProperty("m") ? argv.m - 1 : moment().month();

let date = moment([year, month, 1]);

let last_date = date.endOf("month");

const LAST_DAY = last_date.date();

let blanks = date.startOf("month").weekday();
let full_days = new Array();

for (let i = 1; i <= blanks; i++) {
  full_days.push("  ");
}

for (let i = 1; i <= LAST_DAY; i++) {
  full_days.push(i);
}

full_days = full_days.map(function (element) {
  return element.toString().padStart(2, " ");
});

console.log(`      ${date.month() + 1}月 ${date.year()}`);
console.log("日 月 火 水 木 金 土");
for (let i = 0; i < full_days.length; i++) {
  if ((i + 1) % 7 === 0) {
    process.stdout.write(full_days[i] + "\n");
  } else {
    process.stdout.write(full_days[i] + " ");
  }
}
console.log('')
