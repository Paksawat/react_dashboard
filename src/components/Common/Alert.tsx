interface AlertProps {
  type: "alert" | "error" | "success";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const alertStyles = {
    alert: {
      title: "Attention needed",
      textColor: "text-[#9D5425]",
      bgColor: "bg-[#FBE8D3]",
      border: "border-[#FBE8D3] border-l-[#9D5425]",
    },
    error: {
      title: "Error occurred",
      textColor: "text-[#D32F2F]",
      bgColor: "bg-[#FDECEA]",
      border: "border-[#FDECEA] border-l-[#D32F2F]",
    },
    success: {
      title: "Success!",
      textColor: "text-[#2E7D32]",
      bgColor: "bg-[#E9F7EF]",
      border: "border-[#E9F7EF] border-l-[#2E7D32]",
    },
  };

  const { title, textColor, bgColor, border } = alertStyles[type];

  return (
    <div
      className={` p-4 rounded ${bgColor} border-4 ${border} fixed bottom-5 max-w-fit min-w-180`}
    >
      <h5 className={`mb-3 text-lg font-semibold ${textColor}`}>{title}</h5>
      <p className={`leading-relaxed ${textColor}`}>{message}</p>
    </div>
  );
};

export default Alert;
