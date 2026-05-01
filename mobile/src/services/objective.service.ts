import api from "../lib/api";

export interface Objective {
    id: string;
    title: string;
    description?: string;
    status: 'PENDING' | 'DONE';
    target_month: number;
    target_year: number;
    created_at: string;
}

export interface CreateObjectiveDTO {
    title: string;
    description?: string;
    target_month: number;
    target_year: number;
}

export interface UpdateObjectiveDTO {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'DONE';
    target_month?: number;
    target_year?: number;
}

export const objectiveService = {
    getObjectives: async (): Promise<Objective[]> => {
        const response = await api.get('/objectives');
        return response as any;
    },

    getObjective: async (id: string): Promise<Objective> => {
        const response = await api.get(`/objectives/${id}`);
        return response as any;
    },

    createObjective: async (dto: CreateObjectiveDTO): Promise<Objective> => {
        const response = await api.post('/objectives', dto);
        return response as any;
    },

    updateObjective: async (id: string, dto: UpdateObjectiveDTO): Promise<Objective> => {
        const response = await api.patch(`/objectives/${id}`, dto);
        return response as any;
    },

    deleteObjective: async (id: string): Promise<void> => {
        await api.delete(`/objectives/${id}`);
    },
};
