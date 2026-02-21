import { createSlice } from "@reduxjs/toolkit"

const dialogSlice = createSlice({
  name: "createProjectDialog",
  initialState: { open: false },
  reducers: {
    openDialog: (state) => { state.open = true },
    closeDialog: (state) => { state.open = false },
  }
})

export const { openDialog, closeDialog } = dialogSlice.actions
export default dialogSlice.reducer
