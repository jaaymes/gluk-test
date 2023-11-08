import Table from "@/components/Table";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { ICart } from "@/interfaces/cart";
import { deleteProduct } from "@/services/products";
import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const headers = [
  {
    id: 'id',
    label: 'ID'
  },
  {
    id: 'user',
    label: 'Comprador'
  },
  {
    id: 'total',
    label: 'Valor Total'
  },
  {
    id: 'totalQuantity',
    label: 'Quantidade Total'
  },
  {
    id: 'status',
    label: 'Status'
  },
]

const Carts = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const { handleLoadCarts, carts, search } = useCart();
  const { handleLoadUsers, users } = useUser()
  const [selected, setSelected] = useState<ICart | null>(null);
  const [modal, setModal] = useState<Modal | null>(null)
  const [filteredCarts, setFilteredCarts] = useState<ICart[]>([]);

  const handleTraitResponse = (data: ICart[]) => {
    return data.map((item) => ({
      ...item,
      status: item.status === 'pending' && <span className="badge bg-warning text-dark">Pendente</span>
        || item.status === 'completed' && <span className="badge bg-success">Finalizado</span> ||
        <span className="badge bg-danger">Cancelado</span>,
      user: users.filter((user) => user.id === item.userId)[0]?.name,
      total: item.total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
      totalQuantity: `${item.totalProducts} unidade(s)`,
    }));
  }

  const handleRemove = async () => {
    if (!selected) return;
    await deleteProduct(selected?.id)
    modal?.hide();
    handleLoadCarts();
  }

  const handleFilter = (filter: string) => {
    if (filter === 'all') {
      return setFilteredCarts(carts)
    }
    const filtred = carts.filter((carts) => {
      return carts.status === filter
    });
    setFilteredCarts(filtred)
  }

  useEffect(() => {
    if (modalRef.current) {
      setModal(new Modal(modalRef.current))
    }
  }, []);

  useEffect(() => {
    handleLoadCarts()
  }, [handleLoadCarts]);

  useEffect(() => {
    if (!search) {
      setFilteredCarts(carts);
      return;
    }

    const filtered = carts.filter((product) => {
      return product.status.toLowerCase().includes(search.toLowerCase()) ||
        product.userId.toString().includes(search);
    });

    setFilteredCarts(filtered);
  }, [carts, search]);

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers]);

  return (
    <div className="container-fluid">
      <div className="d-flex gap-2 w-100 justify-content-between p-2 mb-2">
        <button type="button" className="btn btn-outline-primary"
          onClick={() => {
            window.history.back();
          }}
        > <MdOutlineArrowBackIosNew style={{
          width: '20px',
          height: '20px',
          marginBottom: '2px'
        }} /> </button>
        <button type="button" className="btn btn-primary" onClick={() => {
          navigate('/carts/create')
        }}>
          <IoIosAdd style={{
            width: '20px',
            height: '20px',
            marginBottom: '2px',
            color: '#fff',
          }} />
          Novo Pedido </button>
      </div>
      <Table headers={headers} data={filteredCarts}
        traitResponse={handleTraitResponse}
        edit="/carts/create?id="
        remove={(product: ICart) => {
          setSelected(product);
          modal?.show();
        }}
        searchBoolean={false}
        filterSearch={[
          {
            id: 'status',
            label: 'Status',
            filterFunc: handleFilter,
            options: [
              {
                id: 'pending',
                label: 'Pendente'
              },
              {
                id: 'completed',
                label: 'Finalizado'
              },
              {
                id: 'canceled',
                label: 'Cancelado'
              }
            ]
          }
        ]}
      />

      <div className="modal" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Remover item?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={handleRemove}>Remover</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carts;