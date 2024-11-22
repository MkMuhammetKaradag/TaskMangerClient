
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x: number;
  y: number;
}

interface PiPState {
  isPiP: boolean;
  activeChatId: string | null;
  position: Position;
  minimized: boolean;
}

const initialState: PiPState = {
  isPiP: false,
  activeChatId: null,
  position: { x: 0, y: 0 },
  minimized: false,
};

const pipSlice = createSlice({
  name: 'pip',
  initialState,
  reducers: {
    setPiPMode: (state, action: PayloadAction<boolean>) => {
      state.isPiP = action.payload;
    },
    setActiveChatId: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
    setPosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload;
    },
    setMinimized: (state, action: PayloadAction<boolean>) => {
      state.minimized = action.payload;
    },
    resetPiP: (state) => {
      return initialState;
    },
  },
});

export const {
  setPiPMode,
  setActiveChatId,
  setPosition,
  setMinimized,
  resetPiP,
} = pipSlice.actions;
export default pipSlice.reducer;
