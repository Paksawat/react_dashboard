import ChangePasswordBtn from "@/components/Forms/ChangePasswordBtn";

const Settings = () => {
  return (
    <>
      <h2 className="text-title-lg font-semibold text-title my-2 3xl:text-title-xxl">
        Settings
      </h2>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">
          <ChangePasswordBtn />
        </div>
      </div>
    </>
  );
};

export default Settings;
