import { create } from "zustand";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL

type UserStore = {
  userID: string | null,
  setUser: (i: string) => void,
  removeUser: () => void,
};

export const useUserStore = create<UserStore>((set, get) => ({
  userID: null,

  setUser: async (uuid: string) => {

    set({
      userID: uuid,
    });


  },

  removeUser: () => {


    //  call api to clear user data

    axios.get(backend_url + "/api/pdf/clear", {
      params: { userID: get().userID },
    });



    set({
      userID: null,
    })
  },

}));
