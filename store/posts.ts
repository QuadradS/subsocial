import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

interface IFetchPostsParams {
  search: string,
  limit?: number
}

export const fetchPosts = createAsyncThunk('FETCH_POSTS', async ({
                                                                   search,
                                                                   limit = 20
                                                                 }: IFetchPostsParams): Promise<IPost[]> => {
  const result = await axios.get(`/api/reddit/posts`, {
    params: {
      search,
      limit
    }
  })
  return JSON.parse(result.data.payload) as IPost[];
})

export interface IPost {
  id: string;
  author: string;
  selftext: string;
  subreddit: string;
  title: string;
  url: string;
}

export interface IPosts {
  posts: IPost[],
}

const initState: IPosts = {
  posts: [],
}

const postsStore = createSlice({
  name: 'posts',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = [...action.payload];
      return state
    })
  }
})

export default postsStore.reducer
