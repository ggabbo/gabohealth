import StatCard from '@/components/StatCard'
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Admin = async () => {
  const appointments = await getRecentAppointmentList()

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
      <Link href="/" className="cursor-pointer">
      <Image 
         src="/assets/icons/logo-full.svg"
         height={32}
         width={162}
         alt="logo"
         className="h-8 w-fit"
      />
      </Link>

      <p className="text-16-semibold">Painel do Admin</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
        <h1 className="header">Bem-vindo 👋</h1>
        <p className="text-dark-700">Comece o dia gerenciando novas consultas.</p>
        </section>

        <section className="admin-stat">
        <StatCard 
        type="consultas"
        count={appointments.scheduledCount}
        label="Consultas agendadas"
        icon="/assets/icons/appointments.svg"
        />
        
        <StatCard 
        type="pendente"
        count={appointments.pendingCount}
        label="Consultas pendentes"
        icon="/assets/icons/pending.svg"
        />

        <StatCard 
        type="cancelado"
        count={appointments.cancelledCount}
        label="Consultas canceladas"
        icon="/assets/icons/cancelled.svg"
        />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  )
}

export default Admin
