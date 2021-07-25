const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

const test = async () => {
  const res = await fetch("https://46edd159844c.ngrok.io/prs/check");
  const body = await res.text();

  console.log({ body });
};

try {
  console.log("starting");
  // `who-to-greet` input defined in action metadata file
  // const nameToGreet = core.getInput("who-to-greet");
  // console.log(`Hello ${nameToGreet}!`);
  test();
  // const time = new Date().toTimeString();
  // core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const number = github.context.issue.number;
  console.log({ number });
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  // core.setFailed(error.message);
}
