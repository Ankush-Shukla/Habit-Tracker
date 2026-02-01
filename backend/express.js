import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { loadEnvFile } from "node:process";
import {nanoid} from "nanoid"

loadEnvFile("../.env");

//supabase databse config
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

//array to store all the objects

// middleware
app.use(express.json());

async function totalCount() {
  const { count, error } = await supabase
    .from("habits")
    .select("*", { count: "exact", head: true });

  return count;
}

async function validId(id) {
  const response = await supabase.from("habits").select("id").eq("id", id);
  if (response > 0) {
    return true;
  } else {
    return false;
  }
}

async function validProgressId(id) {
  const response = await supabase.from("habit_progress").select("id").eq("habit_id", id);
  console.log(response)
  if (response > 0) {
    return String(response.data.id).trim();
  } else {
    return nanoid(5).trim();
  }
}

async function validName(name) {
  const response = await supabase
    .from("habits")
    .select("name")
    .eq("name", name);
  if (response > 0) {
    return true;
  } else {
    return false;
  }
}

async function strCompare(colName, str, id) {
  const response = await supabase
    .from("habits")
    .select(colName)
    .ilike(colName, str)
    .eq("id", id);

  if (response?.length && response.data[0][colName] == str) {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
}


// root endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

//create new entries
app.post("/create", async (req, res) => {
  const { data, error } = await supabase
    .from("habits")
    .select()
    .ilike("name", req.body.name);
  console.log(data);
  if (data.length > 0) {
    res.send("A Habit with this name already exists");
  } else {
    const id = nanoid(5).trim();
    const { data, error } = await supabase
      .from("habits")
      .insert({
        id:id,
        name: req.body.name,
        type: req.body.type,
        color: req.body.color,
        category: req.body.category,
        goal: req.body.goal,
      })
      .select();
    console.log(error);
    res.send(data);
  }
});

//fetch all entries
app.get("/fetch", async (req, res) => {
  if (!(await totalCount())) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, erorr } = await supabase.from("habits").select();
    res.send(data);
  }
});

//fetch with id
app.get("/fetchById/:id", async (req, res) => {
  if ((await totalCount()) < 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, error } = await supabase
      .from("habits")
      .select()
      .eq("id", req.params.id);
    res.send(data);
  }
});

//fetch by name
app.get("/fetchByName/:name", async (req, res) => {
  if ((await totalCount()) < 0) {
res.send("There are no entries to begin use /create endpoint");;
  } else {
    const { data, error } = await supabase
      .from("habits")
      .select()
      .ilike("name", req.params.name);
    res.send(data);
  }
});

//fetch by category
app.get("/fetchByCategory/:category", async (req, res) => {
  if ((await totalCount()) < 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, error } = await supabase
      .from("habits")
      .select()
      .ilike("category", req.params.category);
    res.send(data);
  }
});

//fetch by category 
app.get("/fetchByCategory/:category", async (req, res) => {
  if ((await totalCount()) < 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, error } = await supabase
      .from("habits")
      .select()
      .ilike("category", req.params.category);
    res.send(data);
  }
});

//fetch by category 
app.get("/fetchByType/:type", async (req, res) => {
  if ((await totalCount()) < 0) {
    res.send("There are no entries to begin use /create endpoint");
  } else {
    const { data, error } = await supabase
      .from("habits")
      .select()
      .ilike("type", req.params.type);
    res.send(data);
  }
});

//Delete entry via id
app.delete("/deleteById/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("habits")
    .delete()
    .eq("id", req.params.id);
  res.send(data);
});

//Delete entry via name
app.delete("/deleteByName/:name", async (req, res) => {
  const { data, error } = await supabase
    .from("habits")
    .delete()
    .ilike("name", req.params.name);
  res.send(data);
});

