import { useState, useEffect } from "react";
import OneTask from "./OneTask";
import uniqid from "uniqid";
const axios = require("axios");

function TasksList(props) {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);

  const showTasks = () => {
    return tasksObjectArray.map((task) => {
      return <OneTask task={task} key={uniqid()} />;
    });
  };

  useEffect(() => {
    if (props.lookDb) {
      axios.get("http://localhost:8080/tasks").then((resp) => {
        const data = resp.data;
        setTasksObjectArray(data);
      });
    }
  }, [props.lookDb]);

  return <div className="tasks-list">{showTasks()}</div>;
}

export default TasksList;
