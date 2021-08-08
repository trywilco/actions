const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");

const fetch = require("node-fetch");

const runActions = async () => {
  const wilcoId = core.getInput("wilcoId", { required: true });
  const res = await fetch(
    `https://46edd159844c.ngrok.io/prs/${wilcoId}/actions`
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
