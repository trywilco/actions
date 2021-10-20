const core = require("@actions/core");
const exec = require("@actions/exec");
const { promises: fs } = require("fs");

const fetch = require("node-fetch");

const runActions = async () => {
  const wilcoId = await fs.readFile(".wilco", "utf8");
  const res = await fetch(
    `https://d195-46-117-183-63.ngrok.io/prs/${wilcoId}/actions`
  );
  const body = await res.json();
  for (let item of body) {
    const { cmd, ...args } = item;
    await exec.exec(cmd, null, args);
  }
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
