import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { loadEnvFile } from "node:process";
loadEnvFile('../.env');
//supabase databse config
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

//array to store all the objects
var entries = [];
// middleware
app.use(express.json());

// root endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

//create new entries
app.post("/create", async (req, res) => {
  const { data, error } = await supabase
    .from("habits")
    .select()
    .eq("name", req.body.name);
  console.log(data)
  if (data.length > 0 )  {
    res.send("A Habit with this name already exists");
  } else {
   

    const { data, error } = await supabase.from("habits").insert({ name: req.body.name,
    type: req.body.type,
    color: req.body.color,
    category: req.body.category,
    goal: req.body.goal}).select();
    console.log(error);
    res.send(data);
  }
});

//fetch all entries
app.get("/fetch", async (req, res) => {
  if (entries.length == 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, erorr } = await supabase.from(habits).select();
    res.send(data);
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
app.get("/count", async (req, res) => {
  const { count, error } = await supabase
    .from("habits")
    .select("*", { count: "exact", head: true });
  res.send(count);
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
