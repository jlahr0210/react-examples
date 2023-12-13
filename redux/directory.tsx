import { Member } from "@/components/ui/DirectoryItem/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const directory = createSlice({
  name: "directory",
  initialState: {
    directoryOpen: false,
    selectedMember: null as Member | null,
    sendMessageTo: null as Member | null,
  },
  reducers: {
    openDirectoryReducer: (state) => {
      state.directoryOpen = true;
    },
    closeDirectoryReducer: (state) => {
      state.directoryOpen = false;
    },
    setSelectedMember: (state, action: PayloadAction<Member | null>) => {
      state.selectedMember = action.payload;
    },
    setSendMessageTo: (state, action: PayloadAction<Member | null>) => {
      state.sendMessageTo = action.payload;
    },
  },
});

export const {
  openDirectoryReducer,
  closeDirectoryReducer,
  setSelectedMember,
  setSendMessageTo,
} = directory.actions;

export default directory.reducer;
