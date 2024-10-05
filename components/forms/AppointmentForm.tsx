'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import {  CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"


 
const AppointmentForm = ({
    userId, patientId, type, appointment, setOpen
}: {
    userId: string;
    patientId: string;
    type: "criar" | "cancelar" | "agendar";       // SCHEDULE = AGENDAR //
    appointment?: Appointment;
    setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment && appointment.primaryPhysician,
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment && appointment.reason || "",
      note: appointment && appointment.note || "",
      cancellationReason: appointment && appointment.cancellationReason || "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
        case 'agendar':
            status= 'agendado';
            break;
        case 'cancelar':
            status= 'cancelado';
            break;
    
        default:
            status = 'pendente';
            break;
    }

    try{
        if(type === 'criar' && patientId){
            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status,
            }

            const appointment = await createAppointment(appointmentData);

            if(appointment) {
                form.reset()
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
        } else {
          const appointmentToUpdate = {
            userId,
            appointmentId: appointment?.$id!,
            appointment: {
              primaryPhysician: values?.primaryPhysician,
              schedule: new Date(values?.schedule),
              status: status as Status,
              cancellationReason: values?.cancellationReason,
            },
            type
          }

          const updatedAppointment = await updateAppointment(appointmentToUpdate);

          if(updatedAppointment) {
            setOpen && setOpen(false)
            form.reset();
          }
        }

    } catch(error) {
      console.log(error)
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case 'cancelar':
        buttonLabel = 'Cancelar Consulta'
        break;
    case 'criar':
        buttonLabel = 'Criar Consulta'
        break;
        case 'agendar':
            buttonLabel = 'Agendar Consulta'
    default:
        break;
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      {type === 'criar' &&  <section className="mb-12 space-y-4">
        <h1 className="header">Nova Consulta</h1>
        <p className="text-dark-700">Agende uma nova consulta em apenas 10 segundos.</p>
      </section>}

    {type !== "cancelar" && (
    <>
    {/* DOCTOR SELECT */}
    <CustomFormField
    fieldType={FormFieldType.SELECT}
    control={form.control}
    name="primaryPhysician"
    label="Doutor"
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
    {/* SCHEDULE DATE */}
    <CustomFormField 
    fieldType={FormFieldType.DATE_PICKER}
    control={form.control}
    name="schedule"
    label="Agendamento para a consulta"
    showTimeSelect
    dateFormat="MM/dd/yyyy - h:mm aa"
    />
    {/* REASON FOR APPOINTMENT & NOTES */}
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      fieldType={FormFieldType.TEXTAREA}
      control={form.control}
      name="reason"
      label="Motivos para consulta"
      placeholder="Insira os sintomas que estão lhe afetando"
      />

      <CustomFormField 
      fieldType={FormFieldType.TEXTAREA}
      control={form.control}
      name="note"
      label="Observações (caso houver)"
      placeholder="Insira as observações que desejar"
      />
    </div>
    </>
    )}

    {/* CANCELLATION REASON */}
    { type === "cancelar" && (
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="cancellationReason"
        label="Causa do cancelamento"
        placeholder="Insira os fundamentos para o cancelamento dessa consulta."
        />
    )}

            <SubmitButton isLoading={isLoading} 
            className={`${type === 'cancelar' ? 
            'shad-danger-btn' : 'shad-primary-btn'} 
            w-full`}>
                {buttonLabel}
            </SubmitButton>
    </form>
    </Form>
  )
}

export default AppointmentForm
