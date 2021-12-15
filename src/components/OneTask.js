function OneTask(props) {
  const removeTask = () => {
    props.removeFromDb(props.task.id);
  };
  return (
    <div className="task">
      due date: {props.task.dueDate} - {props.task.description}{" "}
      <button onClick={removeTask}>x</button>
    </div>
  );
}

export default OneTask;
