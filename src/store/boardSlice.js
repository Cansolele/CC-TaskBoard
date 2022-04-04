import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const APP_TOKEN = {
  // Temporary const
  id: 4, //User id
  token: "s&?sfhb-hH))Grs[e%gA6-q^2uD-q~Jf42sJkCyV&<J7rxZR[@LpMXvbLc^S-Zgz", //Token from sign-in
};
export const fetchBoard = createAsyncThunk("board/fetchBoard", async () => {
  const APP_TOKEN = {
    // Temporary const
    id: 4, //User id
    token: "s&?sfhb-hH))Grs[e%gA6-q^2uD-q~Jf42sJkCyV&<J7rxZR[@LpMXvbLc^S-Zgz", //Token from sign-in
  };
  const BODY = {
    // Temporary const
    board_id: 1, //Board ID
  };
  const response = await fetch("http://192.168.56.2:3001/board", {
    //Server address + /board
    credentials: "omit",
    headers: {
      "App-Token": Buffer(JSON.stringify(APP_TOKEN)).toString("base64"),
    },
    body: Buffer(JSON.stringify(BODY)).toString("base64"),
    method: "POST",
    mode: "cors",
  });
  return await response.json();
});

export const postSubTask = createAsyncThunk(
  "board/postSubTask",
  async (params, { dispatch }) => {
    const subTask = {
      board_id: params.board_id,
      card_id: params.card_id,
      task_id: params.task_id,
      subtask: {
        id: 0,
        author: 0,
        title: params.inputSubTask,
        executors: [],
        exec: false,
        tags: [
          {
            title: "test",
            text_color: "#FFF",
            background_color: "#000",
          },
        ],
        timelines: {
          preferred_time: 1234567890,
          max_time: 1234567890,
          expected_time: 1234567890,
        },
      },
    };
    const response = await fetch("http://192.168.56.2:3001/subtask", {
      //Server address + /board
      method: "PUT",
      credentials: "omit",
      headers: {
        "App-Token": Buffer(JSON.stringify(APP_TOKEN)).toString("base64"),
      },
      body: Buffer(JSON.stringify(subTask)).toString("base64"),
      mode: "cors",
    });
    const subtask_id = await response.json();
    dispatch(addSubTask({ subtask_id, subTask }));
  }
);
const boardSlice = createSlice({
  name: "board",
  initialState: {
    board: [],
  },
  reducers: {
    addSubTask(state, action) {
      const cardID = state.board.cards.findIndex(
        (item) => item.id === action.payload.subTask.card_id
      );
      const taskID = state.board.cards[cardID].tasks.findIndex(
        (item) => item.id === action.payload.subTask.task_id
      );
      const subtask = action.payload.subTask.subtask;
      subtask.id = action.payload.subtask_id;
      state.board.cards[cardID].tasks[taskID].subtasks.push(subtask);
    },
  },
  extraReducers: {
    [fetchBoard.pending]: (state) => {},
    [fetchBoard.fulfilled]: (state, action) => {
      state.board = action.payload;
    },
    [fetchBoard.rejected]: (state, action) => {},
  },
});
const { addSubTask } = boardSlice.actions;
export default boardSlice.reducer;
