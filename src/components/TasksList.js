import { useState, useEffect } from "react";
const axios = require("axios");

function TasksList(props) {
  useEffect(() => {
    console.log("test");
  });
  return <div className="tasks-list">LIST</div>;
}

export default TasksList;
