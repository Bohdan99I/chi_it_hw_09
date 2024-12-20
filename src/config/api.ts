export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    REGISTER: '/users/register',
    GET_PROFILE: '/api/users/my-profile',
    GET_USER: (idOrUsername: string) => `/api/users/${idOrUsername}`,

    // Exhibit endpoints
    GET_EXHIBITS: '/api/exhibits',
    GET_MY_EXHIBITS: '/api/exhibits/my-posts',
    GET_EXHIBIT: (id: number) => `/api/exhibits/post/${id}`,
    CREATE_EXHIBIT: '/api/exhibits',
    UPDATE_EXHIBIT: (id: number) => `/api/exhibits/${id}`,
    DELETE_EXHIBIT: (id: number) => `/api/exhibits/${id}`,
    GET_STATIC_FILE: (filename: string) => `/api/exhibits/static/${filename}`,

    // Comment endpoints
    CREATE_COMMENT: (exhibitId: number) => `/api/exhibits/${exhibitId}/comments`,
    GET_COMMENTS: (exhibitId: number) => `/api/exhibits/${exhibitId}/comments`,
    UPDATE_COMMENT: (exhibitId: number, commentId: number) => `/api/exhibits/${exhibitId}/comments/${commentId}`,
    DELETE_COMMENT: (exhibitId: number, commentId: number) => `/api/exhibits/${exhibitId}/comments/${commentId}`,
};
