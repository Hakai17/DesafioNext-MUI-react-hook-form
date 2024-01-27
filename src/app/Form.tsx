"use client";

import React from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { Autocomplete, TextField, Button, Container, Box } from "@mui/material";

interface Pessoa {
  id: number;
  nome: string;
}

const pessoas: Pessoa[] = [
  { id: 1, nome: "Carlos Silva Lima" },
  { id: 2, nome: "Carlito Ramos Junior" },
  { id: 3, nome: "Paulo Felipe Castro" },
];

const fetchData = async (searchTerm: string) => {
  return pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const PessoaAutocomplete: React.FC = () => {
  const methods = useFormContext();

  return (
    <Controller
      name="pessoa"
      control={methods.control}
      defaultValue={null}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={pessoas}
          isOptionEqualToValue={(option, value) => option.nome === value.nome}
          getOptionLabel={(option: Pessoa) => option.nome}
          onChange={(_, selectedOption) => field.onChange(selectedOption)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pessoa"
              sx={{ width: "100%" }}
              value={field.value?.nome || ""}
              onBlur={async () => {
                const newData = await fetchData(field.value?.nome || "");
                field.onChange(newData[0]);
              }}
            />
          )}
        />
      )}
    />
  );
};

const Form: React.FC = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PessoaAutocomplete />

          <Controller
            name="telefone"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Telefone" sx={{ width: "100%" }} />
            )}
          />

          <Controller
            name="email"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="E-mail" sx={{ width: "100%" }} />
            )}
          />

          <Box mt={2} width="100%" display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "50%", color: "black" }}
            >
              Enviar
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Form;
