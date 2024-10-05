"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };


      const newPatient = await registerPatient(patient);

      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch(error) {
      console.log(error)
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Bem-vindo! 👋</h1>
            <p className="text-dark-900">Deixe-nos saber mais de você.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informações pessoais</h2>
            </div>
        </section>

    {/* FULL NAME */}
    <CustomFormField 
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="name"
    label="Nome completo"
    placeholder="Gabo Gabo da Silva"
    iconSrc="/assets/icons/user.svg"
    iconAlt="usuário"
    />

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* EMAIL */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="email"
    label="Email"
    placeholder="gabogabo@gmail.com"
    iconSrc="/assets/icons/email.svg"
    iconAlt="email"
    />

    {/* PHONE NUMBER */}
    <CustomFormField
    fieldType={FormFieldType.PHONE_INPUT}
    control={form.control}
    name="phone"
    label="Número de telefone"
    placeholder="123456789"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* DATE PICKER */}
    <CustomFormField
    fieldType={FormFieldType.DATE_PICKER}
    control={form.control}
    name="birthDate"
    label="Data de nascimento"
    />

    {/* GENDER */}
    <CustomFormField
    fieldType={FormFieldType.SKELETON}
    control={form.control}
    name="gender"
    label="Gender"
    renderSkeleton={(field) => (
      <FormControl>
        <RadioGroup className="flex h-11 gap-6 xl:justify-between"
        onValueChange={field.onChange}
        defaultValue={field.value}>
          {GenderOptions.map((option) => (
            <div key={option} className="radio-group">
              <RadioGroupItem value={option} id={option}/>
              <Label htmlFor={option} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    )}
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* ADDRESS */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="address"
    label="Endereço"
    placeholder="Casa do caralho, 420"
    />
    {/* OCCUPATION */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="occupation"
    label="Ocupação"
    placeholder="Come bosta profissional"
    />
    </div>
    
    <div className="flex flex-col gap-6 xl:flex-row">
    {/* EMERGENCY CONTACT NAME */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="emergencyContactName"
    label="Nome do contato de emergência"
    placeholder="Sujiro Kimimami"
    />
    {/* EMERGENCY CONTACT NUMBER */}
    <CustomFormField
    fieldType={FormFieldType.PHONE_INPUT}
    control={form.control}
    name="emergencyContactNumber"
    label="Número do contato de emergência"
    placeholder="123456789"
    />
    </div>

    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Informações do Paciente</h2>
        </div>
    </section> 

    {/* DOCTOR SELECT */}
    <CustomFormField
    fieldType={FormFieldType.SELECT}
    control={form.control}
    name="primaryPhysician"
    label="Assistente médico"
    placeholder="Selecione um assistente"
    >
      {Doctors.map((doctor) => (
        <SelectItem key={doctor.name} value={doctor.name}>
          <div className="flex cursor-pointer items-center gap-2">
            <Image 
              src={doctor.image}
              width={32}
              height={32}
              alt={doctor.name}
              className="rounded-full border border-dark-500"
            />
            <p>{doctor.name}</p>
          </div>
        </SelectItem>
      ))}
    </CustomFormField>

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* INSURANCE NAME */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="insuranceProvider"
    label="Provedor de seguro"
    placeholder="Agiota da rua 9"
    />
    {/* INSURANCE NUMBER */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="insurancePolicyNumber"
    label="Número da apólice de seguro"
    placeholder="ABC123456789"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* ALLERGIES */}
    <CustomFormField
    fieldType={FormFieldType.TEXTAREA}
    control={form.control}
    name="allergies"
    label="Alergias (caso houver)"
    placeholder="rush b no primeiro round tr, penicilina"
    />
    {/* CURRENT MEDICATION */}
    <CustomFormField
    fieldType={FormFieldType.TEXTAREA}
    control={form.control}
    name="currentMedication"
    label="Medicamento atual (caso houver)"
    placeholder="Askov 1L, Coca-cola 2L, mandar criança sifude no roblox"
    />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    {/* FAMILY MEDICAL HISTORY */}
    <CustomFormField
    fieldType={FormFieldType.TEXTAREA}
    control={form.control}
    name="familyMedicalHistory"
    label="Histórico médico familiar"
    placeholder="Mãe sofre de Lindezamuitolindacomopodeamomuito, Pai morreu de OuviuoalbumdaCharlieXCX"
    />
    {/* PAST MEDICAL HISTORY */}
    <CustomFormField
    fieldType={FormFieldType.TEXTAREA}
    control={form.control}
    name="pastMedicalHistory"
    label="Histórico médico pessoal"
    placeholder="Sofri de CS2Experience e Overwatch com a praga de Mercy"
    />
    </div>

    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Identificação e Verificação</h2>
        </div>
    </section> 

    {/* IDENTIFICATION DOCUMENT TYPE */}
    <CustomFormField
    fieldType={FormFieldType.SELECT}
    control={form.control}
    name="identificationType"
    label="Documento de identificação"
    placeholder="Selecione um documento"
    >
      {IdentificationTypes.map((type) => (
        <SelectItem key={type} value={type}>
          {type}
        </SelectItem>
      ))}
    </CustomFormField>

    {/* IDENTIFICATION NUMBER */}
    <CustomFormField
    fieldType={FormFieldType.INPUT}
    control={form.control}
    name="identificationNumber"
    label="Número do documento"
    placeholder="123456789"
    />
    {/* DRAG 'N' DROP FILES */}
    <CustomFormField
    fieldType={FormFieldType.SKELETON}
    control={form.control}
    name="identificationDocument"
    label="Documento de identificação digitalizado"
    renderSkeleton={(field) => (
      <FormControl>
        <FileUploader files={field.value} onChange={field.onChange} />
      </FormControl>
    )}
    />

    <section className="space-y-6">
        <div className="mb-6 space-y-1">
        <h2 className="sub-header">Consentimento e Privacidade</h2>
        </div>
    </section> 

    {/* CONSENT 'N' PRIVACY */}
    <div className="flex flex-col gap-6 xl:flex-col">
    <CustomFormField
    fieldType={FormFieldType.CHECKBOX}
    control={form.control}
    name="treatmentConsent"
    label="Dou consentimento ao tratamento."
    />

    <CustomFormField
    fieldType={FormFieldType.CHECKBOX}
    control={form.control}
    name="disclosureConsent"
    label="Ai que nao sei o que nao sei o que la."
    />

    <CustomFormField
    fieldType={FormFieldType.CHECKBOX}
    control={form.control}
    name="privacyConsent"
    label="Ao continuar, você concorda com os Termos de Serviço do GaboCare e confirma que leu nossa Política de Privacidade."
    />
    </div>

        <SubmitButton isLoading={isLoading}>Continuar</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
