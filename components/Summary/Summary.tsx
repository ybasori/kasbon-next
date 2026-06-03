"use client";

const Summary: React.FC<{
  title: string;
  value: number;
  withColor?: boolean;
}> = ({ title, value, withColor = false }) => {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-lg text-gray-500">{title}</p>
        <h2
          className={`mt-2 text-lg font-semibold text-gray-900 ${withColor ? (value < 0 ? "text-red-600" : "text-green-600") : ""}`}
        >
          {value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </h2>
      </div>
    </>
  );
};

export default Summary;
