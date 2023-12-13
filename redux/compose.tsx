import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const compose = createSlice({
  name: "compose",
  initialState: {
    isComposing: false,
  },
  reducers: {
    setIsComposing: (state, action: PayloadAction<boolean>) => {
      state.isComposing = action.payload;
    },
  },
});

export const { setIsComposing } = compose.actions;

export default compose.reducer;
