import { Component, html } from "https://unpkg.com/kaboobie@latest?module";

import { Day } from "./day.js";

// each component receives its "props"
const Timetable = Component(({ days }) => {
  return html`
    <div class="timetable">
      <h2 class="name">Orario</h2>
      <div>
        ${days
          .filter(({ subjects }) => subjects.length > 0)
          .map(day => Day(day))}
      </div>
    </div>
  `;
});

export { Timetable };
