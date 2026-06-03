import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../providers/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InferType } from "yup";
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import { toast } from "react-toastify";

interface IData {
  id: string;
  user_id: string;
  type: "i_owe" | "owed_to_me";
  counterpart_name: string;
  amount: number;
  note: string;
  due_date: string;
  settled_at?: null | string;
  created_at: string;
  updated_at: string;
}

const debtSchema = yup.object({
  type: yup
    .mixed<"owed_to_me" | "i_owe">()
    .oneOf(["owed_to_me", "i_owe"])
    .required(),
  counterpart_name: yup.string().required(),
  amount: yup.number().positive().required(),
  note: yup.string().nullable().default(""),
  due_date: yup.date().nullable().default(null),
});

type DebtFormData = InferType<typeof debtSchema>;

const FormDebtAddEdit: React.FC<{
  onReload: () => void;
  onClose: () => void;
  initialValues?: IData;
}> = ({ onClose, onReload, initialValues }) => {
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<DebtFormData>({
    resolver: yupResolver(debtSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          due_date: initialValues.due_date
            ? new Date(initialValues.due_date)
            : null,
        }
      : {
          type: "i_owe",
          counterpart_name: "",
          amount: 0,
          note: "",
          due_date: new Date(),
        },
  });

  const onSubmit = async (data: DebtFormData) => {
    setLoading(true);
    const response = await fetch(
      !!initialValues ? `/api/debts/${initialValues.id}` : "/api/debts",
      {
        method: !!initialValues ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (response.status < 400) {
      setLoading(false);
      onReload();
      onClose();
    } else {
      setLoading(false);
      toast.error(result.message);
    }
  };
  return (
    <>
      <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label
            htmlFor="type"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Tipe
          </label>
          <div className="mt-2">
            <div className="flex items-center gap-x-3">
              <input
                id="push-email"
                type="radio"
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                value="i_owe"
                {...register("type")}
              />
              <label
                htmlFor="push-email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Saya hutang
              </label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="push-nothing"
                type="radio"
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                value="owed_to_me"
                {...register("type")}
              />
              <label
                htmlFor="push-nothing"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Saya dihutang
              </label>
            </div>
            {errors.type && (
              <p className="text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="counterpart_name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Nama Orang
            </label>
          </div>
          <div className="mt-2">
            <input
              {...register("counterpart_name")}
              id="counterpart_name"
              type="text"
              autoComplete="off"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.counterpart_name && (
              <p className="text-red-600">{errors.counterpart_name.message}</p>
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="amount"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Jumlah
            </label>
          </div>
          <div className="mt-2">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <>
                  <NumericFormat
                    prefix="Rp "
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={0}
                    allowNegative={false}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue || 0);
                    }}
                    id="amount"
                    type="text"
                    autoComplete="off"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </>
              )}
            />
            {errors.amount && (
              <p className="text-red-600">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="note"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Catatan
            </label>
          </div>
          <div className="mt-2">
            <input
              {...register("note")}
              id="note"
              type="text"
              autoComplete="off"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.note && (
              <p className="text-red-600">{errors.note.message}</p>
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="due_date"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Tanggal
            </label>
          </div>
          <div className="mt-2">
            <input
              {...register("due_date")}
              id="due_date"
              type="text"
              autoComplete="off"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {errors.due_date && (
              <p className="text-red-600">{errors.due_date.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormDebtAddEdit;
