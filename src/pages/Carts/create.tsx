import Input from "@/components/Input";
import Select from "@/components/Select";
import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import { useUser } from "@/hooks/useUser";
import { ICart } from "@/interfaces/cart";
import { createCart, updateCart } from "@/services/carts";
import { formatPrice } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const CreateCart = () => {
  const { handleLoadCart } = useCart()
  const { handleLoadProducts, products } = useProduct()
  const { handleLoadUsers, users } = useUser()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const Schema = z.object({
    userId: z.string(),
    total: z.string().optional(),
    totalProducts: z.number().positive().optional(),
    discountedTotal: z.string().optional(),
    status: z.string(),
    products: z.array(z.object({
      id: z.number().positive(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      title: z.string(),
      total: z.number().positive(),
      discountPercentage: z.number(),
      discountedPrice: z.number().positive(),
    }))
  });

  const methods = useForm<ICart>({
    resolver: zodResolver(Schema),
    defaultValues: {
      // @ts-ignore
      totalProducts: '0',
      // @ts-ignore
      status: 'Selecione',
      products: []
    }
  });

  const { control, setValue, watch, handleSubmit } = methods;

  const { append, fields, remove } = useFieldArray({
    name: "products",
    control: control,
  })

  useEffect(() => {
    console.log('fields', fields)
  }, [fields])

  const watchAllFields = watch();

  const handleOnSubmit = async (data: ICart) => {
    if (id) {
      const _data = {
        ...data,
        userId: Number(data.userId),
        total: data.products.reduce((acc, product) => acc + product.total, 0),
        totalProducts: data.products.length,
        discountedTotal: data.products.reduce((acc, product) => acc + product.discountedPrice, 0),
      }

      const response = await updateCart(id as string, _data);
      if (response) {
        window.history.back();
        toast.success("Produto atualizado com sucesso");
      }
    }
    if (!id) {
      const _data = {
        ...data,
        userId: Number(data.userId),
        total: data.products.reduce((acc, product) => acc + product.total, 0),
        totalProducts: data.products.length,
        discountedTotal: data.products.reduce((acc, product) => acc + product.discountedPrice, 0),
      }
      const response = await createCart(_data);
      if (response) {
        window.history.back();
        toast.success("Produto criado com sucesso");
      }
    }
  }

  useEffect(() => {
    if (!id) return;
    handleLoadCart(id).then((response) => {
      console.log(response)
      const { products, ...rest } = response
      const restArray = Object.entries(rest)
      restArray.forEach((item) => {
        if (item[0] === 'totalProducts') {
          // @ts-ignore
          setValue(item[0], item[1])
          return
        }
        if (item[0] === 'discountedTotal') {
          // @ts-ignore
          setValue(item[0], Math.ceil(item[1]))
          return
        }
        // @ts-ignore
        setValue(item[0], String(item[1]))
      })
      setValue('products', products)
    })
  }, [append, handleLoadCart, id, setValue]);

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers]);

  useEffect(() => {
    handleLoadProducts()
  }, [handleLoadProducts]);

  return (
    <div className="container-fluid">
      <div className="d-flex gap-2 w-100 justify-content-between p-2 mb-2">
        <button type="button" className="btn btn-outline-primary"
          onClick={() => { window.history.back() }}
        > <MdOutlineArrowBackIosNew style={{
          width: '20px',
          height: '20px',
          marginBottom: '2px'
        }} /> </button>
        <span className="badge bg-primary w-25" style={{
          fontSize: '1.2rem',
          marginTop: '2px'
        }}>{
            id ? "Editar Produto" : "Criar Produto"
          }</span>
      </div>

      <div className="container-fluid shadow p-2 rounded-2 ">
        <FormProvider {...methods}>
          <div className="row g-4 mt-2">
            <div className="col col-md-4">
              <Controller
                control={control}
                name="userId"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    label="Comprador"
                    options={users.map((user) => ({
                      id: user.id,
                      label: user.name,
                    }))}
                    value={field.value || ""}
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col col-md-4">
              <Controller
                control={control}
                name="discountedTotal"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Desconto Total (%)"
                    isRequired
                    error={!!error}
                    prefix="%"
                    readOnly
                    errorMessage={error?.message}
                    value={String(field.value) || ""}
                    onBlur={(e) => {
                      const value = e.target.value
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </div>

            <div className="col col-md-4">
              <Controller
                control={control}
                name="total"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Total"
                    value={formatPrice(field.value) || formatPrice(watchAllFields.products.reduce((acc, product) => acc + product.total, 0)) || "R$ 0,00"}
                    readOnly
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>
            <div className="col col-md-4">
              <Controller
                control={control}
                name="totalProducts"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Total Produtos"
                    value={field.value + ' produtos' || "0 produtos"}
                    readOnly
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col col-md-4">
              <Controller
                control={control}
                name="status"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    label="Status"
                    value={field.value || ""}
                    options={[
                      {
                        id: 'pending',
                        label: 'Pendente'
                      },
                      {
                        id: 'completed',
                        label: 'Completo'
                      },
                      {
                        id: 'cancelled',
                        label: 'Cancelado'
                      },
                    ]}
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col col-md-12">
              <table className="table table-hover table-responsive">
                <thead>
                  <tr>
                    <th scope="col" >Titulo</th>
                    <th scope="col" >Preço</th>
                    <th scope="col" >Quantidade</th>
                    <th scope="col" >Desconto (%)</th>
                    <th scope="col" >Desconto</th>
                    <th scope="col" >Total</th>
                    <th scope="col" align="right"></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    fields.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.id`}
                            render={({ field, fieldState: { error } }) => (
                              <Select
                                {...field}
                                error={!!error}
                                options={products.map((product) => ({
                                  id: product.id,
                                  label: product.title,
                                }))}
                                onChange={(event) => {
                                  const id = Number(event.target.value);
                                  field.onChange(id);
                                  if (products && id) {
                                    setValue(`products.${index}.price`,
                                      products.filter((product) => product.id === id)[0].price)
                                    setValue(`products.${index}.title`,
                                      products.filter((product) => product.id === id)[0].title)
                                    setValue(`products.${index}.total`,
                                      Number(watchAllFields.products[index].quantity) * Number(products.filter((product) => product.id === id)[0].price)
                                    )
                                  }
                                }}
                                errorMessage={error?.message}
                                value={field.value || ""}
                              />
                            )}
                          />
                        </td>

                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.price`}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                {...field}
                                error={!!error}
                                readOnly
                                errorMessage={error?.message}
                                value={formatPrice(field.value) || ""}
                              />
                            )}
                          />
                        </td>

                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.quantity`}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                {...field}
                                error={!!error}
                                type="number"
                                errorMessage={error?.message}
                                onChange={(event) => {
                                  const quantity = Number(event.target.value);
                                  field.onChange(quantity);
                                  setValue(`products.${index}.total`,
                                    (quantity * Number(watchAllFields.products[index].price)) - (quantity * Number(watchAllFields.products[index].discountedPrice)))
                                  setValue(`products.${index}.discountedPrice`,
                                    (quantity * (Number(watchAllFields.products[index].discountedPrice)))
                                  )
                                }}
                                value={field.value || ""}
                              />
                            )}
                          />
                        </td>

                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.discountPercentage`}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                {...field}
                                error={!!error}
                                errorMessage={error?.message}
                                value={field.value || ""}
                                onBlur={(event) => {
                                  field.onChange(Number(event.target.value));
                                  if (event.target.value === '') {
                                    setValue(`products.${index}.discountedPrice`, 0)
                                    setValue(`products.${index}.total`,
                                      Number(watchAllFields.products[index].quantity) * Number(watchAllFields.products[index].price)
                                    )
                                    return
                                  }
                                  setValue(`products.${index}.discountedPrice`,
                                    (Number(watchAllFields.products[index].total) * Number(event.target.value) / 100)
                                  )
                                  setValue(`products.${index}.total`,
                                    Number(watchAllFields.products[index].total) - (Number(watchAllFields.products[index].total) * Number(event.target.value) / 100)
                                  )
                                }}
                              />
                            )}
                          />
                        </td>


                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.discountedPrice`}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                {...field}
                                error={!!error}
                                readOnly
                                errorMessage={error?.message}
                                value={formatPrice(field.value) || "R$ 0,00"}
                              />
                            )}
                          />
                        </td>

                        <td>
                          <Controller
                            control={control}
                            name={`products.${index}.total`}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                {...field}
                                error={!!error}
                                readOnly
                                errorMessage={error?.message}
                                value={formatPrice(field.value) || ""}
                              />
                            )}
                          />
                        </td>

                        <td align="right">
                          <button onClick={() => {
                            remove(index)
                            setValue('totalProducts', Number(watchAllFields.totalProducts) - 1)
                            setValue('total', Number(watchAllFields.total) - Number(watchAllFields.products[index].total))
                          }} className="btn btn-danger">
                            <FaTrash style={{
                              marginBottom: '5px',
                            }} />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <button onClick={() => {
                {/* @ts-ignore */ }
                append({
                  quantity: 1
                })
                setValue('totalProducts', Number(watchAllFields.totalProducts) + 1)
              }} className="btn btn-primary mt-2 btn-sm ">Adicionar Produto</button>

            </div>
            <div className="col-12 text-end">
              <button onClick={handleSubmit(handleOnSubmit)} className="btn btn-primary mt-2 btn-lg ">Enviar</button>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}

export default CreateCart;