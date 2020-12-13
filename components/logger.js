import {
  comp,
  html,
  render
} from "https://unpkg.com/hypersimple@latest?module";

const Entry = comp(
  entry => html`
    <li style='${entry.error?'color:red;':''}'>
      ${''+entry.msg}
    </li>
  `
);

const logger = comp(
  entries => html`
    <ol class='log' style='font-family: monospace, monospace;'>
      ${entries.map(entry => Entry(entry))}
    </ol>
  `
);

const entries = [];
entries.l = 0;
const Logger = function(container) {
  const thislogger = logger(entries);
  thislogger.log = function(msg) {
    entries.push({ msg: msg });
    entries.l = entries.l + 1;
    console.log(msg);
  };
  thislogger.error = function(error) {
    entries.push({ msg: JSON.stringify(error), error: true });
    entries.l = entries.l + 1;
    console.error(error);
  };
  if (container) {
    render(container, () => thislogger);
  }
  return thislogger;
};

export { Logger };
