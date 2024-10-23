"use client";
import { useState } from "react";
import { ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Activity } from "./activity_form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import {
    DialogFooter,
} from "@/components/ui/dialog";

type ActivityField = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
};

const activityFields: ActivityField[] = [
    { name: "activityName", label: "Activity Name", type: "text", required: true },
    { name: "activityShift", label: "Shift", type: "select", required: true, options: ["Morning", "Afternoon", "Evening"] },
    { name: "activityDay", label: "Day", type: "select", required: true, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    { name: "activityInitial", label: "Horário Inicial", type: "time", required: true },
    { name: "activityFinal", label: "Horário Final", type: "time", required: true },
];

type ErrorState = {
    [key: string]: string | null;
};

type NewActivityFormProps = {
    onAddActivity: (activity: Activity) => void;
    onSave: () => void;
};

export default function NewActivityForm({ onAddActivity }: NewActivityFormProps) {
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
    const [errors, setErrors] = useState<ErrorState>({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { toast } = useToast();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewActivity(prev => ({
            ...prev,
            [name]: value,
        }));

        const field = activityFields.find(field => field.name === name);
        if (field?.required && value.trim() === '') {
            setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleTimeChange = (time: Dayjs, timeString: string | string[], fieldName: string) => {
        const schedule = Array.isArray(timeString) ? timeString[0] : timeString;
        setNewActivity(prev => ({ ...prev, [fieldName]: schedule }));
    };

    const handleSave = () => {
        if (Object.values(errors).some(error => error !== null)) return; // Verifica se há erros
        console.log("Dados a serem enviados:", newActivity); // Mostra no console antes de enviar

        const postAcitvity = async () => {
            try {
                const Api = await fetch(
                    apiUrl + "/activityList/create",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.token}`, // Insira o token aqui
                        },
                        body: JSON.stringify({
                            "name": newActivity.activityName,
                            "hour_start": newActivity.activityInitial,
                            "hour_end": newActivity.activityFinal,
                            "id_period": 1
                        })
                    });


                let apiResponse = await Api.json();

                if (apiResponse.status_code === 202) {
                    // Armazenar o token no localStorage
                    // localStorage.setItem('token', apiResponse.token);
                    onAddActivity(newActivity as Activity); // Chama a função de callback
                    setNewActivity({}); // Limpa o formulário
                    // Exibir toast de sucesso
                    // toast({
                    //     title: "Atividade Criada",
                    //     description: "Nova Atividade adicionada com sucesso!",
                    // });
                }
            } catch (error) {
                console.error('Erro ao chamar a API', error);
            }



        };
        postAcitvity();

    };

    const renderActivityFormCreate = () => {
        return (
            <div>
                {activityFields.map(field => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm font-medium">{field.label}</label>
                        {field.type === "select" ? (
                            <Select
                                value={newActivity[field.name] || ""}
                                onValueChange={(value) => handleInputChange({ target: { name: field.name, value } } as ChangeEvent<HTMLInputElement>)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map(option => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : field.type === "time" ? (
                            <TimePicker
                                defaultValue={dayjs(newActivity[field.name] || '00:00', 'HH:mm')}
                                format="HH:mm"
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
                <DialogFooter>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </div>
        );
    };

    return <>{renderActivityFormCreate()}</>;
}
