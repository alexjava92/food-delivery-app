import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../../types/types";

interface IUserState {
    user: IUser;
}

const initialState: IUserState = {
    user: {
        id: 0,
        chatId: 0,
        role: 'admin',
        username: '',
        name: '',
        email: '',
        gender: '',
        date: '',
        phone: '',
    },
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUser: (state: IUserState, action: PayloadAction<Partial<IUser>>) => {
            state.user = action.payload;
        },
    },
});

export const {fetchUser} = user.actions;
export default user.reducer;
