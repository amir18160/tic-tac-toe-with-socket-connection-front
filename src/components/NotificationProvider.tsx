import { Toaster } from "react-hot-toast";

const NotificationProvider = () => {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        success: {
          duration: 1500,
          style: { color: "#4c0519" },
        },
        error: {
          duration: 1500,
          style: { color: "#4c0519" },
        },
        style: {
          fontSize: "16px",
          maxWidth: "500px",
          padding: "16px 24px",
        },
      }}
    />
  );
};

export default NotificationProvider;
