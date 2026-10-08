
import { createBrowserRouter } from "react-router";
import Home from './../pages/Home';
import Root from "../layouts/Root";
import Login from "../pages/Login";
import Projects from "../components/Home/Projects";
import ProjectsDetails from './../pages/ProjectsDetails';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children:[
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/about",
          element: <Home/>
        },
        {
          path: "/projects",
          element: <Home/>
        },
        {
          path: "/skills",
          element: <Home/>
        },
        {
          path: "/contact",
          element: <Home/>
        },
        {
          path: "/projects/:id",
          element: <ProjectsDetails/>
        },
        {
            path: "/admin/login",
            element: <Login/>
        }
    ]
  },
]);

export default router