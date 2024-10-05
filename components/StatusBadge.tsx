
import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div className={clsx("status-badge", {
        "bg-green-600": status === "agendado",
        "bg-blue-600": status === "pendente",
        "bg-red-600": status === "cancelado"
    })}>
      <Image 
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p className={clsx("text-12-semibold capitalize", {
        "text-green-500": status === "agendado",
        "text-blue-500": status === "pendente",
        "text-red-800": status === "cancelado",
      })}>{status}</p>
    </div>
  )
}

export default StatusBadge