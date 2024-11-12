"use client";

import { useEffect, useState } from "react";
import React, { ChangeEvent } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle,DialogDescription,DialogTrigger} from "@/components/ui/dialog";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtividadeService } from "@/services/AtividadeService";

interface Activity {
    id_activity: number;
    name: string;
    hour_start: string;
    hour_end: string;
    id_period: number;
}

type ActivityField = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
};


// Campos do dialog para criar/editar atividade
const activityFields: ActivityField[] = [
    { name: "activityName", label: "Nome Atividade", type: "text", required: true },
    { name: "activityStart", label: "Hora Inicio", type: "tex", required: true },
    { name: "activityEnd", label: "Hora Final", type: "select", required: true },
];

// type ErrorState = {
//     [key: string]: string | null
// };

export default function ActivitiesDashboard() {
    const [atividades, setAtividades] = useState<Activity[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({});


    // Carregar todas as atividades.
    // Está fazendo uma busca na api na pasta /service/AtividadeService.tsx
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AtividadeService.getActivityList();
                console.log("Atividades (raw):", response);

                if (Array.isArray(response.data)) {
                    setAtividades(response.data);
                } else {
                    setError("Os dados retornados não são uma lista de atividades");
                }
            } catch (err) {
                setError("Erro ao carregar as atividades");
                console.error("Erro ao buscar atividades:", err);
            }
        };

        fetchData();
    }, []);
    
    // Para filtrar no input de pesquisa
    const filteredActivities = atividades.filter(
        (activity) =>
            activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);
    // const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);


    // const handleTimeChange = (time: Dayjs, timeString: string | string[]) => {
    //     const schedule = Array.isArray(timeString) ? timeString[0] : timeString;
    //     setEditingActivity((prev) => ({ ...prev ?? {}, activitySchedule: schedule }));
    // };

    // const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = event.target;
    //     setNewActivity((prevActivity) => ({
    //         ...prevActivity,
    //         [name]: value,
    //     }));

    //     const field = activityFields.find(field => field.name === name);

    //     if (field?.required && value.trim() === '') {
    //         setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
    //     } else {
    //         setErrors(prev => ({ ...prev, [name]: null }));
    //     }
    // };

    // const validateActivity = (activity: Partial<Activity>) => {
    //     const activityErrors: ErrorState = {};
    //     let isValid = true;

    //     activityFields.forEach(field => {
    //         if (field.required && (!activity[field.name as keyof Activity] || activity[field.name as keyof Activity]?.toString().trim() === '')) {
    //             activityErrors[field.name] = 'This field is required';
    //             isValid = false;
    //         }
    //     });

    //     setErrors(activityErrors);
    //     return isValid;
    // };

    // const handleAddActivity = () => {
    //     if (validateActivity(newActivity)) {
    //         const id = Math.max(...activities.map((a) => a.id)) + 1;
    //         setActivities([...activities, { id, ...newActivity } as Activity]);
    //         resetNewActivity();
    //     }
    // };

    // const handleEditActivity = () => {
    //     if (validateActivity(editingActivity as Activity)) {
    //         setActivities(activities.map(activity =>
    //             activity.id === editingActivity?.id ? (editingActivity as Activity) : activity
    //         ));
    //         resetEditingActivity();
    //     }
    // };

    // const handleDelete = (id: number) => {
    //     setActivities(activities.filter(activity => activity.id !== id));
    // };

    // const resetNewActivity = () => {
    //     setNewActivity({});
    //     setIsAddDialogOpen(false);
    //     setErrors({});
    // };

    // const resetEditingActivity = () => {
    //     setEditingActivity(null);
    //     setIsEditDialogOpen(false);
    //     setErrors({});
    // };

    const renderActivityForm = (activity: Activity) => (
        <div>
            {/* {activityFields.map((field) => (
                <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium">{field.label}</label>
                    {field.type === "select" ? (
                        <Select
                            value={activity[field.name]}
                            onValueChange={(value: string) => handleInputChange({ target: { name: field.name, value } } as ChangeEvent<HTMLInputElement>)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options!.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : field.type === "time" ? (
                        <TimePicker
                            defaultValue={dayjs(activity[field.name], 'HH:mm')}
                            format='HH:mm'
                            onChange={handleTimeChange}
                            className={`mt-1 ${errors[field.name] ? "border-red-500" : ""}`}
                        />
                    ) : (
                        <Input
                            type={field.type}
                            name={field.name}
                            value={newActivity[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.label}
                            className={`mt-1 ${errors[field.name] ? "border-red-500" : ""}`}
                        />
                    )}
                    {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
            ))} */}
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
                        {/* {renderActivityForm(newActivity)}
                        <DialogFooter>
                            <Button variant="secondary" onClick={resetNewActivity}>Cancel</Button>
                            <Button onClick={handleAddActivity}>Save</Button>
                        </DialogFooter> */}
                    </DialogContent>
                </Dialog>
            </div>

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
            {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Activity</DialogTitle>
                        <DialogDescription>
                            Update the details of this activity.
                        </DialogDescription>
                    </DialogHeader>
                    {renderActivityForm(editingActivity ?? {})}
                    <DialogFooter>
                        <Button variant="secondary" onClick={resetEditingActivity}>Cancel</Button>
                        <Button onClick={handleEditActivity}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}
