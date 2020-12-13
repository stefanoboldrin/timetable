import {
  render,
  html,
  useState
} from "https://unpkg.com/kaboobie@latest?module";

import { Timetable } from "./components/timetable.js";
import { Day } from "./components/day.js";
import { DayNav } from "./components/daynav.js";
import { Logger } from "./components/logger.js";

const { log, error } = Logger(document.querySelector("footer"));
window.onerror = error;

(async function() {
  async function getTimetable() {
    async function fetchJSON(jsonurl) {
      const resp = await fetch(jsonurl /*+'?'+Date.now()*/);
      return resp.json();
    }

    const timetable = await fetchJSON("./data/timetable.json"); // {days: {lunedì: ["italiano",...]}}
    const workweek = await fetchJSON("./data/workweek.json"); // ["lunedì", "martedì", ...]
    const plainIntervals = await fetchJSON("./data/intervals.json"); // ['8','9',...]
    const intervals = plainIntervals.map((startHour, idx) => {
      return { start: startHour, end: plainIntervals[idx + 1] };
    }); // [{start:8,end:9},{start:9,end:10},...]
    intervals.length--;
    const breaks = new Set(timetable.breaks);

    const timetableModel = {
      days: workweek.map((dayname, dayIdx) => {
        const subjects = timetable.days[dayname];
        const today = new Date();
        const todayIdx = today.getDay();

        const isToday = todayIdx === dayIdx;

        return {
          name: dayname,
          today: isToday,
          workingday: subjects.length > 0,
          get selected() {
            if (!this.workingday) {
              return false;
            }

            if (isToday) {
              const endOfTheDay = intervals[subjects.length - 1].end;
              return today.getHours() < endOfTheDay;
            }

            const prevWorkingDay = this.previousWorkingDay;
            return prevWorkingDay.today && !prevWorkingDay.selected;
          },
          get previousWorkingDay() {
            let prevDay = this.previousDay;
            let guard = 0;
            while (!prevDay.workingday) {
              prevDay = prevDay.previousDay;
              guard++;
              if (guard > workweek.length) {
                throw new Error(
                  "No working days found in week. Add a subject to a day at least, please."
                );
              }
            }
            return prevDay;
          },
          get nextWorkingDay() {
            let nextDay = this.nextDay;
            let guard = 0;
            while (!nextDay.workingday) {
              nextDay = nextDay.nextDay;
              guard++;
              if (guard > workweek.length) {
                throw new Error(
                  "No working days found in week. Add a subject to a day at least, please."
                );
              }
            }
            return nextDay;
          },
          get nextDay() {
            const days = timetableModel.days;
            const nextDayIdx = dayIdx === days.length - 1 ? 0 : dayIdx + 1;
            return days[nextDayIdx];
          },
          get previousDay() {
            const days = timetableModel.days;
            const prevDayIdx = dayIdx > 0 ? dayIdx - 1 : days.length - 1;
            return days[prevDayIdx];
          },
          get end() {
            const subjects = this.subjects;
            if (!subjects.length) {
              return { hours: 0, minutes: 0 };
            }
            const [hours, minutes] = subjects[
              subjects.length - 1 /* last subject */
            ].end
              .split(":")
              .map(v => parseInt(v, 10));
            return { hours, minutes };
          },
          hasSubject: function(subjectname) {
            return this.subjects.some(({ name }) => name === subjectname);
          },
          subjects: subjects.map((subjectName, idx) => {
            return {
              name: subjectName,
              start: intervals[idx].start,
              end: intervals[idx].end,
              isBreak: breaks.has(subjectName),
              get daysElapsedFromPreviousLesson() {
                let daysElapsed = 1;
                let prevDay = timetableModel.days[dayIdx].previousDay;
                while (!prevDay.hasSubject(subjectName)) {
                  daysElapsed++;
                  prevDay = prevDay.previousDay;
                }
                return daysElapsed;
              }
            };
          })
        };
      })
    };
    return timetableModel;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const timetable = await getTimetable();
  const now = new Date();
  const todayIdx = now.getDay();
  const nowHours = now.getHours();
  const today = timetable.days[todayIdx];
  const { hours: todayEndHours, minutes: todayEndMinutes } = today.end;

  /*render(
    document.querySelector("main"),
    html`
      <${Timetable} days=${timetable.days} />
    `
  );*/

  const selectedDay =
    nowHours === todayEndHours
      ? now.getMinutes() >= todayEndMinutes
        ? today.nextWorkingDay
        : today
      : nowHours > todayEndHours
      ? today.nextWorkingDay
      : today;

  const selectedDayIdx = timetable.days.findIndex((day, dayIdx) => {
    return day.name === selectedDay.name;
  });
  const diffDays =
    selectedDayIdx < todayIdx /* nuova settimana */
      ? selectedDayIdx -
        todayIdx /* negativo */ +
        timetable.days.length /* 7 giorni della settimana */
      : selectedDayIdx - todayIdx;
  const selectedDayDate = addDays(now, diffDays);

  //log(DayNav)
  //log(selectedDay.subjects.length)

  render(
    document.querySelector("main"),
    html`
      <${DayNav} day=${selectedDay}>
        <${Day}
          name=${selectedDay.name}
          subjects=${selectedDay.subjects}
          date=${selectedDayDate}
        />
      <//>
    `
  );

  /*render(
    document.querySelector("main"),
    html`
      <${Day}
        name=${selectedDay.name}
        subjects=${selectedDay.subjects}
        date=${tomorrow}
      />
    `
  );*/
})();
