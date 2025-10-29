import { useState, useEffect } from "react";
import SelectSingle from "@/components/Forms/SelectSingle";
import { useSendFeedbackMutation } from "@/api/apiSlice";
import { FeedbackData, Option } from "@/types";
import { useForm, Controller } from "react-hook-form";

const Feedback = () => {
  const experienceOptions: Option[] = [
    { value: "terrible", label: "Terrible" },
    { value: "bad", label: "Bad" },
    { value: "okay", label: "Okay" },
    { value: "good", label: "Good" },
    { value: "amazing", label: "Amazing" },
  ];
  const topicOptions: Option[] = [
    { label: "No topic", value: "" },
    { label: "Bug", value: "bug" },
    { label: "Request", value: "request" },
    { label: "Profile", value: "profile" },
    { label: "Metrics", value: "metrics" },
    { label: "Graphs", value: "graphs" },
    { label: "Notifications", value: "notifications" },
    { label: "Report", value: "report" },
  ];

  const [selectedValue, setSelectedValue] = useState<string>("amazing");
  const [sendFeedback, { isLoading, isError, isSuccess }] =
    useSendFeedbackMutation();
  const [messageVisible, setMessageVisible] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackData>();

  const onSubmit = async (data: FeedbackData) => {
    try {
      await sendFeedback({ ...data, experience: selectedValue }).unwrap();
      reset();
      setMessageVisible(true);
    } catch (error) {
      console.error("Failed to send feedback", error);
      setMessageVisible(true);
    }
  };

  // Hide success/error messages after 3 seconds
  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError]);

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h2 className="text-title-lg font-semibold text-title my-2 3xl:text-title-xxl">
          Send feedback
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <fieldset disabled={isLoading} className="space-y-4">
            <div className="mb-4.5">
              <div className="w-full mb-4">
                <p className="mb-4 text-gray-700">
                  What is your experience with the dashboard?
                </p>
                <div className="flex flex-wrap items-center justify-start space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10">
                  {experienceOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => setSelectedValue(option.value)}
                      className={`px-4 py-2 border rounded-lg cursor-pointer ${
                        selectedValue === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Controller
              name="category"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectSingle options={topicOptions} {...field} />
              )}
            />
            {errors.category && (
              <p className="text-red">{errors.category.message}</p>
            )}

            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Message
              </label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={6}
                placeholder="Type your message"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
              {errors.message && (
                <p className="text-red">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {isLoading ? "Sending..." : "Send Feedback"}
            </button>
          </fieldset>

          {/* Success/Error Messages */}
          {messageVisible && isSuccess && (
            <p className="text-success mt-2">Feedback sent successfully!</p>
          )}
          {messageVisible && isError && (
            <p className="text-red mt-2">Failed to send feedback</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Feedback;
