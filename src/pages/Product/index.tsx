import Table from "@/components/Table";
import { useProduct } from "@/hooks/useProduct";
import { IProduct } from "@/interfaces/product";
import { deleteProduct } from "@/services/products";
import { formatPrice } from "@/utils/format";
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
    id: 'image',
    label: 'Imagem'
  },
  {
    id: 'title',
    label: 'Nome'
  },
  {
    id: 'price',
    label: 'Preço'
  },
]

const Products = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const { handleLoadProducts, products, search } = useProduct();
  const [selected, setSelected] = useState<IProduct | null>(null);
  const [modal, setModal] = useState<Modal | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  const handleTraitResponse = (data: IProduct[]) => {
    return data.map((item) => ({
      ...item,
      image: <img src={item.thumbnail} alt={item.title} className="img-thumbnail" style={{ width: 50, height: 50 }} />,
      price: formatPrice(item.price)
    }));
  }

  const handleRemove = async () => {
    if (!selected) return;
    await deleteProduct(selected?.id)
    modal?.hide();
    handleLoadProducts();
  }

  useEffect(() => {
    if (modalRef.current) {
      setModal(new Modal(modalRef.current))
    }
  }, []);

  useEffect(() => {
    handleLoadProducts()
  }, [handleLoadProducts]);

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      return product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.price.toString().includes(search);
    });

    setFilteredProducts(filtered);
  }, [products, search]);

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
          navigate('/products/create')
        }}>
          <IoIosAdd style={{
            width: '20px',
            height: '20px',
            marginBottom: '2px',
            color: '#fff',
          }} />
          Novo Produto </button>
      </div>
      <Table headers={headers} data={filteredProducts} traitResponse={handleTraitResponse} edit="/products/create?id="
        remove={(product: IProduct) => {
          setSelected(product);
          modal?.show();
        }} />

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

export default Products;