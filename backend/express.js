import express from "express";

const app = express();
const PORT = 3000;

//habit model
class habit {
  #habit_id;
  #habit_name;
  #habit_type;
  #habit_progress;

  get habit_id() {
    return this.#habit_id;
  }

  set habit_id(id) {
    this.#habit_id = id;
  }

  get habit_name() {
    return this.#habit_name;
  }

  set habit_name(name) {
    this.#habit_name = name;
  }

  get habit_type() {
    return this.#habit_type;
  }

  set habit_type(type) {
    this.#habit_type = type;
  }

  get habit_progress() {
    return this.#habit_progress;
  }

  set habit_progress(progress) {
    this.#habit_progress = progress;
  }

  constructor(name, type, progress) {
    this.habit_id = Math.random().toString(16).slice(10);
    this.habit_name = name;
    this.habit_type = type;
    this.habit_progress = progress;
  }

  toJSON() {
    return {
      habit_id: this.#habit_id,
      habit_name: this.#habit_name,
      habit_type: this.#habit_type,
      habit_progress: this.#habit_progress
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
  var flag=0;
  const obj = new habit(req.body.name, req.body.type, req.body.progress);
  entries.forEach(entry => {
    if(String(entry.habit_name).toLowerCase()===String(req.body.name).toLowerCase()){
      flag=1;
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
    if (entry.habit_id == req.params.id) {
      return res.send(entry);
    }
  });
  res.send("The given id is not found in the database");
});

//Delete entry via id
app.delete("/delete/:id", (req, res) => {
    let count = 0;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].habit_id == req.params.id) {
        break;
      }
      count++;
    }
    
    const deletedEntry = entries.splice(count, 1);
    
    res.send(deletedEntry);
});

//update entries
// app.put("/update/:id", (req, res) => {
//   var flag = 0
//    let count = 0;
//     for (let i = 0; i < entries.length; i++) {
//       if (entries[i].habit_id == req.params.id) {
//         flag=1;
//         break;
//       }
//       count++;
//     }
//   !flag?res.send("The given id is not found in the database")
//   :;
// });


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
