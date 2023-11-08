import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="navbar navbar-expand-md sticky-top flex-md-nowrap p-0 bg-white shadow">
      <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 text-center bg-white" to="/">
        <img src="/images/logo.webp" alt="" width="120" height="30" />
      </Link>
      <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </header>
  )
}

export default Header;