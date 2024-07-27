import type { APIRoute } from "astro";

export const GET = async () => {
  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const modifiedName = body.firstName + " " + "Yadav";
  return new Response(JSON.stringify({ hello:modifiedName }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};
