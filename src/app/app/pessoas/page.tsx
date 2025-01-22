"use client";

import CircularProgress from '@mui/material/CircularProgress';
import { useState, ChangeEvent } from "react";
import React from "react";
import { Plus, MoreHorizontal, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeopleContext } from "@/contexts/PeopleContext";
import { PeopleService } from "@/services/PeopleService";

import { useRouter } from "next/navigation";
// import { AtividadeService } from '@/services/AtividadeService';





interface Person {
  name: string;
  last_name: string;
  email: string;
  birth_date: string;
  rg: string;
  cpf: string;
  blood_type: string;
  city: string;
  address: string;
  address_number: string;
  cep: string;
  home_phone: string;
  cell_phone: string;
  contact_phone: string;
  cad_unico: string;
  nis: string;
  school: string;
  res_name: string;
  res_relationship: string;
  res_rg: string;
  res_cpf: string;
  res_cell_phone: string;
  [key: string]: string; // Adicione isso para permitir campos dinâmicos
}





const steps = [
  [
    { name: "name", label: "Primeiro Nome", type: "text", required: true },
    { name: "last_name", label: "Último Nome", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "birth_date", label: "Data de Nascimento", type: "date", required: true },
  ],
  [
    { name: "rg", label: "RG", type: "text", required: true },
    { name: "cpf", label: "CPF", type: "text", required: true },
    { name: "blood_type", label: "Tipo Sanguíneo", type: "text", required: true },
  ],
  [
    { name: "city", label: "Cidade", type: "text", required: true },
    { name: "address", label: "Endereço", type: "text", required: true },
    { name: "address_number", label: "Número", type: "text", required: true },
    { name: "cep", label: "CEP", type: "text", required: true },
  ],
  [
    { name: "home_phone", label: "Telefone", type: "text", required: true },
    { name: "cell_phone", label: "Celular", type: "text", required: true },
    { name: "contact_phone", label: "Telefone de contato", type: "text", required: true },
  ],
  [
    { name: "cad_unico", label: "Cadastro único", type: "text", required: true },
    { name: "nis", label: "NIS", type: "text", required: true },
    { name: "school", label: "Escola", type: "text", required: true },
  ],
  [
    { name: "res_name", label: "Nome do Responsável", type: "text", required: true },
    { name: "res_relationship", label: "Estado civil", type: "text", required: true },
    { name: "res_rg", label: "RG do Responsável", type: "text", required: true },
    { name: "res_cpf", label: "CPF do Responsável", type: "text", required: true },
    { name: "res_cell_phone", label: "Celular do Responsável", type: "text", required: true },
  ],
  // [
  //   { name: "activity", label: "Atividade", type: "select", required: true },
  // ],
];

const defaultPerson: Person = {
  name: "",
  last_name: "",
  email: "",
  birth_date: "",
  rg: "",
  cpf: "",
  blood_type: "",
  city: "",
  address: "",
  address_number: "",
  cep: "",
  home_phone: "",
  cell_phone: "",
  contact_phone: "",
  cad_unico: "",
  nis: "",
  school: "",
  res_name: "",
  res_relationship: "",
  res_rg: "",
  res_cpf: "",
  res_cell_phone: "",
};






export default function PeopleDashboard() {
  const { people, setPeople, isLoading } = usePeopleContext();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newPerson, setNewPerson] = useState<Partial<Person>>(defaultPerson);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [currentStep, setCurrentStep] = useState(0);
  // const [activities, setActivities] = useState([]);

  const router = useRouter();


  // useEffect(() => {
  //   const fetchActivities = async () => {
  //     try {
  //       const data = await AtividadeService.getActivityList();
  //       setActivities(data);
  //     } catch (error) {
  //       console.error("Erro ao buscar atividades:", error);
  //     }
  //   };

  //   fetchActivities();
  // }, []);


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPerson((prev) => ({ ...prev, [name]: value }));
    const field = steps[currentStep].find((f) => f.name === name);
    if (field?.required && !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${field.label} é obrigatório` }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const fields = steps[currentStep];
    const stepErrors = fields.reduce((acc, field) => {
      if (field.required && !newPerson[field.name]?.trim()) {
        acc[field.name] = `${field.label} é obrigatório`;
      }
      return acc;
    }, {} as Record<string, string>);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      console.log(newPerson, "oiiii")
      await PeopleService.createPerson(newPerson);
      // const personId = personResponse.data.id_person;

      // if (newPerson.activity) {
      //   await PeopleService.linkActivityPerson({
      //     id_person: personId,
      //     id_activity: newPerson.activity,
      //   });
      // }

      console.log(people, "uebaa")

      // Atualiza a lista de pessoas no contexto
      const updatedPeople = await PeopleService.getAllPersons(10, 0);
      setPeople(updatedPeople.data);

      // Reseta os estados
      setNewPerson(defaultPerson);
      setCurrentStep(0);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar pessoa:", error);
    }
  };





  const handleDelete = async (id_person: number) => {
    try {
      await PeopleService.deletePerson(id_person);

      const updatedPeople = await PeopleService.getAllPersons(10, 0);
      setPeople(updatedPeople.data);
    } catch (error) {
      console.error("Erro ao deletar pessoa:", error);
    }
  };



  const handleDetail = (person: Partial<Person>) => {
    router.push(`/app/pessoas/detalhe/${person.id_person}?name=${encodeURIComponent(person.name ?? '')}`);
  };


  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
              Gerenciar Pessoas
            </CardTitle>
            <User className="ml-auto w-4 h-4" />
          </div>
          <CardDescription>
            Adicione e gerencie pessoas. Complete os dados pessoais, endereço e contato.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex justify-between items-center mt-10 mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Pessoa</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo e avance para finalizar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {steps[currentStep].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  {field.type === "select" ? (
                    // <Select
                    //   value={newPerson[field.name] || ""}
                    //   onValueChange={(value) =>
                    //     setNewPerson((prev) => ({ ...prev, [field.name]: value }))
                    //   }
                    // >
                    //   <SelectTrigger className="mt-1 block w-full border border-gray-300 rounded-md">
                    //     <SelectValue placeholder="Selecione uma atividade" />
                    //   </SelectTrigger>
                    //   <SelectContent>
                    //     {activities.map((activity) => (
                    //       <SelectItem key={activity.id_activity} value={activity.id_activity.toString()}>
                    //         {activity.name}
                    //       </SelectItem>
                    //     ))}
                    //   </SelectContent>
                    // </Select>
                    <h1>oi</h1>
                  ) : (
                    <Input
                      type={field.type}
                      name={field.name}
                      value={newPerson[field.name] || ""}
                      onChange={handleInputChange}
                      className={`mt-1 ${errors[field.name] ? "border-red-500" : ""}`}
                    />
                  )}
                  {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
                Voltar
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Avançar</Button>
              ) : (
                <Button onClick={handleSubmit}>Salvar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <CircularProgress size={40} sx={{ color: '#6a0dad' }} thickness={5} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people?.map((person) => (
              <TableRow key={person.id_person} onClick={() => handleDetail(person as unknown as Partial<Person>)} className="cursor-pointer">
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.cpf}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.active === "Y" ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(person.id_person)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
