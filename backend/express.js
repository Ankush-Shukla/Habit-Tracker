import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

//habit model
class habit {
  #habitId;
  #habitName;
  #habitType;
  #habitProgress;

  get habitId() {
    return this.#habitId;
  }

  set habitId(id) {
    this.#habitId = id;
  }

  get habitName() {
    return this.#habitName;
  }

  set habitName(name) {
    this.#habitName = name;
  }

  get habitType() {
    return this.#habitType;
  }

  set habitType(type) {
    this.#habitType = type;
  }

  get habitProgress() {
    return this.#habitProgress;
  }

  set habitProgress(progress) {
    this.#habitProgress = progress;
  }

  constructor(name, type, progress) {
    this.habitId = Math.random().toString(16).slice(10);
    this.habitName = name;
    this.habitType = type;
    this.habitProgress = progress;
  }

  toJSON() {
    return {
      habitId: this.#habitId,
      habitName: this.#habitName,
      habitType: this.#habitType,
      habitProgress: this.#habitProgress,
    };
  }
}

//array to store all the objects
var entries = [];
// middleware
app.use(express.json());

// root endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

//create new entries
app.post("/create", (req, res) => {
  var flag = 0;
  const obj = new habit(req.body.name, req.body.type, req.body.progress);
  entries.forEach((entry) => {
    if (
      String(entry.habitName).toLowerCase() ===
      String(req.body.name).toLowerCase()
    ) {
      flag = 1;
    }
  });
  if (flag) {
    res.send("A Habit with this name already exists");
  } else {
    entries.push(obj.toJSON());

    res.send(obj);
  }
});

//fetch all entries
app.get("/fetch", (req, res) => {
  if (entries.length == 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    res.send(entries);
  }
});

//fetch with id
app.get("/fetch/:id", (req, res) => {
  entries.forEach((entry) => {
    if (entry.habitId == req.params.id) {
      return res.send(entry);
    }
  });
  res.send("The given id is not found in the database");
});

//Delete entry via id
app.delete("/deleteById/:id", (req, res) => {
  let count = 0;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].habitId == req.params.id) {
      break;
    }
    count++;
  }

  const deletedEntry = entries.splice(count, 1);

  res.send(deletedEntry);
});

//Delete entry via name
app.delete("/deleteByName/:name", (req, res) => {
  let count = 0;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].habitName == req.params.name) {
      break;
    }
    count++;
  }

  const deletedEntry = entries.splice(count, 1);

  res.send(deletedEntry);
});

//Delete entry via id
app.delete("/deleteById/:id", (req, res) => {
  let count = 0;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].habitId == req.params.id) {
      break;
    }
    count++;
  }

  const deletedEntry = entries.splice(count, 1);

  res.send(deletedEntry);
});

//update entries by id
app.put("/updateById/:id", (req, res) => {
  let found = 0;

  for (let index = 0; index < entries.length; index++) {
    if (entries[index].habitId === req.params.id) {
      found = 1;

      if (req.body.name == "" || req.body.name == null) {
        console.log("old name is set");
      } else {
        entries[index].habitName = req.body.name;
        console.log("new name is set");
      }

      if (req.body.type == "" || req.body.type == null) {
        console.log("old type is set");
      } else {
        entries[index].habitType = req.body.type;
        console.log("new type is set");
      }
      console.log("no id found");

      if (req.body.progress == "" || req.body.progress == null) {
        console.log("old progress is set");
      } else {
        entries[index].habitProgress = req.body.progress;
        console.log("new progress is set");
      }
      return res.send(entries[index]);
    }
  }
  if (!found) return res.send("no id match found");
});

//update entries by name
app.put("/updateByName/:name", (req, res) => {
  let found = 0;
  console.log("/update called with name : " + req.params.name);

  for (let index = 0; index < entries.length; index++) {
    if (entries[index].habitName === req.params.name) {
      found = 1;
      if (req.body.name == "" || req.body.name == null) {
        console.log("old name is set");
      } else {
        entries[index].habitName = req.body.name;
        console.log("new name is set");
      }

      if (req.body.type == "" || req.body.type == null) {
        console.log("old type is set");
      } else {
        entries[index].habitType = req.body.type;
        console.log("new type is set");
      }
      console.log("no id found");

      if (req.body.progress == "" || req.body.progress == null) {
        console.log("old progress is set");
      } else {
        entries[index].habitProgress = req.body.progress;
        console.log("new progress is set");
      }
      return res.send(entries[index]);
    }
  }
  if (!found) return res.send("no name match found");
});

//fetch total enries
app.get("/count", (req, res) => {
  res.send(entries.length);
});

//redundant endpoint for testing
app.get("/test", (req, res) => {
  console.log(entries);
  res.sendStatus(200);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

