import FormAddTask from "./components/FormAddTask";
import TasksList from "./components/TasksList";
import { useState, useEffect } from "react";
import UpdateTaskForm from "./components/UpdateTaskForm";

const axios = require("axios");

function App() {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);
  const [updateTaskForm, setUpdateTaskForm] = useState();
  const [lookDb, setLookDb] = useState(true);
  const [currentID, setCurrentID] = useState();

  ///* HOOKS *///
  /* Look into db when new datas are available */
  useEffect(() => {
    if (lookDb) {
      axios.get("http://localhost:8080/tasks").then((resp) => {
        const data = resp.data;
        setTasksObjectArray(data);
        setLookDb(false);
      });
    }
  }, [lookDb]);

  /* Show the UpdateTaskForm when datas are loaded or handleTaskClicked fct is called*/
  useEffect(() => {
    /* Check taht the object with given id is loaded from db */
    if (
      currentID &&
      tasksObjectArray.find((el) => {
        return el.id === currentID;
      })
    )
      /* Show task details */
      showUpdateTaskForm();
  }, [tasksObjectArray, currentID]);

  /* Show update task form component for the current task */
  const showUpdateTaskForm = () => {
    if (currentID)
      setUpdateTaskForm(
        <div className="right-side side">
          <UpdateTaskForm
            askCloseTask={closeTask}
            defaultValues={tasksObjectArray.find((task) => {
              return task.id === currentID;
            })}
            dbHasChanged={dbHasChanged}
          />
        </div>
      );
  };

  ///* PROPS FUNCTION *///
  /* Remove the task from list */
  const removeTask = (id) => {
    /* Remove it from db */
    axios.delete(`http://localhost:8080/tasks/${id}`);

    /* Update rendering */
    setLookDb(true);
    closeTask();
  };
  /* Lower comp ask to reload datas */
  const dbHasChanged = (id) => {
    setCurrentID(id);
    setLookDb(true);
  };

  /* Lower comp ask to remove the updateForm */
  const closeTask = () => {
    setUpdateTaskForm(undefined);
    setCurrentID(null);
  };

  /* Handle click on a task of the list*/
  const handleTaskClicked = (id) => {
    currentID === id ? closeTask() : setCurrentID(id);
  };

  return (
    <div className="App">
      <div className="left-side side">
        <FormAddTask dbHasChanged={dbHasChanged} />
        <TasksList
          taskClicked={handleTaskClicked}
          tasksObjectArray={tasksObjectArray}
          removeTask={removeTask}
        />
      </div>
      {updateTaskForm}
    </div>
  );
}

export default App;
