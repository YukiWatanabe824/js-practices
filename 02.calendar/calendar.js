const moment = require("moment");
const argv = require("minimist")(process.argv.slice(2));

function get_date(argv) {
  let year = Object.prototype.hasOwnProperty.call(argv, "y")
    ? argv.y
    : moment().year();
  let month = Object.prototype.hasOwnProperty.call(argv, "m")
    ? argv.m - 1
    : moment().month();
  return moment([year, month, 1]);
}

function generate_full_days(date) {
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

  return full_days;
}

function generate_calendar(date, full_days) {
  console.log(`      ${date.month() + 1}月 ${date.year()}`);
  console.log("日 月 火 水 木 金 土");
  for (let i = 0; i < full_days.length; i++) {
    if ((i + 1) % 7 === 0) {
      process.stdout.write(full_days[i] + "\n");
    } else {
      process.stdout.write(full_days[i] + " ");
    }
  }
  console.log("");
}

let date = get_date(argv);
let full_days = generate_full_days(date);
generate_calendar(date, full_days);
