import { log } from "console";
import { publicDecrypt } from "crypto";
import express from "express";


const app = express();
const PORT = 3000;

//habit model
class habit{
  habit_id
  habit_name;
  habit_type;
  habit_progress;

  constructor(name, type , progress){this.habit_id=Math.random().toString(16).slice(10), this.habit_name=name, this.habit_type=type, this.habit_progress=progress}
}

//test data
const obj1 = new habit(1,"test","testing-type",101);


//array to store all the objects
var entries =[];
// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//create new entries
app.post("/create",(req,res)=>{

  const obj = new habit(req.body.name,req.body.type,req.body.progress);
  console.log(obj.habit_id,obj.habit_name,obj.habit_progress,obj.habit_type);
  entries.push(obj);
  res.send(obj);
});

//fetch all entries
app.get("/fetch",(req,res)=> {
  if(entries.length==0){
    res.send("There are no entries to begin use /create endpoint");
  }
  else{
      res.send(entries)
  }
});

//fetch with id 
app.get("/fetch/:id",(req,res)=>{
  
  entries.forEach(entry => {
    if(entry.habit_id==req.params.id){
      res.send(entry);
    }
    else{ 
      res.send("The given id is not found in the database")
    }
  });
});

app.get("/test",(req,res)=> {
  console.log(entries);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

