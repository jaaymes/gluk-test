import { useProduct } from "@/hooks/useProduct";
import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";


interface IHeadersCell {
  id: string;
  label: string;
}

interface TableProps {
  headers: IHeadersCell[];
  data: any[];
  traitResponse?: (data: any) => any[];
  edit: string;
  remove: (data: any) => void;
  searchBoolean?: boolean
  filterSearch?: any
}

const Table: React.FC<TableProps> = ({ headers, data, traitResponse, edit, remove, searchBoolean = true, filterSearch }) => {
  const [rows, setRows] = useState<any[]>([]);
  const { setSearch, search } = useProduct();
  const [paginate, setPaginate] = useState({
    page: 1,
    total: 0,
    totalPage: 0
  });

  const visibleRow = () => {
    const start = (paginate.page - 1) * 10;
    const end = start + 10;
    return rows.slice(start, end);
  };

  const handleTraitResponse = useCallback(async () => {
    if (traitResponse) {
      setRows(traitResponse(data))
      return
    }
    setRows(data)
  }, [data, traitResponse]);

  useEffect(() => {
    handleTraitResponse()
  }, [handleTraitResponse]);

  useEffect(() => {
    setPaginate({
      page: 1,
      total: rows.length,
      totalPage: Math.ceil(rows.length / 10)
    })
  }, [rows]);

  return (
    <div className="shadow p-2">
      {
        filterSearch && (
          <div className="input-group w-50 px-2 mx-auto pb-4 w-100">
            {
              filterSearch.map((item: any) => (
                <select className="form-select" aria-label="Default select example" onClick={(event) => item.filterFunc(event.currentTarget.value)}>
                  <option selected value="all">{item.label}</option>
                  {
                    item.options.map((option: any) => (
                      <option value={option.id}>{option.label}</option>
                    ))
                  }
                </select>
              ))
            }
          </div>
        )
      }
      {
        searchBoolean && (
          <div className="input-group w-50 px-2 mx-auto pb-4 w-100">
            <input className="form-control border-1 rounded" type="text"
              placeholder="Pesquisar..." aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button className="btn btn-primary">
              <FaSearch
                style={{
                  width: 25,
                  height: 25
                }}
              />
            </button>
          </div>
        )
      }
      <table className="table table-hover table-responsive ">
        <thead>
          <tr>
            {
              headers.map((header) => (
                <th scope="col" key={header.id}>{header.label}</th>
              ))
            }
            <th scope="col" align="right"></th>
          </tr>
        </thead>
        <tbody>
          {
            rows.length > 0 ?
              visibleRow().map((item) => {
                return (
                  <tr key={item.id}>
                    {
                      headers.map((header) => (
                        <td key={header.id}>{item[header.id]}</td>
                      ))
                    }
                    <td align="right">
                      <Link to={`${edit}${item.id}`} className="btn btn-primary me-1">Editar</Link>
                      <button onClick={() => remove(item)} className="btn btn-danger">Remover</button>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={headers.length + 1} align="center">
                    <h4 className="py-4">Nenhum item encontrado</h4>
                  </td>
                </tr>
              )
          }
        </tbody>
      </table>

      <nav >
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {
            Array.from(Array(Math.ceil(rows.length / 10)).keys()).map((page) => (
              <li className="page-item" key={page}>
                <button className="page-link" onClick={() => setPaginate({
                  ...paginate,
                  page: page + 1
                })}>{page + 1}</button>
              </li>
            ))
          }
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Table;