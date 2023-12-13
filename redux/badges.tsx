import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const badges = createSlice({
  name: "badges",
  initialState: {
    messageUnreadCount: 0,
    receivedBroadcastCount: 0,
    sentBroadcastCount: 0,
  },
  reducers: {
    setMessageUnreadCount: (state, action: PayloadAction<number>) => {
      state.messageUnreadCount = action.payload;
    },
    setReceivedBroadcastUnreadCount: (state, action: PayloadAction<number>) => {
      state.receivedBroadcastCount = action.payload;
    },
    setSentBroadcastUnreadCount: (state, action: PayloadAction<number>) => {
      state.sentBroadcastCount = action.payload;
    },
  },
});

export const {
  setMessageUnreadCount,
  setReceivedBroadcastUnreadCount,
  setSentBroadcastUnreadCount,
} = badges.actions;

export default badges.reducer;
