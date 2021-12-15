import { useState, useEffect } from "react";
import OneTask from "./OneTask";
import uniqid from "uniqid";
const axios = require("axios");

function TasksList(props) {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);
  const [lookDb, setLookDb] = useState(true);

  /* Remove the task from list */
  const removeFromDb = (id) => {
    /* Remove it from db */
    axios.delete(`http://localhost:8080/tasks/${id}`);

    /* Ask to update rendering */
    setLookDb(true);
  };

  useEffect(() => {
    if (props.lookDb || lookDb) {
      axios.get("http://localhost:8080/tasks").then((resp) => {
        const data = resp.data;
        setTasksObjectArray(data);
        setLookDb(false);
      });
    }
  }, [props.lookDb, lookDb]);

  /* For rendering. Show all tasks in the db with the choosen sorting.*/
  const showTasks = (sorting) => {
    if (sorting === undefined || sorting === "adding") {
      return tasksObjectArray.map((task) => {
        return (
          <OneTask task={task} key={uniqid()} removeFromDb={removeFromDb} />
        );
      });
    }
  };

  return <div className="tasks-list">{showTasks()}</div>;
}

export default TasksList;
