import { useState, useEffect } from "react";
import OneTask from "./OneTask";
import uniqid from "uniqid";
import Sorting from "./Sorting";
import { Fragment } from "react/cjs/react.production.min";

function TasksList(props) {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);
  const [sorting, setSorting] = useState("addDate");
  const [sortedList, setSortedList] = useState();
  const [reverseSortOrder, setReverseSortOrder] = useState(false);
  const [activeTask, setActiveTask] = useState();

  /* Update list display when informations change */
  useEffect(() => {
    setTasksObjectArray(props.tasksObjectArray);
  }, [props.tasksObjectArray]);

  ///* TASK LIST DISPLAY *///
  /* Remove the task from list */
  const removeFromDb = (id) => {
    /* Ask to remove it from db */
    props.removeTask(id);
  };

  /* Update the tasks displayed when the List of task change + set the task as active in the list*/
  useEffect(() => {
    setSortedList(showTasks());
  }, [tasksObjectArray, sorting, reverseSortOrder, activeTask]);

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
    let sortedTasksList = [...props.tasksObjectArray];

    /* Sort by due Date */
    if (sorting === "dueDate") {
      sortedTasksList.sort((taskA, taskB) => {
        return (
          new Date(taskA.dueDate).valueOf() - new Date(taskB.dueDate).valueOf()
        );
      });
    }

    /* Reverse final array if needed */
    if (reverseSortOrder) {
      sortedTasksList.reverse();
    }

    /* Return component */
    return sortedTasksList.map((task) => {
      return (
        <OneTask
          task={task}
          key={uniqid()}
          removeFromDb={removeFromDb}
          openTask={openTask}
          isActive={isActive}
          putSelectClass={activeTask === task.id ? true : false}
        />
      );
    });
  };

  ///* SHOW ACTIVE ELEMENT *///
  /* Set the id of the current active task of the list */
  const isActive = (id) => {
    // If given id already active, set it inactive
    id === activeTask ? setActiveTask(undefined) : setActiveTask(id);
  };

  ///* TASK UPDATE *///
  /* Open the component to update tasks values */
  const openTask = (id) => {
    props.taskClicked(id);
  };

  return (
    <Fragment>
      <div className="task-sorting-container">
        <Sorting
          chooseSorting={chooseSorting}
          chooseReverseOrder={chooseReverseOrder}
        />
        <div className="tasks-list">{sortedList}</div>
      </div>
    </Fragment>
  );
}

export default TasksList;
