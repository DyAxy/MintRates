import axios, { AxiosError } from "axios";

const endpoints =
  "https://raw.githubusercontent.com/DyAxy/NewExchangeRatesTable/refs/heads/main/data/";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get("base") || "default";
    const { data } = await axios.get(endpoints + `${base}.json`);
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
