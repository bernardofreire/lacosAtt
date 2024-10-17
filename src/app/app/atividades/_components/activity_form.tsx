"use client";

import { useState } from "react";
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
import dayjs from 'dayjs';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const initialActivities = [
    { id: 1, activityName: "Yoga", activityShift: "Morning", activityDay: "Monday", activitySchedule: "08:00 AM" },
    { id: 2, activityName: "Cooking Class", activityShift: "Afternoon", activityDay: "Wednesday", activitySchedule: "02:00 PM" },
];

const activityFields = [
    { name: "activityName", label: "Activity Name", type: "text", required: true },
    { name: "activityShift", label: "Shift", type: "select", required: true, options: ["Morning", "Afternoon", "Evening"] },
    { name: "activityDay", label: "Day", type: "select", required: true, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    { name: "activitySchedule", label: "Schedule", type: "time", required: true },
];

export default function ActivitiesDashboard() {
    const [activities, setActivities] = useState(initialActivities);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newActivity, setNewActivity] = useState({});
    const [editingActivity, setEditingActivity] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const filteredActivities = activities.filter(
        (activity) =>
            activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activityDay.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTimeChange = (time, timeString) => {
        setEditingActivity((prev) => ({ ...prev, activitySchedule: timeString }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingActivity((prev) => ({ ...prev, [name]: value }));

        if (activityFields.find(field => field.name === name).required && value.trim() === '') {
            setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateActivity = (activity) => {
        const activityErrors = {};
        let isValid = true;

        activityFields.forEach(field => {
            if (field.required && (!activity[field.name] || activity[field.name].trim() === '')) {
                activityErrors[field.name] = 'This field is required';
                isValid = false;
            }
        });

        setErrors(activityErrors);
        return isValid;
    };

    const handleAddActivity = () => {
        if (validateActivity(newActivity)) {
            const id = Math.max(...activities.map((a) => a.id)) + 1;
            setActivities([...activities, { id, ...newActivity }]);
            resetNewActivity();
        }
    };

    const handleEditActivity = () => {
        if (validateActivity(editingActivity)) {
            setActivities(activities.map(activity =>
                activity.id === editingActivity.id ? editingActivity : activity
            ));
            resetEditingActivity();
        }
    };

    const handleDelete = (id) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };

    const resetNewActivity = () => {
        setNewActivity({});
        setIsAddDialogOpen(false);
        setErrors({});
    };

    const resetEditingActivity = () => {
        setEditingActivity(null);
        setIsEditDialogOpen(false);
        setErrors({});
    };

    const renderActivityForm = (activity) => {
        return (
            <div>
                {activityFields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm font-medium">{field.label}</label>
                        {field.type === "select" ? (
                            <Select value={activity[field.name]} onValueChange={(value) => handleInputChange({ target: { name: field.name, value } })}>
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
                        ) : field.type === "time" ? ( // Renderizando o TimePicker
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
                                value={activity[field.name] || ""}
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
                        {renderActivityForm(newActivity)}
                        <DialogFooter>
                            <Button variant="secondary" onClick={resetNewActivity}>Cancel</Button>
                            <Button onClick={handleAddActivity}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity Name</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>{activity.activityName}</TableCell>
                            <TableCell>{activity.activityShift}</TableCell>
                            <TableCell>{activity.activityDay}</TableCell>
                            <TableCell>{activity.activitySchedule}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => {
                                            setEditingActivity(activity);
                                            setIsEditDialogOpen(true);
                                        }}>
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

            <Dialog open={isEditDialogOpen} onOpenChange={resetEditingActivity}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Activity</DialogTitle>
                        <DialogDescription>
                            Update the details of the activity here.
                        </DialogDescription>
                    </DialogHeader>
                    {editingActivity && renderActivityForm(editingActivity)}
                    <DialogFooter>
                        <Button variant="secondary" onClick={resetEditingActivity}>Cancel</Button>
                        <Button onClick={handleEditActivity}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
