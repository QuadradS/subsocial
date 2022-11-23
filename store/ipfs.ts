import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";
import {IPost} from "./posts";

export const saveContent = createAsyncThunk('SAVE_CONTENT', async (content: IPost[]): Promise<string[]> => {
  const result = await axios.post('/api/ipfsSave', {content});
  return result.data.payload;
})

export const getPostByCid = createAsyncThunk('POST_BY_CID', async (cid: string): Promise<IPost> => {
  const result = await axios.post('/api/ipfsGet', null, {
    params: {
      cid
    }
  })
  return JSON.parse(result.data.payload) as IPost;
})

export interface IIpfsState {
  saved: string[],
  postByCID?: IPost
}

const initState: IIpfsState = {
  saved: [],
  postByCID: undefined
}

const ipfsStore = createSlice({
  name: 'ipfs',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveContent.fulfilled, (state, action) => {
      state.saved = action.payload;
      return state
    })
    builder.addCase(getPostByCid.fulfilled, (state, action) => {
      state.postByCID = action.payload;
      return state
    })
  }
})

export default ipfsStore.reducer
