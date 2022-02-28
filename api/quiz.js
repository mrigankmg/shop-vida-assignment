import axios from "axios";

const instance = axios.create({
  baseURL: `https://merch-test.shopvida.com/onboard-quizs/${process.env.userApiId}`,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.authToken}`,
  },
});

export const updateQuizResult = (body) => {
  return instance.put("", body);
};

export const getQuizConfig = () => {
  return instance.get();
};