//update entries by id
app.put("/updateById/:id", async (req, res) => {
  if (!validId(await req.params.id)) {
    res.send("Given id is not present in the database");
  } else {
    const response = await supabase
      .from("habits")
      .select("*")
      .eq("id", req.params.id);
    let newName,
      oldName = response.data[0].name;
    let newType,
      oldType = response.data[0].type;
    let newColor,
      oldColor = response.data[0].color;
    let newCategory,
      oldCategory = response.data[0].category;
    let newGoal,
      oldGoal = response.data[0].goal;
    let newCreatedAt = response.data[0].created_at;
    let id = req.params.id;
    if ((await strCompare("name", req.body.name, id)) || req.body.name === "") {
      newName = oldName;
    } else {
      newName = req.body.name;
    }
    if ((await strCompare("type", req.body.type, id)) || req.body.type === "") {
      newType = oldType;
    } else {
      newType = req.body.type;
    }
    if (
      (await strCompare("color", req.body.color, id)) ||
      req.body.color === ""
    ) {
      newColor = oldColor;
    } else {
      newColor = req.body.color;
    }
    if (
      (await strCompare("category", req.body.category, id)) ||
      req.body.category === ""
    ) {
      newCategory = oldCategory;
    } else {
      newCategory = req.body.category;
    }
    if ((await strCompare("goal", req.body.goal, id)) || req.body.goal === "") {
      newGoal = oldGoal;
    } else {
      newGoal = req.body.goal;
    }
    const { data, error } = await supabase
      .from("habits")
      .update({
        name: newName,
        type: newType,
        color: newColor,
        category: newCategory,
        goal: newGoal,
        created_at: newCreatedAt,
      })
      .eq("id", id)
      .select();
    res.send(data);
  }
});


//update entries by name
app.put("/updateByName/:name", async (req, res) => {
  if (!validName(req.params.name)) {
    res.send("Given name is not present in the database");
  } else {
    const response = await supabase
      .from("habits")
      .select("*")
      .eq("name", req.params.name);
    let newName,
      oldName = req.params.name;
    let newType,
      oldType = response.data[0].type;
    let newColor,
      oldColor = response.data[0].color;
    let newCategory,
      oldCategory = response.data[0].category;
    let newGoal,
      oldGoal = response.data[0].goal;
    let newCreatedAt = response.data[0].created_at;
    let id = response.data[0].id;
    if ((await strCompare("name", req.body.name, id)) || req.body.name === "") {
      newName = oldName;
    } else {
      newName = req.body.name;
    }
    if ((await strCompare("type", req.body.type, id)) || req.body.type === "") {
      newType = oldType;
    } else {
      newType = req.body.type;
    }
    if (
      (await strCompare("color", req.body.color, id)) ||
      req.body.color === ""
    ) {
      newColor = oldColor;
    } else {
      newColor = req.body.color;
    }
    if (
      (await strCompare("category", req.body.category, id)) ||
      req.body.category === ""
    ) {
      newCategory = oldCategory;
    } else {
      newCategory = req.body.category;
    }
    if ((await strCompare("goal", req.body.goal, id)) || req.body.goal === "") {
      newGoal = oldGoal;
    } else {
      newGoal = req.body.goal;
    }
    const { data, error } = await supabase
      .from("habits")
      .update({
        name: newName,
        type: newType,
        color: newColor,
        category: newCategory,
        goal: newGoal,
        created_at: newCreatedAt,
      })
      .eq("id", id)
      .select();
    res.send(data);
  }
});


// log progress
app.post("/progression/:id", async (req, res)=>{
  if(!validId(req.params.id) ){
    res.send("The given ${req.params.id} is not present in the database")
  }
  else{
    const id = await validProgressId(req.params.id)
    let { data } = await supabase
    .rpc('increment', { x: 1, row_id: id})
    console.log(data)
    if(!data?.length){
      console.log( )
      data = 0;
    }
    console.log(data)
    const d = new Date();
    const { response , error } = await supabase.from("habit_progress").upsert({"id": id,"date":d.getMonth()+1+"/"+d.getDate()+"/"+d.getFullYear(),"progress": data, "habit_id":req.params.id}).select();
    if(error){
      console.log(error)
    }
    res.send(response)
  }
});


//fetch total enries
app.get("/count", async (req, res) => {
  res.send(await totalCount());
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
