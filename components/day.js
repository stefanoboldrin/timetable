import {
  Component,
  html
} from "https://unpkg.com/kaboobie@latest?module";

import { Logger } from "./logger.js";
const { log, error } = Logger();

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const Day = Component(day => {
  const { name, subjects, selected, date } = day;
  const classNames = ["day"];
  if (selected) {
    classNames.push("selected");
  }
  debugger
  const fDate = formatDate(date);
  const today = fDate === formatDate(new Date());
  const tomorrow = fDate === formatDate(addDays(new Date(), 1));
  const yesterday = fDate === formatDate(addDays(new Date(), -1));

  return html`
    <div class="${classNames.join(" ")}" tabindex="0" .autofocus=${selected}>
      <h3 class="name">
        ${name}
        ${today
          ? "(oggi)"
          : tomorrow
          ? "(domani)"
          : yesterday
          ? "(ieri)"
          : fDate}
      </h3>
      <div>
        ${subjects.map(subject => {
    //log(subject.name)
          return Subject(subject, date);
        })}
      </div>
    </div>
  `;
});

const Subject = Component((subject, date) => {
  const { name, start, end, isBreak } = subject;
  const interval = [start, end].join(" - ");
  const Clickable = Component(({ name, previousLessonDate }) => {
    const registro = `https://web.spaggiari.eu/cvv/app/default/regclasse.php?classe_id=950688&granular=G&data_start=${previousLessonDate}#:~:text=${encodeURIComponent(
      name
    )}`;
    const lezioni = `https://web.spaggiari.eu/fml/app/default/regclasse_lezioni_xstudenti.php#:~:text=${encodeURIComponent(
      name
    )}`;
    return html`
      ${name}
      <div class="links">
        <a href=${registro} target="_blank" rel="noreferrer">Registro</a>
        <a href=${lezioni} target="_blank" rel="noreferrer">Lezioni</a>
      </div>
    `;
  });
  const Text = Component(txt => {
    return html`
      ${txt.name}
    `;
  });
  // if(!isBreak){
  // log([name,formatDate(date),subject.daysElapsedFromPreviousLesson])

  // }
  const previousLessonDate = isBreak
    ? ""
    : formatDate(addDays(date, -subject.daysElapsedFromPreviousLesson));
  return html`
    <div class="subject" tabindex=${isBreak ? "" : 0} title=${interval}>
      <div class="name" style=${isBreak ? "color:lightgrey" : ""}>
        <${isBreak ? Text : Clickable}
          name=${name}
          previousLessonDate=${previousLessonDate}
        />
      </div>
    </div>
  `;
});

export { Day, Subject };
