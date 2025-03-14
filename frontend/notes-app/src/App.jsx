import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './pages/Home/home'
import Login from './pages/Login/login';
import SignUp from './pages/SignUp/signup';

const router = createBrowserRouter ([
  {
    path: "/dashboard",
    element: <Home />,
  },

  {
    path:"/login",
    element: <Login />,
  },
  
  {
    path:"/signup",
    element: <SignUp />,
  },
]);

function App() {

  return <RouterProvider router={router} />
}

export default App
