const Summary:React.FC<{title:string; value: number}> = ({title, value}) => {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-lg text-gray-500">{title}</p>
        <h2 className="mt-2 text-5xl font-semibold text-gray-900">{value.toLocaleString()}</h2>
      </div>
    </>
  );
};

export default Summary;
