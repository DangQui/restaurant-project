import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import HomePage from '@/pages/Home/Home'
import AboutPage from '@/pages/About/About'
import ContactPage from '@/pages/Contact/Contact'
import MenuPage from '@/pages/Menu/Menu'
import ProductPage from '@/pages/Product/Product'
import SearchPage from '@/pages/Search/Search'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'menu/:productId', element: <ProductPage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
