import { useState, useEffect } from "react";
import OneTask from "./OneTask";
import uniqid from "uniqid";
import Sorting from "./Sorting";
const axios = require("axios");

function TasksList(props) {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);
  const [lookDb, setLookDb] = useState(true);
  const [sorting, setSorting] = useState("addDate");
  const [sortedList, setSortedList] = useState();
  const [reverseSortOrder, setReverseSortOrder] = useState(false);

  /* Look into db when new datas are available */
  useEffect(() => {
    if (props.lookDb || lookDb) {
      axios.get("http://localhost:8080/tasks").then((resp) => {
        const data = resp.data;
        setTasksObjectArray(data);
        setLookDb(false);
      });
    }
  }, [props.lookDb, lookDb]);

  ///* TASK LIST DISPLAY *///
  /* Remove the task from list */
  const removeFromDb = (id) => {
    /* Remove it from db */
    axios.delete(`http://localhost:8080/tasks/${id}`);

    /* Ask to update rendering */
    setLookDb(true);
  };

  /* Update the tasks displayed when the List of task change */
  useEffect(() => {
    setSortedList(showTasks());
  }, [tasksObjectArray, sorting, reverseSortOrder]);

  ///* SORTING *///
  /* Change the sorting of the list */
  const chooseSorting = (newSorting) => {
    if (sorting !== newSorting) setSorting(newSorting);
  };

  /* Choose if the sort order has to be reversed */
  const chooseReverseOrder = () => {
    setReverseSortOrder(() => !reverseSortOrder);
  };

  /* For rendering. Show all tasks in the db with the choosen sorting.*/
  const showTasks = () => {
    /* Default sorting is the add order (in the db) */
    let sortedTasksList = [...tasksObjectArray];

    /* Sort by due Date */
    if (sorting === "dueDate") {
      sortedTasksList.sort((taskA, taskB) => {
        return (
          new Date(taskA.dueDate).valueOf() - new Date(taskB.dueDate).valueOf()
        );
      });
    }

    if (reverseSortOrder) {
      sortedTasksList.reverse();
    }

    return sortedTasksList.map((task) => {
      return <OneTask task={task} key={uniqid()} removeFromDb={removeFromDb} />;
    });
  };

  return (
    <div className="tasks-list">
      <Sorting
        chooseSorting={chooseSorting}
        chooseReverseOrder={chooseReverseOrder}
      />
      {sortedList}
    </div>
  );
}

export default TasksList;
