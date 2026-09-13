import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/index";

// Authentication function for login
export const loginUser = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return response.data ;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }

    throw new Error("An unexpected error occurred");
  }
};

// Authentication function for Registration 

// export const registerUser = async (
//   name : string,
//  email : string,
//   password: string,
//   avatar: "",
// ): Promise<{ token: string }> => {
//   try {
//     const response = await axios.post(`${API_URL}/auth/register`, {
//   name , email , password , avatar 
//     });
//     return response.data ; 
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const message = error.response?.data?.message || "Registeration  failed";
//       throw new Error(message);
//     }

//     throw new Error("An unexpected error occurred");
//   }
// };
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  avatar: string,
): Promise<{ token: string }> => {

  console.log("REGISTER API START");

  try {

    console.log("API URL:", `${API_URL}/auth/register`);

    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        name,
        email,
        password,
        avatar,
      }
    );

    console.log("REGISTER RESPONSE:", response.data);

    return response.data;

  } catch (error: any) {

    console.log("===== AXIOS REGISTER ERROR =====");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
      console.log("HEADERS:", error.response.headers);
    } 
    else if (error.request) {
      console.log("REQUEST SENT BUT NO RESPONSE");
      console.log(error.request);
    } 
    else {
      console.log("ERROR MESSAGE:", error.message);
    }

    throw error;
  }
};
