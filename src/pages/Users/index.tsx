import Table from "@/components/Table";
import { useUser } from "@/hooks/useUser";
import { IUser } from "@/interfaces/user";
import { deleteUser } from "@/services/users";
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
    id: 'name',
    label: 'Nome'
  },
  {
    id: 'age',
    label: 'Idade'
  },
  {
    id: 'gender',
    label: 'Genêro'
  }
]

const Users = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const { handleLoadUsers, users, search } = useUser();
  const [selected, setSelected] = useState<IUser | null>(null);
  const [modal, setModal] = useState<Modal | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  const handleTraitResponse = (data: IUser[]) => {
    return data.map((item) => ({
      ...item,
      image: <img src={item.image} alt={item.name} className="img-thumbnail" style={{ width: 50, height: 50 }} />,
      gender: item.gender === 'male' && 'Masculino' || item.gender === 'famale' && 'Feminino' || 'Outro'
    }));
  }

  const handleRemove = async () => {
    if (!selected) return;
    await deleteUser(String(selected?.id))
    modal?.hide();
    handleLoadUsers();
  }

  useEffect(() => {
    if (modalRef.current) {
      setModal(new Modal(modalRef.current))
    }
  }, []);

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers]);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.age.toString().includes(search);
    });

    setFilteredUsers(filtered);
  }, [search, users]);

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
          navigate('/users/create')
        }}>
          <IoIosAdd style={{
            width: '20px',
            height: '20px',
            marginBottom: '2px',
            color: '#fff',
          }} />
          Novo Usuário </button>
      </div>
      <Table headers={headers} data={filteredUsers}
        traitResponse={handleTraitResponse}
        edit="/users/create?id="
        remove={(user: IUser) => {
          setSelected(user);
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

export default Users;