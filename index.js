const core = require("@actions/core");
const exec = require("@actions/exec");
const { promises: fs } = require("fs");

const fetch = require("node-fetch");

const runActions = async () => {
  const wilcoId = await fs.readFile(".wilco", "utf8");
  const res = await fetch(
    `https://253e98fd5e72.ngrok.io/prs/${wilcoId}/actions`
  );
  const body = await res.json();
  for (let item of body) {
    const { cmd, ...args } = item;
    core.info(`Starting: ${cmd} ${args}`);
    await exec.exec(cmd, null, args);
    core.info(`Done: ${cmd} ${args}`);
  }
};

const main = async () => {
  try {
    core.info("Starting all");
    await runActions();
    core.info("Done all");
  } catch (error) {
    core.error("Wilco checks failed");
    core.setFailed(error.message);
  }
};

main();
