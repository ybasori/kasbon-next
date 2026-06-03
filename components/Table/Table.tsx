import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide, Plus } from "lucide-react";

const Table: React.FC<{
  loading?: boolean;
  columns: {
    sortable?: boolean;
    label: string;
    name?: string;
    render?: (
      cell?: string,
      row?: { [name: string]: string | number | null | undefined },
    ) => React.ReactNode;
  }[];
  data: { [name: string]: string }[];
  onSort: (value: { by: string; order: "desc" | "asc" }[]) => void;
  sort: { by: string; order: "desc" | "asc" }[];
}> = ({ columns, data, loading = false, onSort, sort=[] }) => {
  const handleSort = (
    item: { name?: string },
    sortItem: { by: string; order: "desc" | "asc" } | undefined,
  ) => {
    if (!!item.name) {
      let newData: {
        by: string;
        order: "asc" | "desc";
      } | null = null;
      if (!!!sortItem) {
        newData = {
          by: item.name,
          order: "asc",
        };
      }
      if (!!sortItem && sortItem.order === "asc") {
        newData = {
          by: item.name,
          order: "desc",
        };
      }
      if (!!newData) {
        onSort?.([...sort.filter((sitem) => sitem.by !== item.name), newData]);
      } else {
        onSort?.([...sort.filter((sitem) => sitem.by !== item.name)]);
      }
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((item, index) => {
                const sortItem = sort.find((s) => s.by === item.name);
                return (
                  <th
                    key={index}
                    className="py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {item.label}{" "}
                    {item.sortable ? (
                      <button onClick={() => handleSort(item, sortItem)}>
                        {!!sortItem ? (
                          sortItem.order === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownWideNarrow size={18} />
                          )
                        ) : (
                          <ArrowDownUp size={18} />
                        )}
                        
                      </button>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td>Memuat</td>
              </tr>
            ) : (
              <>
                {data.length > 0 ? (
                  <>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {columns.map((key, subindex) => (
                          <td
                            key={subindex}
                            className="py-4 text-sm font-medium text-gray-900"
                          >
                            {!!key.render
                              ? key.render(
                                  !!key.name ? item[key.name] : undefined,
                                  item,
                                )
                              : !!key.name
                                ? item[key.name]
                                : undefined}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td>Data Kosong</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
