import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import Signup from "./components/Signup";
import Login from "./components/Login";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/login",
          element: <Login />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
