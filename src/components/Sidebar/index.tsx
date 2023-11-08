import { Link, useLocation } from "react-router-dom"


const Sidebar = () => {
  const location = useLocation()
  const routes = [
    {
      href: "/",
      label: "Inicio"
    },
    {
      href: '/products',
      label: 'Produtos'
    },
    {
      href: '/carts',
      label: 'Carrinho'
    },
    {
      href: '/users',
      label: 'Usuários'
    }
  ]
  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {
            routes.map((route, index) => (
              <li className={`nav-item ${location.pathname === route.href ? 'active' : ''}`} key={index}>
                <Link to={route.href} className={`nav-link ${location.pathname === route.href ? 'active' : ''}`}>
                  <span data-feather="home"></span>
                  {route.label}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar