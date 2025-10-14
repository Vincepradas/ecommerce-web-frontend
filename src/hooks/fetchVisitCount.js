import axios from "axios";

export const fetchVisitCount = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/visit`);

    if (!response || !response.data) {
      throw new Error("Error fetching visit counts");
    }
    return response;
  } catch (error) {
    if (error.response?.status === 429) {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/visit`
      );
      return response.data;
    }
    return { count: 0 };
  }
};
