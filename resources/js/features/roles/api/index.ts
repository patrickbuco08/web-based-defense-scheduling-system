import axios from 'axios';

const BASE_URL = '/admin/roles';

export const rolesApi = {
  getRoles: async () => {
    const { data } = await axios.get(BASE_URL);
    return data.data; // Return just the data array
  },
  
  getRole: async (id: string | number) => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data.data;
  },
  
  createRole: async (roleData: { name: string; permissions?: number[] }) => {
    const { data } = await axios.post(BASE_URL, roleData);
    return data.data;
  },
  
  updateRole: async (id: string | number, roleData: { name?: string; permissions?: number[] }) => {
    const { data } = await axios.put(`${BASE_URL}/${id}`, roleData);
    return data.data;
  },
  
  deleteRole: async (id: string | number) => {
    await axios.delete(`${BASE_URL}/${id}`);
  }
}
