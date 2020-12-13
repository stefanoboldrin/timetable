import {
  Component,
  html,
  useState
} from "https://unpkg.com/kaboobie@latest?module";

import { Day } from "./day.js";
import { Logger } from "./logger.js";

const { log, error } = Logger();

const PREV = Symbol("prev");
const NEXT = Symbol("next");
const DIRS = { [PREV]: "<", [NEXT]: ">" };

const Nav = Component(({ navdir, day, setDay }) => {
  const prev = () => {
    log(`${day.name} prev ${day.previousWorkingDay.name}`)
    setDay(day.previousWorkingDay);
  };
  const next = () => {
    log(`${day.name} next ${day.nextWorkingDay.name}`)
    setDay(day.nextWorkingDay);
  };
  const onclick = navdir === PREV ? prev : next;
  return html`
    <button onclick=${onclick}>
      ${DIRS[navdir]}
    </button>
  `;
});

// each component receives its "props"
const DayNav = Component(({ day, children }) => {
  //debugger
  const [selectedDay, _setDay] = useState(day);
  //const selectedDay = day;
  //log(selectedDay.name)
  return html`
    ${children}
  `;
  
  return html`
    <${Nav} navdir=${PREV} day=${day} setDay=${_setDay} />
    ${children}
    <${Nav} navdir=${NEXT} day=${day} setDay=${_setDay} />
  `;
});

/*
<${Day}
      name=${selectedDay.name}
      subjects=${selectedDay.subjects}
      date=${date}
    />
*/

export { DayNav };
