
import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const Products = React.lazy(() => import('@/pages/Product'))
const CreateProduct = React.lazy(() => import('@/pages/Product/create'))
const Carts = React.lazy(() => import('@/pages/Carts'))
const CreateCart = React.lazy(() => import('@/pages/Carts/create'))
const Users = React.lazy(() => import('@/pages/Users'))
const CreateUser = React.lazy(() => import('@/pages/Users/create'))

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Suspense fallback={loading}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/carts" element={<Carts />} />
              <Route path="/carts/create" element={<CreateCart />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={<CreateUser />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default App;
