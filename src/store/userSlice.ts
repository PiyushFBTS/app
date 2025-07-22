import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  role_code: number
  user_code: number
  user_name: string
  first_name: string
  last_name: string
  isLoading: boolean
  isAuthenticated: boolean
}

const initialState: UserState = {
  role_code: 0,
  user_code: 0,
  user_name: "",
  first_name: "",
  last_name: "",
  isLoading: false,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, "isLoading" | "isAuthenticated">>) => {
      state.role_code = action.payload.role_code
      state.user_code = action.payload.user_code
      state.user_name = action.payload.user_name
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.isAuthenticated = true
      state.isLoading = false
    },
    clearUser: (state) => {
      state.role_code = 0
      state.user_code = 0
      state.user_name = ""
      state.first_name = ""
      state.last_name = ""
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading } = userSlice.actions
export default userSlice.reducer
