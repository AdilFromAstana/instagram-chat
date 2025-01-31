import axios from "axios";

// const API_BASE_URL = "https://www.melek-crm.kz/api";
// const API_BASE_URL = "http://192.168.0.12:5000/api";
const API_BASE_URL = "http://172.20.10.7:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const instagramToken = localStorage.getItem("instagramToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (instagramToken) {
      config.headers.instagramToken = instagramToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchDialogueMessages = async (
  senderId,
  recipientId,
  lastMessageId = null,
  limit = 20
) => {
  const response = await apiClient.get(`/messages/dialogue`, {
    params: {
      senderId,
      recipientId,
      lastMessageId,
      limit,
    },
  });

  return response.data.messages;
};

export const fetchClients = async ({ folder, lastClientId }) => {
  const response = await apiClient.get(`/clients/folder/${folder}`, {
    params: { lastClientId },
  });
  return response.data.clients;
};

export const sendMessage = async (formData) => {
  const response = await apiClient.post(`/messages/send`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const login = async (username, password) => {
  try {
    const response = await apiClient.post(`/auth/login`, {
      username,
      password,
    });

    const { success, accessToken, refreshToken, message, instagramToken } =
      response.data;

    if (success) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { success, message, instagramToken };
    } else {
      return { success, message };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login." };
  }
};

export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await apiClient.post(`/auth/refresh`, {
      refreshToken,
    });

    const { success, accessToken } = response.data;

    if (success) {
      localStorage.setItem("accessToken", accessToken);
      return { success, accessToken };
    } else {
      throw new Error("Failed to refresh access token");
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return { success: false };
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("instagramToken");
  window.location.reload();
};

export const updateClientFolder = async (clientId, folder) => {
  try {
    const response = await apiClient.put(`/clients/folder/${clientId}`, {
      folder,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating client folder:", error);
    throw error;
  }
};

export const updateClientsFolder = async (clientIds, folder) => {
  try {
    const response = await apiClient.put(`/clients/folder`, {
      clientIds,
      folder,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating client folders:", error);
    throw error;
  }
};

export const updateClientTag = async (clientId, tag) => {
  try {
    const response = await apiClient.put(`/clients/tag/${clientId}`, {
      tag,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating client folder:", error);
    throw error; // Пробрасываем ошибку для обработки в вызывающем коде
  }
};

export const updateClientNote = async (clientId, note) => {
  try {
    const response = await apiClient.put(`/clients/note/${clientId}`, {
      note,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating client folder:", error);
    throw error; // Пробрасываем ошибку для обработки в вызывающем коде
  }
};

export const fetchFolders = async () => {
  const response = await apiClient.get(`/folders`);
  return response.data.folders;
};
