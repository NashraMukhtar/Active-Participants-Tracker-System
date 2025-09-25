import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "./API";
import type { RootState } from "./store";

export type Role = 'entry' | 'admin' | 'active'

export interface User{
    _id: string
    username: string
    email:string
    role: Role
}

interface AuthState{
    user: User | null
    isAuthenticated: boolean
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: AuthState={
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
}

export const login = createAsyncThunk<
    {user:User},
    {email: string; password: string},
    {rejectValue: {message: string}}
>('auth/login', async(credentials, {rejectWithValue})=>{
    try {
        const res = await api.post<{ user: User }>('/login', credentials, {withCredentials:true})
        return res.data
    } catch (err: any) {
        return rejectWithValue(err.response?.data || { message: err.message })
    }
})

export const fetchMe = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: { message: string } }
>('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ user: User }>('/get-user', {withCredentials:true})
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/logout')
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:{
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    }

  },
  extraReducers:(builder)=>{
    builder.addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Login failed'
        state.user = null
        state.isAuthenticated = false
      })
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'idle'
        state.user = null
        state.isAuthenticated = false
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.status = 'idle'
      })
  }
})

export const { setUser } = authSlice.actions

// selectors (handy in components)
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer