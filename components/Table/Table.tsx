const Table: React.FC<{
  columns: {
    label: string;
    name?: string;
    render?: (
      cell?: string,
      row?: { [name: string]: string },
    ) => React.ReactNode;
  }[];
  data: { [name: string]: string }[];
}> = ({ columns, data }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((item, index) => (
                <th
                  key={index}
                  className="py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="transition-colors hover:bg-gray-50">
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
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
