"use client";

import { useState } from "react";
import React, { ChangeEvent } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

import { TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
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
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
    const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorState>({});

    const filteredActivities = activities.filter(
        (activity) =>
            activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activityDay.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função do campo de time no formulario de atividade

    const handleTimeChange = (time: Dayjs, timeString: string | string[], fieldName: string) => {
        
        const schedule = Array.isArray(timeString) ? timeString[0] : timeString;
        setEditingActivity((prev) => ({ ...prev ?? {}, [fieldName]: schedule }));
        
    };



    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewActivity((prevActivity) => ({
            ...prevActivity,
            [name]: value,
        }));
        console.log(value)
        const field = activityFields.find(field => field.name === name);

        if (field?.required && value.trim() === '') {
            setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };


    // Validar se o campo está preenchido ou não. Se nao tiver solta um erro

    const validateActivity = (activity: Partial<Activity>) => {
        const activityErrors: ErrorState = {};
        let isValid = true;

        activityFields.forEach(field => {
            if (field.required && (!activity[field.name as keyof Activity] || activity[field.name as keyof Activity]?.toString().trim() === '')) {
                activityErrors[field.name] = 'This field is required';
                isValid = false;
            }
        });

        setErrors(activityErrors);
        return isValid;
    };



    // Editar uma atividade existente

    const handleEditActivity = () => {
        if (validateActivity(editingActivity as Activity)) {
            setActivities(activities.map(activity =>
                activity.id === editingActivity?.id ? (editingActivity as Activity) : activity
            ));
            resetEditingActivity();
        }
    };


    // Apagar os campos quando tiver editando uma nova atividade na validação

    const resetEditingActivity = () => {
        setEditingActivity(null);
        setIsEditDialogOpen(false);
        setErrors({});
    };

    const renderActivityForm = (activity: Activity) => {
        return (
            <div>
                {activityFields.map((field) => (
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
                                    {field.options.map(option => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : field.type === "time" ? (
                            <TimePicker
                                defaultValue={dayjs(activity[field.name] || '00:00', 'HH:mm')}
                                format='HH:mm'
                                onChange={(time, timeString) => handleTimeChange(time, timeString, field.name)}
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
                ))}
            </div>
        );
    };

}
