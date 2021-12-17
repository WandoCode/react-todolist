import { useEffect, useState } from "react";

function OneTask(props) {
  const [isActive, setisActive] = useState(false);

  /* Ask to TasksList to remove the task */
  const removeTask = () => {
    props.removeFromDb(props.task.id);
  };

  /* Handle click on a task */
  const taskClicked = () => {
    /* Tell  TasksList the task has been clicked*/
    props.openTask(props.task.id);
    props.isActive(props.task.id);
  };

  return (
    <div
      id={props.task.id}
      className={props.putSelectClass ? "task selected" : "task"}
      onClick={taskClicked}
    >
      due date: {props.task.dueDate} - {props.task.description}{" "}
      <button onClick={removeTask}>x</button>
    </div>
  );
}

export default OneTask;
