import Input from "@/components/Input";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import { useProduct } from "@/hooks/useProduct";
import { IProduct } from "@/interfaces/product";
import { createProduct, updateProduct } from "@/services/products";
import { formatPrice } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const CreateProduct = () => {
  const { handleLoadProduct } = useProduct()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const Schema = z.object({
    title: z.string({
      required_error: "O campo titulo é obrigatório",
    }).min(1, { message: "O campo titulo é obrigatório" }),
    price: z.string({
      required_error: "O campo preço é obrigatório"
    }).min(1, { message: "O campo preço é obrigatório" }),
    category: z.string({
      required_error: "O campo categoria é obrigatório"
    }).min(1, { message: "O campo categoria é obrigatório" }),
    description: z.string({
      required_error: "O campo descrição é obrigatório"
    }).min(1, { message: "O campo descrição é obrigatório" }),
    thumbnail: z.string({
      required_error: "O campo thumbnail é obrigatório"
    }).min(1, { message: "O campo thumbnail é obrigatório" }),
    discountPercentage: z.string({
      required_error: "O campo desconto é obrigatório"
    }).min(1, { message: "O campo desconto é obrigatório" }),
    stock: z.string({
      required_error: "O campo estoque é obrigatório"
    }).min(1, { message: "O campo estoque é obrigatório" }),
  });

  const methods = useForm<IProduct>({
    resolver: zodResolver(Schema),
  });

  const { control, setValue, watch, handleSubmit } = methods;

  const watchAllFields = watch();

  const handleOnSubmit = async (data: IProduct) => {
    if (id) {
      const _data = {
        ...data,
        price: Number(data.price),
        discountPercentage: Number(data.discountPercentage),
        stock: Number(data.stock),
      }
      const response = await updateProduct(id as string, _data);
      if (response) {
        window.history.back();
        toast.success("Produto atualizado com sucesso");
      }
    }
    if (!id) {
      const _data = {
        ...data,
        price: Number(data.price),
        discountPercentage: Number(data.discountPercentage),
        stock: Number(data.stock),
      }
      const response = await createProduct(_data);
      if (response) {
        window.history.back();
        toast.success("Produto criado com sucesso");
      }
    }
  }

  useEffect(() => {
    console.log(watchAllFields)
  }, [watchAllFields]);

  useEffect(() => {
    if (!id) return;
    handleLoadProduct(id).then((response) => {
      console.log(response)
      const responseArray = Object.entries(response as IProduct);
      responseArray.forEach((item) => {
        return setValue(item[0] as any, String(item[1]));
      });
    });
  }, [handleLoadProduct, id, setValue]);

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
        {
          watchAllFields.thumbnail && (
            <div className="d-flex w-100 align-items-center  justify-content-center ">
              <img src={watchAllFields.thumbnail} alt="" className="img-thumbnail"
                style={{
                  width: '160px',
                  height: '120px'
                }}
              />
            </div>

          )
        }
        <FormProvider {...methods}>
          <div className="row g-4 mt-2">
            <div className="col col-md-6">
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Titulo"
                    value={field.value}
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col col-md-6">
              <Controller
                control={control}
                name="category"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Categoria"
                    value={field.value || ""}
                    options={[
                      {
                        id: "laptops",
                        label: "Laptops",
                      },
                      {
                        id: "fragrances",
                        label: "Fragancias",
                      },
                      {
                        id: "skincare",
                        label: "Cuidado com a pele",
                      },
                      {
                        id: "groceries",
                        label: "Mercearias",
                      },
                      {
                        id: "home-decoration",
                        label: "Decoração de casa",
                      }
                    ]}
                    isRequired />
                )}
              />
            </div>

            <div className="col col-md-12">
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState: { error } }) => (
                  <TextArea
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Descrição"
                    value={field.value || ""}
                    rows={5}
                    isRequired />
                )}
              />
            </div>
            <div className="col col-md-4">
              <Controller
                control={control}
                name="discountPercentage"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Desconto (%)"
                    prefix="%"
                    value={field.value || ""}
                    onChange={event => {
                      const value = event.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                    isRequired />
                )}
              />
            </div>

            <div className="col col-md-4">
              <Controller
                control={control}
                name="price"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Preço"
                    value={formatPrice(field.value) || ""}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, "");
                      field.onChange((Number(value) / 100).toFixed(2));
                    }}
                    isRequired />
                )}
              />
            </div>

            <div className="col col-md-4">
              <Controller
                control={control}
                name="stock"
                shouldUnregister={true}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Estoque"
                    value={field.value}
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col">
              <Controller
                control={control}
                name="thumbnail"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="thumbnail"
                    value={field.value || ""}
                  />
                )}
              />
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

export default CreateProduct;