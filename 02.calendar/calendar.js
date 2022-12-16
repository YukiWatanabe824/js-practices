const moment = require('moment');
let dt = moment();
let first_date = moment([dt.year(), dt.month(), 1])
let last_date = dt.endOf('month')

const LAST_DAY = last_date.date()

let blanks = first_date.weekday()
debugger
let full_days = new Array()

for(let i = 1; i <= blanks; i++){
  full_days.push('  ')
}

for(let i = 1; i <= LAST_DAY; i++){
  full_days.push(i)
}

full_days = full_days.map(function(element){
  return element.toString().padStart(2, ' ')
})


console.log(`      ${dt.month()+1}月 ${dt.year()}`)
console.log("日 月 火 水 木 金 土")
for(let i = 0; i < full_days.length; i++){
  if ((i + 1) % 7 === 0){
    process.stdout.write(full_days[i] + '\n')
  }else{
    process.stdout.write(full_days[i] + ' ')
  }
}
