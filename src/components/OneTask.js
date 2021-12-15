function OneTask(props) {
  return (
    <div className="task">
      due date: {props.task.dueDate} - {props.task.description}
    </div>
  );
}

export default OneTask;
