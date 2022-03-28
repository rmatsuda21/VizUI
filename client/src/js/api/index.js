import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const convertXML = (file) =>
    api.post(`/convert`, file, {
        headers: { "Content-type": "multipart/form-data" },
    });

const apis = {
    convertXML,
};

export default apis;
