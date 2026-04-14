import type { Note } from '../types/note';
import axios from 'axios';

const API_URL = 'https://notehub-public.goit.study/api/notes';


interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface MutateNoteResponse {
    note: Note;
}

export const fetchNotes = async (currentPage: number, perPage: number, search: string) : Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>(API_URL, {
        params: {
            page: currentPage,
            perPage: perPage,
            search: search
        },
        headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` }
    });
    return response.data;
};

export const createNote = async({title, content, tag} : Note): Promise<MutateNoteResponse> => {
    const response = await axios.post<MutateNoteResponse>(API_URL, {title, content, tag}, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` }
    });
    return response.data;
}

export const deleteNote = async (id: string): Promise<MutateNoteResponse> => {
    const response = await axios.delete<MutateNoteResponse>(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` }
    });
    return response.data;
};
