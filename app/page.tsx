"use client";

import Modal from "@/components/Modal/Modal";
import { useAuth } from "@/components/providers/AuthProvider";
import Summary from "@/components/Summary/Summary";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [openAdd, setOpenAdd] = useState(false)

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);

  return (
    <>
      <div className="bg-white p-6">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Summary />
            <Summary />
            <Summary />
          </div>
        </div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>

          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500" onClick={()=>setOpenAdd(true)}>
            Add user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="py-3 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th className="py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Lindsay Walton
                </td>
                <td className="py-4 text-sm text-gray-500">
                  Front-end Developer
                </td>
                <td className="py-4 text-sm text-gray-500">
                  lindsay.walton@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Member</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>

              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Courtney Henry
                </td>
                <td className="py-4 text-sm text-gray-500">Designer</td>
                <td className="py-4 text-sm text-gray-500">
                  courtney.henry@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Admin</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>

              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Tom Cook
                </td>
                <td className="py-4 text-sm text-gray-500">
                  Director of Product
                </td>
                <td className="py-4 text-sm text-gray-500">
                  tom.cook@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Member</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>

              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Whitney Francis
                </td>
                <td className="py-4 text-sm text-gray-500">Copywriter</td>
                <td className="py-4 text-sm text-gray-500">
                  whitney.francis@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Admin</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>

              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Leonard Krasner
                </td>
                <td className="py-4 text-sm text-gray-500">Senior Designer</td>
                <td className="py-4 text-sm text-gray-500">
                  leonard.krasner@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Owner</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>

              <tr>
                <td className="py-4 text-sm font-medium text-gray-900">
                  Floyd Miles
                </td>
                <td className="py-4 text-sm text-gray-500">
                  Principal Designer
                </td>
                <td className="py-4 text-sm text-gray-500">
                  floyd.miles@example.com
                </td>
                <td className="py-4 text-sm text-gray-500">Member</td>
                <td className="py-4 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {openAdd?<Modal title="Add" onClose={()=>setOpenAdd(false)}>hi</Modal>:null}
    </>
  );
}
