const core = require("@actions/core");
const exec = require("@actions/exec");
const { promises: fs } = require("fs");

const host =
  core.getInput("owner") === "Staging-ObelusFamily"
    ? "https://a8f9-81-5-58-53.ngrok.io"
    : "https://wilco-engine.herokuapp.com";

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
