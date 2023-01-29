class Memo {
  constructor() {
    this.storageFile = new StorageFile();
  }

  async saveNewMemo(lines) {
    const memoList = await this.makeNewMemo(lines);

    this.storageFile.save(JSON.stringify(memoList));
  }

  async makeNewMemo(lines) {
    let memolist = this.storageFile.read();
    let maxId;

    [memolist, maxId] = this.firstMemoOrNot(memolist, maxId);

    memolist.push({
      id: maxId + 1,
      memo: `${lines.join("\n")}`,
      title: `${lines[0]}`,
    });
    return memolist;
  }

  firstMemoOrNot(memolist, maxId) {
    if (memolist === "") {
      memolist = [];
      maxId = 0;
    } else {
      memolist = JSON.parse(memolist);
      maxId = Math.max(...memolist.map((p) => p.id));
    }
    return [memolist, maxId];
  }

  newMemo() {
    const readline = require("node:readline");
    const process = require("node:process");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let lines = [];
    console.log("メモを入力してください");

    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    rl.on("line", (line) => {
      lines.push(line);
    });

    rl.on("close", () => {
      this.saveNewMemo(lines);
    });
  }
}

class Option {
  constructor() {
    this.storageFile = new StorageFile();
  }

  displaytTitle() {
    const titleList = this.generateTitleList();
    console.log(titleList.join("\n"));
  }

  destroyMemo() {
    const memoList = JSON.parse(this.storageFile.read());

    const titleAndId = memoList.map((p) => ({
      name: p.id,
      message: p.title,
    }));

    const Enquirer = require("enquirer");
    (async () => {
      const question = {
        type: "select",
        name: "id",
        message: "削除するメモを選んでください",
        choices: titleAndId,
      };
      const answer = await Enquirer.prompt(question);
      const newMemos = memoList.filter((memo) => memo.id != answer.id);
      this.storageFile.save(JSON.stringify(newMemos));
    })();
  }
  showMemo() {
    const memoList = JSON.parse(this.storageFile.read());

    const titleAndContent = memoList.map((p) => ({
      name: p.memo,
      message: p.title,
    }));

    const Enquirer = require("enquirer");
    (async () => {
      const question = {
        type: "select",
        name: "content",
        message: "表示するメモを選んでください",
        choices: titleAndContent,
      };
      const answer = await Enquirer.prompt(question);
      console.log(`\n${answer.content}`);
    })();
  }

  generateTitleList() {
    const memoList = JSON.parse(this.storageFile.read());

    const titleList = memoList.map((p) => p.memo.split("\n")[0]);
    return titleList;
  }
}

class StorageFile {
  read() {
    const { readFileSync } = require("node:fs");
    this.checkExistMemosFile();
    const contents = readFileSync("./memos.json", "utf8");

    return contents;
  }

  checkExistMemosFile() {
    const fs = require("node:fs");
    const paths = fs.readdirSync("./");

    paths.find((path) => path === "memos.json")
      ? undefined
      : fs.writeFileSync("memos.json", "");
  }

  async save(data) {
    const { writeFile } = require("node:fs/promises");
    const promise = writeFile("memos.json", data);
    await promise;
    console.log("データの保存が完了しました");
  }

  delete(id) {
    const memoList = this.read();
  }
}

const exec = new Option();
const args = process.argv;

if (args.length > 3) {
  console.log("illegal option");
} else if (args.includes("-d")) {
  exec.destroyMemo();
} else if (args.includes("-r")) {
  exec.showMemo();
} else if (args.includes("-l")) {
  exec.displaytTitle();
} else {
  const main = new Memo();
  main.newMemo();
}
