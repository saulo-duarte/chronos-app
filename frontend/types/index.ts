export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "PENDING" | "DONE";

export interface Collection {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    color: string;
    icon?: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    collection_id?: string;
    start_time: string;
    end_time?: string;
    finished_at?: string;
    created_at: string;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    collection_id?: string;
    start_time: string;
    end_time?: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    collection_id?: string;
    start_time?: string;
    end_time?: string;
}

export interface CreateCollectionDTO {
    title: string;
    description?: string;
    color: string;
    icon?: string;
}

export interface UpdateCollectionDTO {
    title?: string;
    description?: string;
    color?: string;
    icon?: string;
    is_archived?: boolean;
}

export type ResourceType = "FILE" | "LINK";

export interface Resource {
    id: string;
    collection_id: string;
    user_id: string;
    title: string;
    description?: string;
    path: string;
    type: ResourceType;
    tag?: string;
    size: number;
    mime_type?: string;
    created_at: string;
}

export interface CreateResourceDTO {
    collection_id: string;
    title: string;
    description?: string;
    path: string;
    type: ResourceType;
    tag?: string;
    size: number;
    mime_type?: string;
}

export interface UpdateResourceDTO {
    title?: string;
    description?: string;
    tag?: string;
}

