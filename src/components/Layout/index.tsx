// import Sidebar from "../Sidebar"

import Header from "../Header"
import Sidebar from "../Sidebar"


const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Header />
      <div className="container-fluid mt-4">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout