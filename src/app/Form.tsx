"use client";

import React, { useState } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
  Container,
  Box,
} from "@mui/material";
import "./FormStyles.css";

interface Pessoa {
  id: number;
  nome: string;
}

const pessoas: Pessoa[] = [
  { id: 1, nome: "Carlos Silva Lima" },
  { id: 2, nome: "Carlito Ramos Junior" },
  { id: 3, nome: "Paulo Felipe Castro" },
];

const fetchData = async (searchTerm: string): Promise<readonly Pessoa[]> => {
  try {
    const response = await fetch(`/api/pessoas?searchTerm=${searchTerm}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return [];
  }
};

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const PessoaAutocomplete: React.FC = () => {
  const methods = useFormContext();
  const [options, setOptions] = useState<readonly Pessoa[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = debounce(async (searchTerm: string) => {
    setLoading(true);
    try {
      const newData = await fetchData(searchTerm);
      setOptions(newData);
    } finally {
      setLoading(false);
    }
  }, 2000);

  const handleSearch = (searchTerm: string) => {
    setLoading(true);
    debouncedSearch(searchTerm);
  };

  return (
    <Controller
      name="pessoa"
      control={methods.control}
      defaultValue={null}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          isOptionEqualToValue={(option, value) => option.nome === value.nome}
          getOptionLabel={(option: Pessoa) => option.nome}
          onChange={(_, selectedOption) => field.onChange(selectedOption)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pessoa"
              className="autocompleteTextField"
              sx={{ width: "100%" }}
              value={field.value?.nome || ""}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
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
    <Container className="container">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PessoaAutocomplete />

          <Controller
            name="telefone"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Telefone" className="formTextField" sx={{ width: "100%" }} />
            )}
          />

          <Controller
            name="email"
            control={methods.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="E-mail" className="formTextField" sx={{ width: "100%" }} />
            )}
          />

          <Box mt={2} width="100%" display="flex" justifyContent="center">
            <Button
              type="submit"
              className="submitButton"
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
