import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { router } from "./app.routes";
import { getMe, guestLogin } from "./src/features/auth/authSlice";
import "./src/shared/styles/global.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Pehle check karo logged in hai ya nahi
    dispatch(getMe())
      .unwrap()
      .catch(() => {
        // getMe fail matlab koi session nahi — auto guest login
        dispatch(guestLogin());
      });
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;