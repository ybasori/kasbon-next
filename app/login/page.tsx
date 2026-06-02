"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InferType } from "yup";
import { useAuth } from "@/components/providers/AuthProvider";
import { redirect } from "next/navigation";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

type LoginFormData = InferType<typeof loginSchema>;

export default function LoginPage() {
  const { setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setUser(result.session);
    redirect("/");
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  {...register("email")}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="off"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  {...register("password")}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
