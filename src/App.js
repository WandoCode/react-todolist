import FormAddTask from "./components/FormAddTask";
import TasksList from "./components/TasksList";
import { useState, useEffect } from "react";
import UpdateTaskForm from "./components/UpdateTaskForm";

const axios = require("axios");

function App() {
  const [tasksObjectArray, setTasksObjectArray] = useState([]);
  const [updateTaskForm, setUpdateTaskForm] = useState();
  const [lookDb, setLookDb] = useState(true);

  //* LOAD DATAS *///
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

  /* Ask to reload datas */
  const dbHasChanged = () => {
    setLookDb(true);
  };

  /* Ask to remove the updateForm */
  const closeTask = () => {
    setUpdateTaskForm(undefined);
  };

  ///* TASK LIST DISPLAY *///
  /* Remove the task from list */
  const removeTask = (id) => {
    /* Remove it from db */
    axios.delete(`http://localhost:8080/tasks/${id}`);

    /* Update rendering */
    setLookDb(true);
    closeTask();
  };

  /* Handle click on a task of the list*/
  const handleTaskClicked = (id) => {
    setUpdateTaskForm(
      <div className="right-side side">
        <UpdateTaskForm
          askCloseTask={closeTask}
          defaultValues={tasksObjectArray.find((task) => {
            return task.id === id;
          })}
          dbHasChanged={dbHasChanged}
        />
      </div>
    );
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
