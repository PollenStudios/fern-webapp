import axios from "axios";

// axios api

// function uploadImage(file, updateProgress) {
//   return axios.post('/api/media_objects', file, {
//     onUploadProgress: progressEvent => {
//       let percentComplete = progressEvent.loaded / progressEvent.total
//       percentComplete = parseInt(percentComplete * 100);
//       console.log(percentComplete);
//       updateProgress(percentComplete);
//     }
//   }).then(response => response.data.id);
// }

const getAxiosInstance = (config: any) => {
  return axios.create(config);
};

export const makeAxiosRequest = async (method: "GET" | "POST", urlPath: string, data?: any) => {
  const axiosInstance = getAxiosInstance({
    baseURL: "https://backend.makeusvisible.io/api/v1",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token 6fd66ae9bdb04f1fc63cdd8bf6836a2cc7906abe",
    },
  });

  try {
    if (method == "GET") {
      return await axiosInstance.get(urlPath);
    } else if (method == "POST") {
      return await axiosInstance.post(urlPath, data);
    }
    return;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
};
