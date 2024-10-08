import axios from "axios";

const DEV_BASE_URL = "http://localhost:5849";
const STG_BASE_URL = "https://api.buildwithyuvraj.com";

export default function axiosApi(header?: any) {
  return axios.create({
    baseURL: STG_BASE_URL,
    headers: header ?? {
      "Content-type": "application/json",
    },
  });
}
