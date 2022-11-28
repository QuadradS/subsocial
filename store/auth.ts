import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

export const authUser = createAsyncThunk('AUTH', async (code: string) => {
  const res = await axios.get(`/api/reddit/auth?code=${code}`);
  return res.data;
})

export interface IAuth {
  isAuth: boolean
}

const initState: IAuth = {
  isAuth: false
}

const authStore = createSlice({
  name: 'auth',
  initialState: initState,
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(authUser.fulfilled,  (state, action) => {
      state.isAuth = true;
      return state
    })
  }
})

export default authStore.reducer
