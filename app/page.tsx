"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import FormDebtAddEdit from "@/components/FormDebtAddEdit/FormDebtAddEdit";
import Modal from "@/components/Modal/Modal";
import { useAuth } from "@/components/providers/AuthProvider";
import Summary from "@/components/Summary/Summary";
import Table from "@/components/Table/Table";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
export default function Home() {
  const { user } = useAuth();
  const [oneTime, setOneTime] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [isLoadingPaid, setLoadingPaid] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<IData | null>(null);
  const [openDelete, setOpenDelete] = useState<IData | null>(null);
  const [openPaid, setOpenPaid] = useState<IData | null>(null);
  const [dataDebt, setDataDebt] = useState<IData[]>([]);
  const [filter, setFilter] = useState<{
    status?: { label: string; value?: string | null };
    tipe?: { label: string; value?: string | null };
    name?: { label: string; value?: string | null };
  } | null>(null);
  const [sort, setSort] = useState<{ by: string; order: "asc" | "desc" }[]>([]);

  const getDueStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    // Remove time portion
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffMs = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} hari lagi`;
    }

    if (diffDays === 0) {
      return "Hari ini";
    }

    return `${Math.abs(diffDays)} hari lalu`;
  };

  const onGetDebt = useCallback(async () => {
    setLoading(true);
    let query:string[] = [];
    if (!!filter) {
      query = [
        ...Object.keys(filter)
          .filter((key) => filter[key as keyof typeof filter]?.value !== null)
          .map(
            (key) =>
              `filter[${key}]=${filter[key as keyof typeof filter]?.value}`,
          ),
      ];
    }
    if (sort.length > 0) {
      query = [
        ...query,
        ...sort.map(
          (item, index) =>
            `sort[${index}][by]=${item.by}&sort[${index}][order]=${item.order}`,
        ),
      ];
    }
    const response = await fetch("/api/debts?" + query.join("&"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.access_token}`,
      },
    });

    const result = await response.json();
    if (response.status < 400) {
      setDataDebt(result);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(result.message);
    }
  }, [filter, sort, user?.access_token]);

  const calculatOwedToMe = (data: IData[]) => {
    return data.length > 0
      ? [
          ...data
            .filter(
              (item) => item.type === "owed_to_me" && item.settled_at === null,
            )
            .map((item) => item.amount),
          0,
          0,
        ].reduce((a, b) => a + b)
      : 0;
  };

  const calculatIOwe = (data: IData[]) => {
    return data.length > 0
      ? [
          ...data
            .filter((item) => item.type === "i_owe" && item.settled_at === null)
            .map((item) => item.amount),
          0,
          0,
        ].reduce((a, b) => a + b)
      : 0;
  };

  const calculateNet = (data: IData[]) => {
    return calculatOwedToMe(data) - calculatIOwe(data);
  };

  const onDeleteDebt = useCallback(
    async (id: string) => {
      setLoadingDelete(true);
      const response = await fetch("/api/debts/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      });

      const result = await response.json();
      if (response.status < 400) {
        setLoadingDelete(false);
        setOneTime(true);
        setOpenDelete(null);
      } else {
        setLoadingDelete(false);
        toast.error(result.message);
      }
    },
    [user?.access_token],
  );
  const onPaidDebt = useCallback(
    async (data: IData) => {
      setLoadingPaid(true);
      const response = await fetch("/api/debts/" + data.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ ...data, settled_at: new Date().toISOString() }),
      });

      const result = await response.json();

      if (response.status < 400) {
        setLoadingPaid(false);
        setOneTime(true);
        setOpenPaid(null);
      } else {
        setLoadingPaid(false);
        toast.error(result.message);
      }
    },
    [user?.access_token],
  );

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);

  useEffect(() => {
    if (oneTime) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOneTime(false);

      onGetDebt();
    }
  }, [oneTime, onGetDebt]);

  return (
    <>
      <div className="bg-white p-6">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Summary
              title="Total dihutang ke saya"
              value={calculatOwedToMe(dataDebt)}
            />
            <Summary title="Total saya hutang" value={calculatIOwe(dataDebt)} />
            <Summary title="Net" value={calculateNet(dataDebt)} withColor />
          </div>
        </div>
        <div className="flex items-start justify-between mb-8">
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
            onClick={() => setOneTime(true)}
          >
            Muat Ulang
          </button>

          <Dropdown
            label={"Status"}
            options={[
              { label: "Semua", value: null },
              { label: "lunas", value: "paid" },
              { label: "belum lunas", value: "not_paid" },
            ]}
            value={filter?.status}
            onChange={(res) => {
              setFilter({ ...filter, status: res });
              setOneTime(true);
            }}
          />
          <Dropdown
            label={"Tipe"}
            options={[
              { label: "Semua", value: null },
              { label: "hutang", value: "i_owe" },
              { label: "dihutang", value: "owed_to_me" },
            ]}
            value={filter?.tipe}
            onChange={(res) => {
              setFilter({ ...filter, tipe: res });
              setOneTime(true);
            }}
          />

          <button
            className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
            onClick={() => setOpenAdd(true)}
          >
            + Catat baru
          </button>
        </div>
        <div className="flex items-start justify-between mb-8">
          <input
            id="note"
            type="text"
            autoComplete="off"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            placeholder="cari nama"
            onChange={(e) => {
              setFilter({
                ...filter,
                name: {
                  label: e.currentTarget.value,
                  value:
                    e.currentTarget.value === ""
                      ? null
                      : "%" + e.currentTarget.value + "%",
                },
              });
              setOneTime(true);
            }}
          />
        </div>

        <Table
          loading={isLoading}
          columns={[
            {
              label: "Nama orang",
              name: "counterpart_name",
            },
            {
              label: "Tipe",
              name: "type",
              render(cell) {
                return <>{cell === "i_owe" ? "saya hutang" : "dihutang"}</>;
              },
            },
            {
              label: "Jumlah",
              name: "amount",
              sortable: true,
              render(cell) {
                return (
                  <>
                    {Number(cell).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </>
                );
              },
            },
            {
              label: "Tanggal Relative",
              name: "due_date",
              sortable: true,
              render(cell) {
                return <>{getDueStatus(cell ?? "")}</>;
              },
            },
            {
              label: "Status",
              name: "settled_at",
              render(cell) {
                return <>{!!cell ? "Lunas" : "Belum lunas"}</>;
              },
            },
            {
              label: "Aksi",
              name: "settled_at",
              render(_cell, row) {
                return (
                  <>
                    <button
                      className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:bg-gray-300"
                      onClick={() => setOpenPaid(row as unknown as IData)}
                      disabled={(row as unknown as IData).settled_at !== null}
                    >
                      Tandai Lunas
                    </button>
                    <button
                      className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
                      onClick={() => setOpenEdit(row as unknown as IData)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-auto rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-500"
                      onClick={() => setOpenDelete(row as unknown as IData)}
                    >
                      Hapus
                    </button>
                  </>
                );
              },
            },
          ]}
          data={dataDebt}
          onSort={(data) => {
            console.log(data);
            setSort([...data]);
            setOneTime(true);
          }}
          sort={sort}
        />
      </div>
      {openAdd ? (
        <Modal title="Catat Baru" onClose={() => setOpenAdd(false)}>
          <FormDebtAddEdit
            onReload={() => {
              setOneTime(true);
            }}
            onClose={() => setOpenAdd(false)}
          />
        </Modal>
      ) : null}
      {!!openEdit ? (
        <Modal title={"Edit"} onClose={() => setOpenEdit(null)}>
          <FormDebtAddEdit
            initialValues={openEdit}
            onReload={() => {
              setOneTime(true);
            }}
            onClose={() => setOpenEdit(null)}
          />
        </Modal>
      ) : null}
      {!!openDelete ? (
        <Modal
          title={"Hapus"}
          onClose={() => setOpenDelete(null)}
          isStatic
          footer={
            <>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                onClick={() => onDeleteDebt(openDelete.id)}
                disabled={isLoadingDelete}
              >
                Hapus
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:bg-gray-300"
                disabled={isLoadingDelete}
                onClick={() => setOpenDelete(null)}
              >
                Batal
              </button>
            </>
          }
        >
          Apakah anda yakin?
        </Modal>
      ) : null}
      {!!openPaid ? (
        <Modal
          title={"Tandai Lunas"}
          onClose={() => setOpenPaid(null)}
          isStatic
          footer={
            <>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                onClick={() => onPaidDebt(openPaid)}
                disabled={isLoadingPaid}
              >
                Tandai Lunas
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:bg-gray-300"
                disabled={isLoadingPaid}
                onClick={() => setOpenPaid(null)}
              >
                Batal
              </button>
            </>
          }
        >
          Apakah anda yakin?
        </Modal>
      ) : null}
    </>
  );
}
