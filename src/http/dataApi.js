import trainers from "../mock/Trainers";
import { api } from "./index";

export const getGyms = async () => {
  const response = await api.get("/gyms");

  return response.data;
};

export const getTrainers = async () => {
  const response = await api.get("/trainers");

  return response.data;
};

export const getGym = async (gym_id) => {
  const response = await api.get(`/gyms/${gym_id}`);

  return response.data;
};

export const getTrainer = async (trainer_id) => {
  const response = await api.get(`/trainers/${trainer_id}`);

  return response.data;
};

export const fetchTrainersPage = async (page_size = 30, page_number) => {
  try {
    console.log(
      `Fetching trainers: page_size=${page_size}, page_number=${page_number}`
    );
    const response = await api.get(`/trainers`, {
      params: {
        page_size,
        page_number,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching trainers page:", error);
    throw error;
  }
};

export const fetchGymTrainersPage = async (
  gym_id,
  page_size = 30,
  page_number
) => {
  try {
    console.log(
      `Fetching trainers for gym ${gym_id}: page_size=${page_size}, page_number=${page_number}`
    );
    const response = await api.get(`/gyms/${gym_id}/trainers`, {
      params: {
        page_size,
        page_number,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("trainers response: ", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching trainers for gym:", error);
    throw error;
  }
};
