import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../main';



export const fetchCommunications = createAsyncThunk(
    'communications/fetchCommunications',
    async ({ clientId, type, category, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const params = [];
            if (type) params.push(`type=${type}`);
            if (category) params.push(`category=${category}`);
            params.push(`page=${page}`);
            params.push(`limit=${limit}`);
            const query = params.length ? `?${params.join('&')}` : '';
            const res = await axios.get(`${API_URL}/communications/client/${clientId}${query}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createCommunication = createAsyncThunk(
    'communications/createCommunication',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/communications`, data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCommunication = createAsyncThunk(
    'communications/updateCommunication',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_URL}/communications/${id}`, data);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteCommunication = createAsyncThunk(
    'communications/deleteCommunication',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/communications/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



export const fetchCommunicationOptions = createAsyncThunk(
    'communications/fetchCommunicationOptions',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/communications/communication-options`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);




const initialState = {
    items: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    communicationOptions: {
        initiatedBy: [],
        communicationType: [],
        category: [],
        status: []
    },
    communicationOptionsLoading: false,
    communicationOptionsError: null,
}

const communicationsSlice = createSlice({
    name: 'communications',
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommunications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchCommunications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCommunication.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateCommunication.fulfilled, (state, action) => {
                const idx = state.items.findIndex((c) => c._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteCommunication.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c._id !== action.payload);
            })
            .addCase(fetchCommunicationOptions.pending, (state) => {
                state.communicationOptionsLoading = true;
                state.communicationOptionsError = null;
            })
            .addCase(fetchCommunicationOptions.fulfilled, (state, action) => {
                state.communicationOptionsLoading = false;
                state.communicationOptions = action.payload;
            })
            .addCase(fetchCommunicationOptions.rejected, (state, action) => {
                state.communicationOptionsLoading = false;
                state.communicationOptionsError = action.payload;
            });
    },
});

export const { clearCommunications } = communicationsSlice.actions;
export default communicationsSlice.reducer; 