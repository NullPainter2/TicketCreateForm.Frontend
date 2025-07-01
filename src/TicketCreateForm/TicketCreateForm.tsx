import { useCallback, useEffect, useState, type FormEventHandler } from 'react'
import { useQuery } from 'react-query'
import { Autocomplete, Box, Button, CircularProgress, MenuItem, TextField } from '@mui/material'

import type { Employee, OrganizationNode } from './types'
import { ErrorMessage } from './ErrorMessage';
import { api } from '../config';

export function TicketCreateForm() {
  return (
    <>
      <h2>Založit nový ticket</h2>
      <Form />
    </>
  );
}

function Form() {

  const orgUnits = useQuery<OrganizationNode[]>(
    "orgUnits",
    () => fetch(api("orgUnits")).then(res => res.json()),
    {
      refetchOnWindowFocus: false // don't refetch on alert()
    }
  );
  const employees = useQuery<Employee[]>(
    "employees",
    () => fetch(api("employees")).then(res => res.json()),
    {
      refetchOnWindowFocus: false // don't refetch on alert()
    }
  );

  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState<number>(0);
  const [employeesIds, setEmployeesIds] = useState<number[]>([]);
  const [organizationNodeIds, setOrganizationNodeIds] = useState<number[]>([]);
  const [ticketNameHasError, setTicketNameHasError] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // validation

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setTicketNameHasError(name.length > 300);
  }, [name.length]);

  useEffect(() => {
    setIsValid(!ticketNameHasError);
  }, [ticketNameHasError]);

  useEffect(() => {
    if (orgUnits.isFetched && orgUnits.isFetched) {
    }
  }, [orgUnits.data, orgUnits.data])

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (event) => {

    event.preventDefault();

    if (!isValid) return;

    setIsSaving(true);

    try {
      const request = await fetch(api("tickets"), {
        method: "POST",
        headers: {
          //"Content-Type": "application/json; charset=utf-8",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: ownerId,
          name: name,
          employeesIds: employeesIds,
          organizationNodeIds: organizationNodeIds,
        })
      });

      if (request.status === 400) {
        const errorText: string = await request.json();
        alert("Chyba!\n------\n" + errorText);
      } else if (request.status === 201) { // created
        alert("Uloženo!");
      } else {
        alert("Neznámá chyba při ukládání.");
      }
    } catch (e) {
      alert("Neznámá chyba při ukládání.");
    }

    setIsSaving(false);
  }, [ownerId, name, employeesIds, organizationNodeIds]);

  if (employees.isError) {
    return <ErrorMessage text="Chyba při stažení zaměstnanců." onClick={() => { employees.refetch(); }} />
  }

  if (orgUnits.isError) {
    return <ErrorMessage text="Chyba při stažení organizací." onClick={() => { orgUnits.refetch(); }} />
  }

  if (employees.isLoading || orgUnits.isLoading) {
    return <CircularProgress />;
  }

  return (
    <form
      onSubmit={onSubmit}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <TextField
          label="Název ticketu"
          variant="outlined"
          required
          error={ticketNameHasError}
          onChange={event => {
            setName(event.target.value)
          }}
          inputProps={{
            maxLength: 300
          }}
        />

        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Vlastník ticketu"
            />
          )}
          options={employees.data || []}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => {
            setOwnerId(value?.personalNumber || 0)
          }}
        />

        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Komentující osoby"
            />
          )}
          multiple
          disableCloseOnSelect
          options={[...(employees.data || [])].sort((a, b) => {
            const aName: string = a.organizationNode?.name || "";
            const bName: string = b.organizationNode?.name || "";
            const groupResult: number = aName.localeCompare(bName);
            if (groupResult == 0) {
              return a.name.localeCompare(b.name);
            } else {
              return groupResult
            }
          })}
          groupBy={(option) => option.organizationNode?.name || ''}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => {
            setEmployeesIds(value.map(x => x.personalNumber))
          }}
        />

        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Komentující útvary"
            />
          )}
          multiple
          disableCloseOnSelect
          options={orgUnits.data || []}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => {
            setOrganizationNodeIds(value.map(x => x.id))
          }}
        />

        <Button
          type="submit"
          disabled={isSaving} // avoid double submit
        >
          Odeslat
        </Button>
      </Box>
    </form>
  )
}