"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PeopleService } from "@/services/PeopleService";

interface ResponsiblePerson {
  id_person: number;
  id_responsible: number;
  name: string;
  relationship: string;
  rg: string;
  cpf: string;
  cell_phone: string;
}

interface Person {
  id_person: number;
  name: string;
  birth_date: string;
  rg: string;
  cpf: string;
  cad_unico: string;
  nis: string;
  school: string;
  address: string;
  address_number: string;
  blood_type: string;
  neighborhood: string;
  city: string;
  cep: string;
  home_phone: string;
  cell_phone: string;
  contact_phone: string;
  email: string;
  current_age: number;
  active: string;
  responsible_person: ResponsiblePerson;
}

interface PeopleContextType {
  people: Person[] | null;
  peopleLength: number;
  isLoading: boolean;
  setPeople: React.Dispatch<React.SetStateAction<Person[] | null>>;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await PeopleService.getAllPersons(10, 0); // Ajuste os limites conforme necessário
        setPeople(response.data);
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const peopleLength = people ? people.length : 0;

  useEffect(() => {
    console.log("Pessoas foram atualizadas:", people);
  }, [people]);

  return (
    <PeopleContext.Provider value={{ people, peopleLength, isLoading, setPeople }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeopleContext = () => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeopleContext deve ser usado dentro de um PeopleProvider");
  }
  return context;
};
