'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Save, X, Edit2 } from 'lucide-react'
import { PeopleService } from "@/services/PeopleService"
import { usePeopleContext } from '@/contexts/PeopleContext'



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
    responsible_person: {
      id_person: number
      id_responsible: number
      name: string
      relationship: string
      rg: string
      cpf: string
      cell_phone: string
    }
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

  const handleCheckboxChange = (checked: boolean) => {
    if (person) {
      setPerson((prev) =>
        prev ? { ...prev, data: { ...prev.data, active: checked ? "Y" : "N" } } : null
      );
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
    <div className="container mx-auto p-6 max-w-3xl pb-52">
      <div className="sticky top-0 bg-white z-10 p-4">
        <div className="flex justify-between items-center mb-6">

          {/* Botão de Voltar */}
          <Button onClick={() => window.history.back()} variant="ghost">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          

          <h1 className="text-2xl font-bold text-gray-900">
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
      </div>


      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">

        <div className="flex items-center space-x-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={person.data.active === "Y"}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-purple-600"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            {person.data.active === "Y" ? "Ativo" : "Inativo"}
          </label>
        </div>

        <Separator />

        <h2 className="text-xl font-semibold">Informações pessoais</h2>
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


        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={person.data.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
            disabled={!isEditing}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Documentação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                name="rg"
                value={person.data.rg || ''}
                onChange={handleInputChange}
                placeholder="RG"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={person.data.cpf || ''}
                onChange={handleInputChange}
                placeholder="CPF"
                disabled={!isEditing}
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
            <Input
              id="blood_type"
              name="blood_type"
              value={person.data.blood_type || ''}
              onChange={handleInputChange}
              placeholder="Tipo Sanguineo"
              disabled={!isEditing}
            />
          </div>

        </div>


        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={person.data.cep || ''}
                onChange={handleInputChange}
                placeholder="Número"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                value={person.data.city || ''}
                onChange={handleInputChange}
                placeholder="Rua"
                disabled={!isEditing}
              />
            </div>
          </div>


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
              <Label htmlFor="home_phone">Telefone de casa</Label>
              <Input
                id="home_phone"
                name="home_phone"
                value={person.data.home_phone || ''}
                onChange={handleInputChange}
                placeholder="Telefone de casa"
                disabled={!isEditing}
              />
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telefone de contato</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              value={person.data.contact_phone || ''}
              onChange={handleInputChange}
              placeholder="Telefone de contato"
              disabled={!isEditing}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Informações Complementares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cad_unico">Cadastro único</Label>
              <Input
                id="cad_unico"
                name="cad_unico"
                value={person.data.cad_unico || ''}
                onChange={handleInputChange}
                placeholder="Cadastro único"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nis">NIS</Label>
              <Input
                id="nis"
                name="nis"
                value={person.data.nis || ''}
                onChange={handleInputChange}
                placeholder="NIS"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">Escola</Label>
            <Input
              id="school"
              name="school"
              value={person.data.school || ''}
              onChange={handleInputChange}
              placeholder="Escola"
              disabled={!isEditing}
            />
          </div>
        </div>



        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Dados do Responsável</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Responsável</Label>
              <Input
                id="name"
                name="name"
                value={person.data.responsible_person.name || ''}
                onChange={handleInputChange}
                placeholder="Nome do Responsável"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Estado civil</Label>
              <Input
                id="relationship"
                name="relationship"
                value={person.data.responsible_person.relationship || ''}
                onChange={handleInputChange}
                placeholder="Estado civil"
                disabled={!isEditing}
              />
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rg">RG do Responsável</Label>
              <Input
                id="rg"
                name="rg"
                value={person.data.responsible_person.rg || ''}
                onChange={handleInputChange}
                placeholder="RG do Responsáve"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF do Responsável</Label>
              <Input
                id="cpf"
                name="cpf"
                value={person.data.responsible_person.cpf || ''}
                onChange={handleInputChange}
                placeholder="CPF do Responsável"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell_phone">Celular do Responsável</Label>
            <Input
              id="cell_phone"
              name="cell_phone"
              value={person.data.responsible_person.cell_phone || ''}
              onChange={handleInputChange}
              placeholder="Celular do Responsável"
              disabled={!isEditing}
            />
          </div>
        </div>




      </div>
    </div>
  )
}
