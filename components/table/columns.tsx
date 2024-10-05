"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"

import { Appointment } from "@/types/appwrite.types"
import StatusBadge from "../StatusBadge"
import AppointmentModal from "../AppointmentModal"


export const columns: ColumnDef<Appointment>[] = [
    // APPOINTMENT N° //
    {
        header: 'N°',
        cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
    },
    // PATIENT NAME //
    {
        accessorKey: 'patient',
        header: 'Paciente',
        cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
    },
    // STATUS //
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <div className="min-w-[115px]">
            <StatusBadge status={row.original.status} />
        </div>
    )
  },
    // SCHEDULE //
  {
    accessorKey: "schedule",
    header: "Consultas",
    cell: ({ row }) => (
        <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>
    )
  },
    // CHOSEN DOCTOR BY PATIENT //
  {
    accessorKey: "primaryPhysician",
    header: () => <div>Doutores</div>,
    cell: ({ row }) => {
        const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)

        return (
            <div className="flex items-center gap-3">
                <Image 
                src={doctor?.image!}
                alt="doctor"
                width={100}
                height={100}
                className="size-8"
                />
                <p className="whitespace-nowrap">
                    Dr. {doctor?.name}
                </p>
            </div>
        )
    },
  },
    // CHOSEN DOCTOR BY PATIENT //
  {
    id: "actions",
    header: () => <div className="pl-4">Ações</div>,
    cell: ({ row: { original: data } }) => {
        return (
            <div className="flex gap-1">
                <AppointmentModal 
                type="agendar" 
                patientId={data.patient.$id}
                userId={data.userId}
                appointment={data}
                />

                <AppointmentModal 
                type="cancelar" 
                patientId={data.patient.$id}
                userId={data.userId}
                appointment={data}
                />
            </div>
        )
    },
  },
]
