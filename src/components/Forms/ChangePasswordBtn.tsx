import { useAuth0 } from "@auth0/auth0-react";
import Alert from "@/components/Common/Alert";
import { useEffect, useState } from "react";

const ChangePasswordBtn = () => {
  const { user } = useAuth0();
  const [alertData, setAlertData] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  useEffect(() => {
    if (alertData) {
      const timer = setTimeout(() => {
        setAlertData(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertData]);
  const handleChangePassword = async () => {
    const url = `https://${domain}/dbconnections/change_password`;
    const data = {
      client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
      email: user?.email,
      connection: "Username-Password-Authentication",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAlertData({
          type: "success",
          message: "Password reset email sent! Please check your inbox.",
        });
      } else {
        const error = await response.json();
        setAlertData({
          type: "error",
          message: error.error_description || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error sending password reset email:", err);
      alert("An error occurred while sending the password reset email.");
    }
  };
  return (
    <>
      <button
        onClick={handleChangePassword}
        className="bg-[#2D59FD] py-2 px-4 rounded-md text-white shadow-default hover:bg-[#8BA9FF] transition-all"
      >
        Change Password
      </button>
      {alertData && <Alert type={alertData.type} message={alertData.message} />}
    </>
  );
};

export default ChangePasswordBtn;
