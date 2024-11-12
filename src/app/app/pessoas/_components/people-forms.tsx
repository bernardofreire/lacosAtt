"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, MoreHorizontal, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialPeople = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", phone: "(12)3456-7890"},
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "(09)8765-4321" },
]

const formSections = [
  {
    title: "Personal Information",
    fields: [
      { name: "firstName", label: "First Name", type: "text", required: true },
      { name: "lastName", label: "Last Name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "cpf", label: "CPF", type: "text", required: true, validation: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/ },
      { name: "uniqueRegistration", label: "Unique Registration", type: "text", required: true },
      { name: "nis", label: "NIS", type: "text", required: true },
      { name: "school", label: "School", type: "text", required: true },
      { name: "bloodType", label: "Blood Type", type: "select", required: true, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { name: "address", label: "Address", type: "text", required: true },
      { name: "number", label: "Number", type: "text", required: true },
      { name: "neighborhood", label: "Neighborhood", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "zipCode", label: "ZIP Code", type: "text", required: true, validation: /^\d{5}-\d{3}$/ },
      { name: "email", label: "Email", type: "email", required: true, validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { name: "currentAge", label: "Current Age", type: "number", required: true },
      { name: "homePhone", label: "Home Phone", type: "tel", required: true },
      { name: "mobilePhone", label: "Mobile Phone", type: "tel", required: true },
      { name: "contactPhone", label: "Contact Phone", type: "tel", required: true },
    ],
  },
  {
    title: "Guardian Information",
    fields: [
      { name: "guardianName", label: "Guardian's Name", type: "text", required: true },
      { name: "guardianRG", label: "Guardian's RG", type: "text", required: true },
      { name: "relationshipDegree", label: "Relationship Degree", type: "radio", required: true, options: ["FATHER", "MOTHER", "Other"] },
      { name: "guardianMobilePhone", label: "Guardian's Mobile Phone", type: "tel", required: true },
      { name: "guardianContactPhone", label: "Guardian's Contact Phone", type: "tel", required: true },
    ],
  },
  {
    title: "Activity Information",
    fields: [
      { name: "activityName", label: "Activity Name", type: "text", required: true },
      { name: "activityShift", label: "Shift", type: "select", required: true, options: ["Morning", "Afternoon", "Evening"] },
      { name: "activitySchedule", label: "Schedule", type: "text", required: true },
      { name: "activityDay", label: "Day", type: "select", required: true, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      { name: "activityDetails", label: "Additional Details", type: "textarea", required: false },
    ],
  },
]

export default function EnhancedPeopleDashboard() {
  const [people, setPeople] = useState(initialPeople)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [newPerson, setNewPerson] = useState({})
  const [editingPerson, setEditingPerson] = useState(null)
  const [errors, setErrors] = useState({})
  const [emailTyping, setEmailTyping] = useState(false)

//   Input para filtrar as pessoas

  const filteredPeople = people.filter(
    (person) =>
      person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm)
  )

//   Validação para o CPF

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '')
    if (cpf.length <= 3) return cpf
    if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
  }

//   Validação para o formato do telefone

  const formatPhone = (value, isMobile) => {
    const phone = value.replace(/\D/g, '')
    if (phone.length <= 2) return `(${phone}`
    if (phone.length <= 6) return `(${phone.slice(0, 2)})${phone.slice(2)}`
    if (isMobile) {
      if (phone.length <= 11) return `(${phone.slice(0, 2)})${phone.slice(2, 7)}-${phone.slice(7)}`
      return `(${phone.slice(0, 2)})${phone.slice(2, 7)}-${phone.slice(7, 11)}`
    } else {
      if (phone.length <= 10) return `(${phone.slice(0, 2)})${phone.slice(2, 6)}-${phone.slice(6)}`
      return `(${phone.slice(0, 2)})${phone.slice(2, 6)}-${phone.slice(6, 10)}`
    }
  }

//   Validar se tem valor no input

  const validateField = (name, value, validation) => {
    if (validation) {
      return validation.test(value)
    }
    return true
  }

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (['homePhone', 'contactPhone', 'guardianContactPhone'].includes(name)) {
      formattedValue = formatPhone(value, false)
    } else if (['mobilePhone', 'guardianMobilePhone'].includes(name)) {
      formattedValue = formatPhone(value, true)
    } else if (name === 'email') {
      setEmailTyping(true)
    }

    if (isEditing) {
      setEditingPerson((prev) => ({ ...prev, [name]: formattedValue }))
    } else {
      setNewPerson((prev) => ({ ...prev, [name]: formattedValue }))
    }
    
    const field = formSections.flatMap(section => section.fields).find(f => f.name === name)
    if (field && field.required && name !== 'email') {
      setErrors(prev => ({
        ...prev,
        [name]: formattedValue.trim() === '' ? 'This field is required' : 
                (field.validation && !validateField(name, formattedValue, field.validation) ? 'Invalid format' : null)
      }))
    }
  }

  useEffect(() => {
    if (emailTyping) {
      const timer = setTimeout(() => {
        setEmailTyping(false)
        const emailField = formSections.flatMap(section => section.fields).find(f => f.name === 'email')
        if (emailField && emailField.required) {
          const emailValue = editingPerson ? editingPerson.email : newPerson.email
          setErrors(prev => ({
            ...prev,
            email: emailValue && emailValue.trim() !== '' ? 
                   (emailField.validation && !validateField('email', emailValue, emailField.validation) ? 'Invalid email format' : null) :
                   'This field is required'
          }))
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [emailTyping, newPerson.email, editingPerson?.email])

  const validateStep = (person) => {
    const currentFields = formSections[currentStep].fields
    const stepErrors = {}
    let isValid = true

    currentFields.forEach(field => {
      if (field.required && (!person[field.name] || person[field.name].trim() === '')) {
        stepErrors[field.name] = 'This field is required'
        isValid = false
      } else if (field.validation && !validateField(field.name, person[field.name], field.validation)) {
        stepErrors[field.name] = 'Invalid format'
        isValid = false
      }
    })

    setErrors(stepErrors)
    return isValid
  }

  const handleNextStep = () => {
    if (validateStep(editingPerson || newPerson)) {
      setCurrentStep((prev) => Math.min(formSections.length - 1, prev + 1))
    } 
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleAddPerson = () => {
    if (validateStep(newPerson)) {
      const id = Math.max(...people.map((p) => p.id)) + 1
      setPeople([...people, { id, ...newPerson }])
      setNewPerson({})
      setIsAddDialogOpen(false)
      setCurrentStep(0)
    }
  }

  const handleEditPerson = () => {
    if (validateStep(editingPerson)) {
      setPeople(people.map(p => p.id === editingPerson.id ? editingPerson : p))
      setEditingPerson(null)
      setIsEditDialogOpen(false)
      setCurrentStep(0)
      
    }
  }

  const handleDelete = (id) => {
    setPeople(people.filter((person) => person.id !== id))
   
  }

  const renderFormField = (field, person, isEditing) => {
    switch (field.type) {
      case "select":
        return (
          <Select 
            name={field.name} 
            onValueChange={(value) => handleInputChange({ target: { name: field.name, value } }, isEditing)}
            value={person[field.name] || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "radio":
        return (
          <RadioGroup 
            name={field.name} 
            onValueChange={(value) => handleInputChange({ target: { name: field.name, value } }, isEditing)}
            value={person[field.name] || ''}
          >
            {field.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "textarea":
        return (
          <textarea
            name={field.name}
            onChange={(e) => handleInputChange(e, isEditing)}
            value={person[field.name] || ''}
            className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )
      default:
        return (
          <Input
            
            type={field.type}
            name={field.name}
            onChange={(e) => handleInputChange(e, isEditing)}
            value={person[field.name] || ''}
          />
        )
    }
  }

  const renderPersonForm = (person, isEditing) => (
    <>
      <div className="py-4">
        <div className="space-y-4">
          {formSections[currentStep].fields.map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <div className="col-span-3">
                {renderFormField(field, person, isEditing)}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < formSections.length - 1 ? (
            <Button onClick={handleNextStep}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={isEditing ? handleEditPerson : handleAddPerson}>
              {isEditing ? "Update Person" : "Add Person"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">People Dashboard</h1>
      <span className="text-[12px] sm:text-sm text-gray-400">Gerencie e visualize as informações das pessoas cadastradas. Acompanhe os detalhes, edite e organize os dados conforme suas necessidades.</span>
      <div className="flex justify-between items-center mt-10 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search people..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Person
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
              <DialogDescription>
                Enter the details of the new person here. Step {currentStep + 1} of {formSections.length}
              </DialogDescription>
            </DialogHeader>
            {renderPersonForm(newPerson, false)}
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPeople.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{`${person.firstName} ${person.lastName}`}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.phone}</TableCell>
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
                      setEditingPerson(person)
                      setIsEditDialogOpen(true)
                      setCurrentStep(0)
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(person.id)}>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Person</DialogTitle>
            <DialogDescription>
              Edit the details of the person here. Step {currentStep + 1} of {formSections.length}
            </DialogDescription>
          </DialogHeader>
          {editingPerson && renderPersonForm(editingPerson, true)}
        </DialogContent>
      </Dialog>
    </div>
  )
}