var arr = [
  {
    habit_id: "a3e498",
    habit_name: "code",
    habit_type: "daily",
    habit_progress: 0,
  },
  {
    habit_id: "f33ea8",
    habit_name: "project",
    habit_type: "weekly",
    habit_progress: 0,
  },
];

function update(id, name, type, progress) {
  let found = 0;
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].habit_id == id) {
      found = 1;
      if (name == "" || name == null) {
        console.log("old name is set");
      } else {
        arr[index].habit_name = name;
        console.log("new name is set");
      }

      if (type == "" || type == null) {
        console.log("old type is set");
      } else {
        arr[index].habit_type = type;
        console.log("new type is set");
      }

      if (progress == "" || progress == null) {
        console.log("old progress is set");
      } else {
        arr[index].habit_progress = progress;
        console.log("new progress is set");
      }
    }

    if (found) console.log("no id found");
  }
}

update("f33ea8", "leetcode", "", "");
console.log(arr);
