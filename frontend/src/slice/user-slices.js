import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../constant'

const initialState = {
  access: "",
  refresh: localStorage.getItem('refreshToken')||"",
}

export const userLogin = createAsyncThunk('userSlice/login', async (fromData) => {
  const response = await fetch(API_BASE_URL + "token/", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify(fromData)
  });
  return response.json()
  
});

export const userLoginWithRefreshToken = createAsyncThunk('userSlice/refreshToken', async (token=null) => {
  if(!token){
    token=localStorage.getItem("refreshToken");
  }
  const response = await fetch(API_BASE_URL + "token/refresh/", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({refresh:token})
  });
  return response.json()
  
});

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {

    tokenReceived:(state,action)=>{
      const {access,refresh}=action.payload;
      
      if(refresh){
        localStorage.setItem("refreshToken",refresh);
      }

      return {
        access,
        refresh
      }
    },

    loggedOut: (state) => {
      return {
        refresh:"",
        access:""
      }
    },
    refreshCurrentToken: (state, action) => {

    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(userLogin.fulfilled, (state, action) => {
      // Add user to the state array
      const {refresh, access}=action.payload;
      if(refresh){
        localStorage.setItem("refreshToken",refresh);
      }

      return {
        refresh,
        access
      }
    })
    builder.addCase(userLogin.rejected, (state, action) => {
      // Add user to the state array
      console.log(action.payload)
    })
    builder.addCase(userLoginWithRefreshToken.fulfilled,(state,action)=>{
      const {refresh, access}=action.payload;
      
      if(refresh){
        localStorage.setItem("refreshToken",refresh);
      }

      return {
        refresh,
        access
      }
    })

    builder.addCase(userLoginWithRefreshToken.rejected,(state,action)=>{
      console.log(action.payload);
    })


  },
})

// Action creators are generated for each case reducer function
export const { loggedOut, tokenReceived,refreshCurrentToken } = userSlice.actions

export default userSlice.reducer