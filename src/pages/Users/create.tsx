import Input from "@/components/Input";
import Select from "@/components/Select";
import { useUser } from "@/hooks/useUser";
import { IUser } from "@/interfaces/user";
import { consultCep } from "@/services/consultCep";
import { createUser, updateUser } from "@/services/users";
import { formatPhone, normalizeNumber, normalizeZipcode } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const CreateUser = () => {
  const { handleLoadUser } = useUser()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const Schema = z.object({
    name: z.string({
      required_error: "O campo nome é obrigatório",
    }).min(1, { message: "O campo nome é obrigatório" }),
    gender: z.string({
      required_error: "O campo genêro é obrigatório"
    }).min(1, { message: "O campo genêro é obrigatório" }),
    age: z.number(),
    email: z.string({
      required_error: "O campo email é obrigatório"
    }).min(1, { message: "O campo email é obrigatório" }),
    birthDate: z.string({
      required_error: "O campo data de nascimento é obrigatório"
    }).min(1, { message: "O campo data de nascimento é obrigatório" }),
    phone: z.string({
      required_error: "O campo celular é obrigatório"
    }).min(1, { message: "O campo celular é obrigatório" }),
    image: z.string({
      required_error: "O campo imagem é obrigatório"
    }).min(1, { message: "O campo imagem é obrigatório" }),
    address: z.object({
      zipcode: z.string({
        required_error: "O campo CEP é obrigatório"
      }).min(1, { message: "O campo CEP é obrigatório" }),
      streetName: z.string({
        required_error: "O campo rua é obrigatório"
      }).min(1, { message: "O campo rua é obrigatório" }),
      district: z.string({
        required_error: "O campo bairro é obrigatório"
      }).min(1, { message: "O campo bairro é obrigatório" }),
      number: z.string({
        required_error: "O campo número é obrigatório"
      }),
      city: z.string(),
      state: z.string(),
      complement: z.string()
    })

  });

  const methods = useForm<IUser>({
    resolver: zodResolver(Schema),
  });

  const { control, setValue, watch, handleSubmit, setFocus, clearErrors } = methods;

  const watchAllFields = watch();

  const handleOnSubmit = async (data: IUser) => {
    console.log('dada User', data)
    if (id) {
      const response = await updateUser(id as string, data);
      if (response) {
        window.history.back();
        toast.success("Produto atualizado com sucesso");
      }
    }
    if (!id) {
      const response = await createUser(data);
      if (response) {
        window.history.back();
        toast.success("Produto criado com sucesso");
      }
    }
  }

  const handleLoadCep = useCallback(async (zipcode: string) => {
    try {
      const data = await consultCep(normalizeNumber(zipcode) as string)

      if (typeof data !== 'boolean') {
        clearErrors('address.city')
        clearErrors('address.district')
        clearErrors('address.state')
        clearErrors('address.streetName')
        clearErrors('address.zipcode')

        setValue('address.streetName', data.logradouro)
        setValue('address.district', data.bairro)
        setValue('address.state', data.uf)
        setValue('address.city', data.localidade)

        setFocus('address.number')
      } else {
        setValue('address.district', '')
        setValue('address.state', '')
        setValue('address.city', '')
        clearErrors('address.streetName')
        toast.error('CEP não encontrado')
        setFocus('address.zipcode')
      }
    } catch (error) {/* empty */
    }
  }, [clearErrors, setFocus, setValue])

  useEffect(() => {
    console.log(watchAllFields)
  }, [watchAllFields]);

  useEffect(() => {
    if (!id) return;
    handleLoadUser(id).then((response) => {
      const { address, age, birthDate, email, gender, image, name, phone } = response;
      setValue("address.city", address.city);
      setValue("address.complement", address.complement);
      setValue("address.district", address.district);
      setValue("address.number", address.number);
      setValue("address.state", address.state);
      setValue("address.streetName", address.streetName);
      setValue("address.zipcode", address.zipcode);
      setValue("age", age);
      setValue("birthDate", birthDate);
      setValue("email", email);
      setValue("phone", phone);
      setValue("gender", gender)
      setValue("image", image);
      setValue("name", name);
    });
  }, [handleLoadUser, id, setValue]);

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
        }}>{id ? "Editar Usuário" : "Criar Usuário"}</span>
      </div>

      <div className="container-fluid shadow p-2 rounded-2 ">
        {
          watchAllFields.image && (
            <div className="d-flex w-100 align-items-center  justify-content-center ">
              <img src={watchAllFields.image} alt="" className="img-thumbnail"
                style={{
                  width: '160px',
                  height: '160px'
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
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Nome"
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
                name="gender"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Genêro"
                    value={field.value || ""}
                    options={[
                      {
                        id: "male",
                        label: "Masculino",
                      },
                      {
                        id: "famale",
                        label: "Feminino",
                      },
                      {
                        id: "other",
                        label: "Outro",
                      }
                    ]}
                    isRequired />
                )}
              />
            </div>

            <div className="col col-md-6">
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Email"
                    value={field.value || ""}
                    isRequired />
                )}
              />
            </div>


            <div className="col col-md-4">
              <Controller
                control={control}
                name="birthDate"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Data de nascimento"
                    type="date"
                    onChange={(event) => {
                      const idade = new Date().getFullYear() - new Date(event.target.value).getFullYear();
                      setValue("age", idade);
                      field.onChange(event.target.value);
                    }}
                    isRequired />
                )}
              />
            </div>

            <div className="col col-md-2">
              <Controller
                control={control}
                name="age"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Idade"
                    readOnly
                    value={field.value || ""} />
                )}
              />
            </div>

            <div className="col col-md-6">
              <Controller
                control={control}
                name="phone"
                shouldUnregister={true}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    isRequired
                    label="Celular"
                    maxLength={15}
                    value={formatPhone(field.value)}
                    error={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <div className="col col-md-6">
              <Controller
                control={control}
                name="image"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    isRequired
                    errorMessage={error?.message}
                    label="Imagem"
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-4">
              <Controller
                control={control}
                name="address.zipcode"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="CEP"
                    isRequired
                    onBlur={(event) => {
                      handleLoadCep(event.target.value);
                    }}
                    value={normalizeZipcode(field.value) || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-8">
              <Controller
                control={control}
                name="address.streetName"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Rua / AV."
                    isRequired
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-4">
              <Controller
                control={control}
                name="address.district"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Bairro"
                    isRequired
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-2">
              <Controller
                control={control}
                name="address.number"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    isRequired
                    error={!!error}
                    errorMessage={error?.message}
                    label="Número"
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-4">
              <Controller
                control={control}
                name="address.city"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Cidade"
                    readOnly
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="col col-md-2">
              <Controller
                control={control}
                name="address.state"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="UF"
                    readOnly
                    value={field.value || ""}
                  />
                )}
              />
            </div>

            <div className="col col-md-6">
              <Controller
                control={control}
                name="address.complement"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    error={!!error}
                    errorMessage={error?.message}
                    label="Complemento"
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

export default CreateUser;