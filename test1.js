const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let workplaces = [];
let shifts = [];

app.get("/", (req, res) => {
  res.send("Workplace Activity API is running");
});

app.get("/api/workplaces", (req, res) => {
  res.json(workplaces);
});

app.post("/api/workplaces", (req, res) => {
  const { name, location } = req.body;

  const newWorkplace = {
    id: workplaces.length + 1,
    name,
    location
  };

  workplaces.push(newWorkplace);

  res.status(201).json(newWorkplace);
});

app.post("/api/shifts", (req, res) => {
  const { employeeName, workplaceId, startTime, endTime } = req.body;

  const newShift = {
    id: shifts.length + 1,
    employeeName,
    workplaceId,
    startTime,
    endTime
  };

  shifts.push(newShift);

  res.status(201).json(newShift);
});

app.get("/api/shifts", (req, res) => {
  res.json(shifts);
});

app.get("/api/workplaces/most-active", (req, res) => {
  const count = {};

  shifts.forEach((shift) => {
    count[shift.workplaceId] = (count[shift.workplaceId] || 0) + 1;
  });

  const sorted = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([workplaceId, shiftCount]) => {
      const workplace = workplaces.find(w => w.id == workplaceId);
      return {
        workplace: workplace?.name || "Unknown",
        shiftCount
      };
    });

  res.json(sorted);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});