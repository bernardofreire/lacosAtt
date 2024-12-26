'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Info, Save, X, Edit2 } from 'lucide-react'
import { PeopleService } from "@/services/PeopleService"
import { usePeopleContext } from '@/contexts/PeopleContext'

interface ResponsiblePerson {
  id_person: number
  id_responsible: number
  name: string
  relationship: string
  rg: string
  cpf: string
  cell_phone: string
}

interface Person {
  data: {
    id_person: number
    name: string
    birth_date: string
    rg: string
    cpf: string
    cad_unico: string
    nis: string
    school: string
    address: string
    address_number: string
    blood_type: string
    neighborhood: string
    city: string
    cep: string
    home_phone: string
    cell_phone: string
    contact_phone: string
    email: string
    current_age: number
    active: string
    responsible_person: ResponsiblePerson
  }
}

export default function PersonDetailsScreen({ params }: { params: { id: string } }) {
  const personId = parseInt(params.id)

  const { people, setPeople } = usePeopleContext();
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [person, setPerson] = useState<Person | null>(null)
  const [originalPerson, setOriginalPerson] = useState<Person | null>(null)

  useEffect(() => {
    if (personId) {
      const fetchPerson = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const data = await PeopleService.getPersonById(personId)

          // Convertendo data de nascimento para o formato esperado (yyyy-mm-dd)
          if (data.birth_date) {
            data.birth_date = data.birth_date.split("T")[0]
          }

          setPerson(data)
          setOriginalPerson(data)
        } catch (error) {
          setError("Erro ao carregar os dados da pessoa. Tente novamente.")
          console.error("Error fetching person details:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchPerson()
    }
  }, [personId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (person) {
      // Atualizando os dados no objeto person.data
      setPerson(prev => prev ? { ...prev, data: { ...prev.data, [name]: value } } : null)
    }
  }

  const handleSave = async () => {
    if (!person) return;
    try {
      // Atualiza os dados da pessoa
      await PeopleService.updatePerson(person.data);
      console.log('Person updated:', person.data);

      // Atualiza a pessoa no contexto
      setOriginalPerson(person);

      // Atualiza a lista de pessoas na tabela
      setPeople((prevPeople) => {
        if (!prevPeople) return prevPeople;

        // Encontra a pessoa editada e a substitui
        return prevPeople.map((p) =>
          p.id_person === person.data.id_person ? { ...p, ...person.data } : p
        );
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving person details:', error);
      setError("Erro ao salvar as alterações. Tente novamente.");
    }
  };


  const handleCancel = () => {
    setPerson(originalPerson)
    setIsEditing(false)
  }

  if (isLoading) {
    return <p className="text-center mt-6">Carregando os detalhes da pessoa...</p>
  }

  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!person) {
    return <p className="text-center mt-6">Nenhuma pessoa encontrada.</p>
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Informações de <span className="text-purple-700">{person.data.name}</span>
        </h1>

        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" /> Editar
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleSave} variant="default">
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={person.data.name || ''}
              onChange={handleInputChange}
              placeholder="Nome completo"
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={person.data.birth_date || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Rua</Label>
              <Input
                id="address"
                name="address"
                value={person.data.address || ''}
                onChange={handleInputChange}
                placeholder="Rua"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_number">Número</Label>
              <Input
                id="address_number"
                name="address_number"
                value={person.data.address_number || ''}
                onChange={handleInputChange}
                placeholder="Número"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cell_phone">Celular</Label>
              <Input
                id="cell_phone"
                name="cell_phone"
                value={person.data.cell_phone || ''}
                onChange={handleInputChange}
                placeholder="Celular"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={person.data.email || ''}
                onChange={handleInputChange}
                placeholder="E-mail"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
