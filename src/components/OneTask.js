function OneTask(props) {
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

  /* Construct responsive class for task */
  const getClass = () => {
    let theClass = "";
    theClass = props.putSelectClass
      ? "task-infos-container selected"
      : "task-infos-container";

    theClass += props.task.done ? " done" : " not-done";

    return theClass;
  };

  return (
    <div className={getClass()}>
      <div id={props.task.id} className="task" onClick={taskClicked}>
        <div className="descr">{props.task.description}</div>
        <div className="due-date-show">{props.task.dueDate}</div>
      </div>

      <button className="rmv-task-btn" onClick={removeTask}>
        x
      </button>
    </div>
  );
}

export default OneTask;
