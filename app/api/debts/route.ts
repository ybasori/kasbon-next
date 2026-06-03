import { createClient } from "@supabase/supabase-js";
import * as yup from "yup";
import qs from "qs";

type Query = {
  filter: {
    name: string;
    status: string;
    tipe: string;
  };
  sort: {
    order: "asc" | "desc";
    by: string;
  }[];
};

const createDebtSchema = yup.object({
  type: yup
    .mixed<"owed_to_me" | "i_owe">()
    .oneOf(["owed_to_me", "i_owe"])
    .required(),
  counterpart_name: yup.string().required().max(255),
  amount: yup.number().integer().positive().required(),
  note: yup.string().nullable().max(200),
  due_date: yup.date().nullable(),
});

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    const url = new URL(req.url);

    const query = qs.parse(url.search.slice(1)) as Query;


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

    let db = supabase.from("debts").select("*");

    if (!!query.filter?.status && query.filter.status === "paid") {
      db = db.not("settled_at","is", null);
    }
    if (!!query.filter?.status && query.filter.status === "not_paid") {
      db = db.is("settled_at", null);
    }
    if (!!query.filter?.tipe) {
      db = db.eq("type", query.filter.tipe);
    }
    if (!!query.filter?.name) {
      db = db.ilike("counterpart_name", query.filter.name);
    }

    if(query.sort){
        for(let i=0;i<query.sort.length;i++){
            db=db.order(query.sort[i].by, {
                ascending: query.sort[i].order==="asc"
            })
        }
    }

    const { data, error } = await db;

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

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const payload = await createDebtSchema.validate(body, {
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
      .insert({
        user_id: user.id,
        type: payload.type,
        counterpart_name: payload.counterpart_name,
        amount: payload.amount,
        note: payload.note || null,
        due_date: payload.due_date || null,
      })
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
