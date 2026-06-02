import { supabase } from "@/lib/supabase/client";
import { ValidationError } from "yup";
import * as yup from "yup";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = await yup
      .object({
        email: yup.string().email().required(),
        password: yup.string().required(),
      })
      .validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return Response.json(
        {
          message: error.message,
        },
        { status: 401 },
      );
    }

    return Response.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        {
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
