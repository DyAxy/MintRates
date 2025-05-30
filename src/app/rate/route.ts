import axios, { AxiosError } from "axios";

const request = axios.create({
  baseURL: "https://api.dy.ax/v1",
  params: {
    apiKey: process.env.API_KEY,
  },
});

export async function GET() {
  try {
    const { data } = await request.get("finance/rateall");
    return Response.json(data.data);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof AxiosError
            ? error.response?.data || "An error occurred"
            : "An unexpected error occurred",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
