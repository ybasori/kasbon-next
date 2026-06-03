import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (error) {
    return Response.json(
      {
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }

  return Response.json(
    {
      user: data.user,
    },
    {
      status: 201,
    }
  );
}