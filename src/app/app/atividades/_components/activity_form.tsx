"use client";
import NewActivityForm from './activity_create';
import { useState } from "react";
import React, { ChangeEvent } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface Activity {
    id: number;
    activityName: string;
    activityShift: string;
    activityDay: string;
    activitySchedule?: string;
    [key: string]: any;
}


type ActivityField = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
};


const initialActivities: Activity[] = [
    { id: 1, activityName: "Yoga", activityShift: "Morning", activityDay: "Monday", activityInitial: "08:00 AM" },
    { id: 2, activityName: "Cooking Class", activityShift: "Afternoon", activityDay: "Wednesday", activityInitial: "02:00 PM" },
];

const activityFields: ActivityField[] = [
    { name: "activityName", label: "Activity Name", type: "text", required: true },
    { name: "activityShift", label: "Shift", type: "select", required: true, options: ["Morning", "Afternoon", "Evening"] },
    { name: "activityDay", label: "Day", type: "select", required: true, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    { name: "activityInitial", label: "Horário Inicial", type: "time", required: true },
    { name: "activityFinal", label: "Horário Final", type: "time", required: true },
];

type ErrorState = {
    [key: string]: string | null
};

export default function ActivitiesDashboard() {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const filteredActivities = activities.filter(
        (activity) =>
            activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activityDay.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Deletar uma atividade

    const handleDelete = (id: number) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };
    


    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center  justify-center">
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
            {/* <h1 className="text-2xl font-bold mb-4">Activities Dashboard</h1>
            <span className="text-[12px] sm:text-sm text-gray-400">Adicione e gerencie atividades. Defina horários, turnos e dias da semana para manter tudo organizado e facilitar o planejamento.</span> */}
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
                            <Plus className="mr-2 h-4 w-4" /> Nova Atividade
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Nova Atividade</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new activity here.
                            </DialogDescription>
                        </DialogHeader>
                        <NewActivityForm
                            onAddActivity={(newActivity) => {
                                setActivities(prevActivities => [...prevActivities, { ...newActivity, id: activities.length + 1 }]);
                                setIsAddDialogOpen(false);  // Fecha o modal após adicionar
                            }}
                            onSave={() => setIsAddDialogOpen(false)} // Fecha o modal após salvar
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity Name</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Horário Inicial</TableHead>
                        <TableHead>Horário Final</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>{activity.activityName}</TableCell>
                            <TableCell>{activity.activityShift}</TableCell>
                            <TableCell>{activity.activityDay}</TableCell>
                            <TableCell>{activity.activityInitial}</TableCell>
                            <TableCell>{activity.activityFinal}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(activity.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Activity</DialogTitle>
                        <DialogDescription>
                            Update the details of the activity here.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button>Cancel</Button>
                        <Button>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
