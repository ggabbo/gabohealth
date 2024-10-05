import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Seu nome deve conter no mínimo 2 caractéres")
    .max(50, "Seu nome deve conter no máximo 50 caractéres"),
  email: z.string().email("Endereço de email inválido"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Número de telefone inválido"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Seu nome deve conter no mínimo 2 caractéres")
    .max(50, "Seu nome deve conter no máximo 50 caractéres"),
  email: z.string().email("Endereço de email inválido"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Número de telefone inválido"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Homem", "Mulher", "Praga_pj"]),
  address: z
    .string()
    .min(5, "Seu endereço deve conter no mínimo 2 caractéres")
    .max(500, "Seu endereço deve conter no máximo 500 caractéres"),
  occupation: z
    .string()
    .min(2, "Sua ocupação deve conter no mínimo 2 caractéres")
    .max(500, "Sua ocupação deve conter no máximo 500 caractéres"),
  emergencyContactName: z
    .string()
    .min(2, "Nome do contato deve conter no mínimo 2 caractéres")
    .max(50, "Nome do contato deve conter no máximo 50 caractéres"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Número de telefone inválido"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Nome do provedor deve conter no mínimo 2 caractéres")
    .max(50, "Nome do provedor deve conter no máximo 50 caractéres"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Número da apólice deve conter no mínimo 2 caractéres")
    .max(50, "Número da apólice deve conter no máximo 50 caractéres"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Você precisa consentir ao tratamento para prosseguir",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Você precisa consentir ao uso de seus dados para prosseguir",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Você precisa ler e concordar com a Política de Privacidade para prosseguir",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Selecione no mínimo um assistente"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "O motivo deve conter no mínimo 2 caractéres")
    .max(500, "O motivo deve conter máximo 500 caractéres"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Selecione no mínimo um assistente"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Selecione no mínimo um assistente"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "A causa deve conter no mínimo 2 caractéres")
    .max(500, "A causa deve conter máximo 500 caractéres"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "criar":
      return CreateAppointmentSchema;
    case "cancelar":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}