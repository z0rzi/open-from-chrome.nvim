#!/usr/bin/env -S sh -c '"`dirname $0`/bun" "$0" "$@"'

// import { sendSignal } from "./vim-signal";
// import { focusVimWindow } from "./x";
import fs from "fs";

const arg = process.argv[2];

function runServer() {
  const serv = Bun.serve({
    port: 63342,
    fetch(req) {
      // parsing url
      const url = new URL(req.url);
      const query = url.searchParams;

      const file = query.get("file");
      const line = query.get("line");

      console.log(file, line);

      setTimeout(async () => {
        // focusVimWindow();
        //
        // if (file != null && line) {
        //   // opening file in vim
        //   sendSignal(file, +line);
        // }
      }, 100);

      // sending 200 response
      return new Response("OK");
    },
  });

  setInterval(() => {
    if (getRunsAmount() === 0) {
      serv.stop();
    }
  }, 5000);
}

function getRunsAmount() {
  try {
    const runsAmount = fs.readFileSync(RUNS_FILE, "utf-8");
    return +runsAmount;
  } catch (err) {
    return 0;
  }
}

function setRunsAmount(amount: number) {
  fs.writeFileSync(RUNS_FILE, amount.toString(), "utf-8");
}

const RUNS_FILE = "/tmp/chrome-to-vim.runs";

if (arg === "start") {
  const runsAmount = getRunsAmount();

  if (runsAmount === 0) {
    // starting server
    runServer();
  }

  setRunsAmount(runsAmount + 1);
}
if (arg === "stop") {
  const runsAmount = getRunsAmount();

  setRunsAmount(runsAmount - 1);

  if (runsAmount === 1) {
    // The server will stop automatically
  }
}
