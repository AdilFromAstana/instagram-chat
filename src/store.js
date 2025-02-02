import { configureStore, createSlice } from "@reduxjs/toolkit";

// 📌 UI Состояние (выбранная папка, чат)
const uiSlice = createSlice({
    name: "ui",
    initialState: {
        selectedChatId: null,
        selectedFolder: "inbox",
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChatId = action.payload;
        },
        setSelectedFolder: (state, action) => {
            state.selectedFolder = action.payload;
        },
    },
});

const clientsSlice = createSlice({
    name: "clients",
    initialState: {},
    reducers: {
        setClients: (state, action) => {
            const { folder, clients } = action.payload;
            if (!state[folder]) {
                state[folder] = clients;
            } else {
                state[folder] = [...state[folder], ...clients];
            }
        },
        addClient: (state, action) => {
            const { folder, client } = action.payload;
            if (state[folder]) {
                state[folder] = [...state[folder], client];
            } else {
                state[folder] = [client];
            }
        },
    },
});

// 📌 Локальные сообщения (до отправки на сервер)
const messagesSlice = createSlice({
    name: "messages",
    initialState: [],
    reducers: {
        addLocalMessage: (state, action) => {
            state.push(action.payload);
        },
        removeLocalMessage: (state, action) => {
            return state.filter((msg) => msg.id !== action.payload);
        },
    },
});

// 📌 Глобальный Store
export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        messages: messagesSlice.reducer,
        clients: clientsSlice.reducer,
    },
});

// 📌 Экспортируем экшены
export const { setClients, updateClient, addClient } = clientsSlice.actions;
export const { setSelectedChat, setSelectedFolder } = uiSlice.actions;
export const { addLocalMessage, removeLocalMessage } = messagesSlice.actions;
