const core = require("@actions/core");
const exec = require("@actions/exec");
const { promises: fs } = require("fs");

const host = "https://fca9-84-229-251-246.ngrok.io"

const fetch = require("node-fetch");

const runCommands = async (item) => {
  if (item.hasOwnProperty("or")) {
    let lastError;
    for (let cmd of item.or) {
      try {
        await runCommands(cmd);
        // One successed, we're good
        return;
      } catch (e) {
        lastError = e;
      }
    }
    if (lastError) {
      throw lastError;
    }
  } else if (Array.isArray(item)) {
    for (let cmd of item) {
      await runCommands(cmd);
    }
  } else {
    const { cmd, ...args } = item;
    await exec.exec(cmd, null, args);
  }
};

const runActions = async () => {
  const wilcoId = await fs.readFile(".wilco", "utf8");
  const res = await fetch(`${host}/prs/${wilcoId}/actions`);
  const body = await res.json();
  await runCommands(body);
};

const main = async () => {
  try {
    await runActions();
  } catch (error) {
    core.error("Wilco checks failed");
    core.setFailed(error.message);
  }
};

main();
