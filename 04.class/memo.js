class MemoGetter {
  constructor() {
    this.storageFile = new StorageFile();
  }

  generateTitleList() {
    const memoList = this.storageFile.read();

    const titleList = memoList.map((p) => p.memo.split("\n")[0]);
    return titleList;
  }

  displayTitle() {
    const titleList = this.generateTitleList();
    console.log(titleList.join("\n"));
  }

  showMemo() {
    const memoList = this.storageFile.read();

    const titleAndContent = memoList.map((p) => ({
      name: p.title,
      message: p.title,
      value: p.memo,
    }));

    const Enquirer = require("enquirer");
    (async () => {
      const question = {
        type: "select",
        name: "value",
        message: "表示するメモを選んでください",
        choices: titleAndContent,
        result() {
          return this.focused.value;
        },
      };
      const answer = await Enquirer.prompt(question);
      console.log(answer.value);
    })();
  }

  async saveNewMemo(lines) {
    const memoList = await this.makeNewMemo(lines);

    await this.storageFile.save(memoList);
    console.log("データの保存が完了しました");
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
      maxId = Math.max(...memolist.map((p) => p.id));
    }
    return [memolist, maxId];
  }
}

class MemoEditer {
  constructor() {
    this.storageFile = new StorageFile();
  }

  createMemo() {
    const readline = require("node:readline");
    const process = require("node:process");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let lines = [];

    if (process.stdin.isTTY) {
      console.log("メモを入力してください");
    }

    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    rl.on("line", (line) => {
      lines.push(line);
    });

    rl.on("close", () => {
      const memoGetter = new MemoGetter();
      memoGetter.saveNewMemo(lines);
    });
  }

  destroyMemo() {
    const memoList = this.storageFile.read();

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
      this.storageFile.delete(memoList, answer.id);
      console.log("メモを削除しました");
    })();
  }
}

class StorageFile {
  read() {
    const { readFileSync } = require("node:fs");
    this.checkExistMemosFile();
    const memolist = readFileSync("./memos.json", "utf8");

    if (memolist === "") {
      return memolist;
    } else {
      return JSON.parse(memolist);
    }
  }

  checkExistMemosFile() {
    const fs = require("node:fs");
    const paths = fs.readdirSync("./");

    paths.find((path) => path === "memos.json")
      ? undefined
      : fs.writeFileSync("memos.json", "");
  }

  async save(data) {
    data = JSON.stringify(data);
    const { writeFile } = require("node:fs/promises");
    const promise = writeFile("memos.json", data);
    return promise;
  }

  async delete(memoList, memoId) {
    const newMemos = memoList.filter((memo) => memo.id != memoId);
    return this.save(newMemos);
  }
}

const memoEditer = new MemoEditer();
const memoGetter = new MemoGetter();
const args = process.argv;

if (args.length > 3) {
  console.log("illegal option");
} else if (args.includes("-d")) {
  memoEditer.destroyMemo();
} else if (args.includes("-r")) {
  memoGetter.showMemo();
} else if (args.includes("-l")) {
  memoGetter.displayTitle();
} else {
  memoEditer.createMemo();
}
