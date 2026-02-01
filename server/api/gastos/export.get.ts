import { defineEventHandler, setHeader } from 'h3'
import ExcelJS from 'exceljs'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const [gastos, resumenSheet] = await Promise.all([
    GastoModel.find().sort({ date: -1 }).lean(),
    buildResumenSheet()
  ])

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Gastos')

  worksheet.columns = [
    { header: 'Descripcion', key: 'description', width: 32 },
    { header: 'Categoria', key: 'category', width: 18 },
    { header: 'Monto', key: 'amount', width: 12 },
    { header: 'Fecha', key: 'date', width: 14 }
  ]

  worksheet.getRow(1).font = { bold: true }
  worksheet.columns.forEach(column => {
    column.alignment = { vertical: 'middle', horizontal: 'left' }
  })

  gastos.forEach(gasto => {
    const date = gasto.date instanceof Date ? gasto.date : new Date(gasto.date)
    worksheet.addRow({
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount: Number(gasto.amount ?? 0),
      date: Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
    })
  })

  worksheet.getColumn('amount').numFmt = '#,##0'

  const resumen = workbook.addWorksheet('Resumen')
  resumen.columns = [
    { header: 'Mes', key: 'month', width: 18 },
    { header: 'Ingresos', key: 'ingresos', width: 14 },
    { header: 'Gastos', key: 'gastos', width: 14 },
    { header: 'Saldo', key: 'saldo', width: 14 },
    { header: 'Cambio vs mes anterior', key: 'delta', width: 22 }
  ]

  resumen.getRow(1).font = { bold: true }
  resumen.columns.forEach(column => {
    column.alignment = { vertical: 'middle', horizontal: 'left' }
  })

  resumenSheet.forEach(row => {
    resumen.addRow(row)
  })

  resumen.getColumn('ingresos').numFmt = '#,##0'
  resumen.getColumn('gastos').numFmt = '#,##0'
  resumen.getColumn('saldo').numFmt = '#,##0'
  resumen.getColumn('delta').numFmt = '#,##0'

  const buffer = await workbook.xlsx.writeBuffer()

  setHeader(
    event,
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  setHeader(event, 'Content-Disposition', 'attachment; filename="gastos.xlsx"')

  return Buffer.from(buffer)
})

type MonthKey = {
  year: number,
  month: number,
}

type MonthTotals = {
  ingresos: number,
  gastos: number,
}

async function buildResumenSheet() {
  const months = getRecentMonths(6)
  const [ingresosByMonth, gastosByMonth] = await Promise.all([
    aggregateByMonth(IngresoModel),
    aggregateByMonth(GastoModel)
  ])

  return months.map((monthKey, index) => {
    const key = `${monthKey.year}-${monthKey.month}`
    const ingresos = ingresosByMonth[key]?.ingresos ?? 0
    const gastos = gastosByMonth[key]?.gastos ?? 0
    const saldo = ingresos - gastos
    const prev = months[index + 1]
    const prevKey = prev ? `${prev.year}-${prev.month}` : null
    const prevSaldo = prevKey
      ? (ingresosByMonth[prevKey]?.ingresos ?? 0) - (gastosByMonth[prevKey]?.gastos ?? 0)
      : 0
    const delta = prev ? saldo - prevSaldo : 0
    return {
      month: formatMonth(monthKey.year, monthKey.month),
      ingresos,
      gastos,
      saldo,
      delta
    }
  })
}

function getRecentMonths(count: number): MonthKey[] {
  const now = new Date()
  const months: MonthKey[] = []

  for (let i = 0; i < count; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1
    })
  }

  return months
}

async function aggregateByMonth(model: typeof GastoModel | typeof IngresoModel) {
  const results = await model.aggregate<{ _id: MonthKey, total: number }>([
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }
    }
  ])

  const map: Record<string, MonthTotals> = {}

  results.forEach(row => {
    const key = `${row._id.year}-${row._id.month}`
    if (!map[key]) {
      map[key] = { ingresos: 0, gastos: 0 }
    }
    if (model.modelName === 'Ingreso') {
      map[key].ingresos = row.total
    } else {
      map[key].gastos = row.total
    }
  })

  return map
}

function formatMonth(year: number, month: number) {
  const date = new Date(year, month - 1, 1)
  const label = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric'
  }).format(date)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}
