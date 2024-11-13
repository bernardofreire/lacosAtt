"use client";

import { useEffect, useState, ChangeEvent } from "react";
import React from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { AtividadeService } from "@/services/AtividadeService";

interface Activity {
  id_activity: number;
  name: string;
  hour_start: string;
  hour_end: string;
  id_period: number;
}

type ActivityField = {
  name: keyof Activity;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

const activityFields: ActivityField[] = [
  { name: "name", label: "Nome Atividade", type: "text", required: true },
  { name: "hour_start", label: "Hora Inicio", type: "text", required: true },
  { name: "hour_end", label: "Hora Final", type: "text", required: true },
];

export default function ActivitiesDashboard() {
  const { atividades, setAtividades, isLoading } = useDataContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const filteredActivities = (atividades || [])
    .filter((activity) => activity && activity.name && activity.name.toLowerCase().includes(searchTerm.toLowerCase()));


  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setNewActivity((prevActivity) => ({
      ...prevActivity,
      [name]: value,
    }));

    const field = activityFields.find(field => field.name === name);
    if (field?.required && value.trim() === '') {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: `${field.label} é obrigatório` }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleAddActivity = async () => {
    const requiredFields = activityFields.filter((field) => field.required);
    const hasErrors = requiredFields.some((field) => !newActivity[field.name]?.toString().trim());
  
    if (hasErrors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...Object.fromEntries(requiredFields.map((field) => [field.name, `${field.label} é obrigatório`])),

      }));
      return;
    }
  
    try {
      const { name, hour_start, hour_end, id_period = 1 } = newActivity;
  
      // Chamada para criar a atividade na API
      await AtividadeService.createActivity(
        name as string,
        hour_start as string,
        hour_end as string,
        id_period
      );
  
      // Após a criação, realiza a busca novamente para garantir que a lista de atividades está atualizada
      const atividadesResponse = await AtividadeService.getActivityList();
      setAtividades(atividadesResponse.data);

      // Limpa o formulário e fecha o diálogo
      setNewActivity({});
      setIsAddDialogOpen(false);
  
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
    }
};

  

  const renderActivityForm = () => (
    <div>
      {activityFields
        .filter(field => field.type === "text")
        .map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium">{field.label}</label>
            <Input
              type={field.type}
              name={field.name}
              value={newActivity[field.name as keyof typeof newActivity] || ""}
              onChange={handleInputChange}
              placeholder={field.label}
              className={`mt-1 ${errors[field.name as keyof typeof errors] ? "border-red-500" : ""}`}
            />
            {errors[field.name as keyof typeof errors] && <p className="text-red-500 text-sm">{errors[field.name as keyof typeof errors]}</p>}
          </div>
        ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
              Activities Dashboard
            </CardTitle>
            <Activity className="ml-auto w-4 h-4" />
          </div>
          <CardDescription>
            Adicione e gerencie atividades. Defina horários, turnos e dias da semana para manter tudo organizado e facilitar o planejamento.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex justify-between items-center mt-10 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Procurar Atvidade..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Activity</DialogTitle>
              <DialogDescription>
                Enter the details of the new activity here.
              </DialogDescription>
            </DialogHeader>
            {renderActivityForm()}
            <DialogFooter>
              {/* <Button variant="secondary" onClick={resetNewActivity}>Cancel</Button> */}
              <Button onClick={handleAddActivity}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading activities...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Atividade</TableHead>
              <TableHead>Horário Inicio</TableHead>
              <TableHead>Horário Final</TableHead>
              <TableHead>ID Periodo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map(atividade => (
              <TableRow key={atividade.id_activity}>
                <TableCell>{atividade.name}</TableCell>
                <TableCell>{atividade.hour_start}</TableCell>
                <TableCell>{atividade.hour_end}</TableCell>
                <TableCell>{atividade.id_period}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem onClick={() => {
                                                setEditingActivity(activity);
                                                setIsEditDialogOpen(true);
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(activity.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem> */}
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
