import { create } from "zustand";
import axios, { type AxiosResponse } from "axios";


type UserStore = {
 userID:string|null,
 setUser: (i:string) => void,
 removeUser: () => void,
};

export const useUserStore = create<UserStore>((set,get) => ({
userID:null,

  setUser: async (uuid:string) => {
   
    set({
     userID: uuid,
    });

  
  },

  removeUser: () =>{


    //  call api to clear user data

      const response =  axios.get("http://localhost:4000/api/removeuser",  {
        params: { userID:get().userID },  
      });

    

     set({
      userID: null,
    })
  },
   
}));
