import axios from 'axios';

const API_ENDPOINT = 'https://file.io/?expires=1d';

const apiFileUpload = (file: File, callback: (url?: string) => void) => {
  const api = axios.create({ headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  const formData = new FormData();
  formData.append('file', file);
  api.post(API_ENDPOINT, formData)
    .then(res => callback(res.data.link))
    .catch(err => console.log(err));
};

export { apiFileUpload };