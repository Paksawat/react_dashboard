interface DateProp {
  date: string;
}

const LastUpdated: React.FC<DateProp> = ({ date }) => {
  return (
    <div className="absolute right-4 bottom-2 text-sm font-normal italic">
      Last updated: {date}
    </div>
  );
};

export default LastUpdated;
