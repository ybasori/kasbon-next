import { createClient } from "@supabase/supabase-js";
import * as yup from "yup";

const updateDebtSchema = yup.object({
  type: yup
    .mixed<"owed_to_me" | "i_owe">()
    .oneOf(["owed_to_me", "i_owe"])
    .required(),

  counterpart_name: yup.string().required().max(255),
  amount: yup.number().integer().positive().required(),
  note: yup.string().nullable(),
  due_date: yup.string().nullable(),
  settled_at: yup.string().nullable(),
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { data, error } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(data, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return Response.json(
        {
          errors: error.inner.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const payload = await updateDebtSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { data, error } = await supabase
      .from("debts")
      .update({
        user_id: user.id,
        type: payload.type,
        counterpart_name: payload.counterpart_name,
        amount: payload.amount,
        note: payload.note || null,
        due_date: payload.due_date || null,
        settled_at: payload.settled_at || null,
        updated_at: new Date
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(data, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return Response.json(
        {
          errors: error.inner.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
