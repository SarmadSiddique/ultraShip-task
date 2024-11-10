import { createSlice } from '@reduxjs/toolkit';

export const binStatus = createSlice({
  name: 'binStatus',
  initialState: {
    binCounts: {},
  },
  reducers: {
    setBinCounts: (state, action) => {
      state.binCounts = action.payload;
    },
  },
});

export const { setBinCounts, binCounts } = binStatus.actions;

export default binStatus.reducer;
