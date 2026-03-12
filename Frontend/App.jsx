import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { router } from "./app.routes";
import { getMe, guestLogin, setDemoUser } from "./src/features/auth/authSlice";
import "./src/shared/styles/global.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 4 sec mein backend respond nahi kiya toh demo user
    const fallbackTimer = setTimeout(() => {
      dispatch(setDemoUser());
    }, 4000);

    dispatch(getMe())
      .unwrap()
      .catch(() => dispatch(guestLogin()).unwrap())
      .finally(() => clearTimeout(fallbackTimer));
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;