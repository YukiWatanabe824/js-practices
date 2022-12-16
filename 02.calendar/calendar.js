console.log("      12月 2022")
console.log("日 月 火 水 木 金 土")

let calendar = new Array(
"             1  2  3",
" 4  5  6  7  8  9 10",
"11 12 13 14 15 16 17",
"18 19 20 21 22 23 24",
"25 26 27 28 29 30 31"
)

for(let i in calendar){
  console.log(calendar[i]);
}

let date = new Date()
//let first_date = date(
console.log(date.getFullYear() + "年")
console.log((date.getMonth()+ 1) + "月" + date.getDate() + "日")

