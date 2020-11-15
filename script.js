import {
  Component,
  render,
  html,
  useState
} from "https://unpkg.com/kaboobie@latest?module";

const timetable = {
  days: [
    { name: "lunedì", subjects: ['italiano', 'matematica', 'inglese'] },
    { name: "martedì", subjects: ['inglese', 'matematica', 'italiano'] }
  ]
};

// each component receives its "props"
const Timetable = Component(({ days }) => {
  return html`
    <ol class="timetable">
      ${days.map(day => Day(day))}
    </ol>
  `;
});
const Day = Component(({name, subjects}) => {
  return html`
    <div class='day'>
      <div>${name}</div>
      <div>
        ${subjects.map(subject => Subject(subject))}
      </div>
    </div>
  `;
});
const Subject = Component(name => {
  return html`
    <div>${name}</div>
  `;
});

render(
  document.body,
  html`
    <${Timetable} days=${timetable.days} />
  `
);

const workweek = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì"];
