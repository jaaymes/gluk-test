import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { handleLoadProducts, products } = useProduct()
  const { users, handleLoadUsers } = useUser()
  const { carts, handleLoadCarts } = useCart()

  useEffect(() => {
    handleLoadProducts()
  }, [handleLoadProducts])

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers])

  useEffect(() => {
    handleLoadCarts()
  }, [handleLoadCarts])

  return (
    <div className="container-fluid d-flex flex-column gap-2">
      <div className="card w-100">
        <div className="card-header">
          <h5 className="card-title">Vendas</h5>
        </div>
        <div className="card-body text-start align-items-center gap-4 w-100">
          <img src="/images/carts.png" className="img-thumbnail " style={{ width: '10rem' }} />
          <div>
            <h5 className="card-text">
              Contem {carts.length} vendas no total
            </h5>
            <h5 className="card-text">
              Contem {carts.filter(cart => cart.status === 'completed').length} vendas <span className="badge bg-success">completadas</span>
            </h5>
            <h5 className="card-text">
              Contem {carts.filter(cart => cart.status === 'cancelled').length} vendas <span className="badge bg-danger">canceladas</span>
            </h5>

            <h5 className="card-text">
              Contem {carts.filter(cart => cart.status === 'pending').length} vendas <span className="badge bg-warning">pendentes</span>
            </h5>

          </div>
          <Link to="/carts" className="btn btn-primary px-4" style={{ marginLeft: 'auto' }}>
            Ir para vendas
          </Link>
        </div>
      </div>
      <div className="row gap-1">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Produtos</h5>
            </div>
            <div className="card-body w-100 text-center gap-4 align-items-center ">
              <img src="/images/product.png" className="img-thumbnail" style={{ width: '10rem' }} />
              <h6 className="card-text">
                Contem {products.length} produtos cadastrados
              </h6>
              <Link to="/products" className="btn btn-primary">
                Ir para produtos
              </Link>
            </div>
          </div>
        </div>


        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Usuários</h5>
            </div>
            <div className="card-body w-100 text-center gap-4 align-items-center ">
              <img src="/images/users.png" className="img-thumbnail" style={{ width: '10rem' }} />
              <h6 className="card-text">
                Contem {users.length} usuários cadastrados
              </h6>
              <Link to="/users" className="btn btn-primary">
                Ir para usuários
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;