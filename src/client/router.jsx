import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Search from "./components/Search";
import Profile from "./components/Profile";
import User from "./components/User";
import Comments from "./components/Comments";
import Likes from "./components/Likes";
import Settings from "./components/Settings";
import Post from "./components/Post";
import EditAccount from "./components/EditAccount";
import ErrorPage from "./components/ErrorPage";
import Inbox from "./components/Inbox";
import Followers from "./components/Followers";
import Following from "./components/Following";
import AdminPosts from "./components/AdminPosts";
import AdminComments from "./components/AdminComments";
import AdminSearchPost from "./components/AdminSearchPosts";
import AdminSearchUsers from "./components/AdminSearchUsers";
import AdminSearchComments from "./components/AdminSearchComments";
import AdminDisplayPost from "./components/AdminDisplayPost";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Search />
        },
        {
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/feed",
          element: <Feed />
        },
        {
          path: "/:id/profile",
          element: <Profile />
        },
        {
          path: "/:postId/comments",
          element: <Comments />
        },
        {
          path: "/:postId/likes",
          element: <Likes />
        },
        {
          path: "/user",
          element: <User />
        },
        {
          path: "/user/settings",
          element: <Settings />
        },
        {
          path: "/user/settings/edit",
          element: <EditAccount />
        },
        {
          path: "/post",
          element: <Post />
        },
        {
          path: "/post/edit/:postId",
          element: <Post />
        },
        {
          path: "/inbox",
          element: <Inbox />
        },
        {
          path: "/:id/followers",
          element: <Followers />
        },
        {
          path: "/:id/following",
          element: <Following />
        },
        ,
        {
          path: "/admin/:id",
          element: <AdminSearchUsers />
        },
        {
          path: "/admin/:adminId/:user/posts",
          element: <AdminPosts />
        },
        {
          path: "/admin/:adminId/:user/comments",
          element: <AdminComments />
        },
        {
          path: "/admin/:adminId/posts",
          element: <AdminSearchPost />
        },
        {
          path: "/admin/:adminId/comments",
          element: <AdminSearchComments />
        },
        {
          path: "/admin/:adminId/post/:postId",
          element: <AdminDisplayPost />
        }
      ],
      errorElement: <ErrorPage />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
