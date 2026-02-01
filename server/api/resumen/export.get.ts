import { defineEventHandler, setHeader } from 'h3'
import ExcelJS from 'exceljs'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

type MonthKey = {
  year: number
  month: number
}

type MonthTotals = {
  ingresos: number
  gastos: number
}

export default defineEventHandler(async (event) => {
  await connectMongoose()

  const months = getRecentMonths(6)
  const [ingresosByMonth, gastosByMonth] = await Promise.all([
    aggregateByMonth(IngresoModel),
    aggregateByMonth(GastoModel)
  ])

  const rows = months.map((monthKey) => {
    const key = `${monthKey.year}-${monthKey.month}`
    const ingresos = ingresosByMonth[key]?.ingresos ?? 0
    const gastos = gastosByMonth[key]?.gastos ?? 0
    return {
      month: formatMonth(monthKey.year, monthKey.month),
      ingresos,
      gastos,
      saldo: ingresos - gastos
    }
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Resumen')

  sheet.columns = [
    { header: 'Mes', key: 'month', width: 18 },
    { header: 'Ingresos', key: 'ingresos', width: 14 },
    { header: 'Gastos', key: 'gastos', width: 14 },
    { header: 'Saldo', key: 'saldo', width: 14 },
    { header: 'Cambio vs mes anterior', key: 'delta', width: 22 }
  ]

  sheet.getRow(1).font = { bold: true }
  sheet.columns.forEach((column) => {
    column.alignment = { vertical: 'middle', horizontal: 'left' }
  })

  rows.forEach((row, index) => {
    const prev = rows[index + 1]
    const delta = prev ? row.saldo - prev.saldo : 0
    sheet.addRow({
      month: row.month,
      ingresos: row.ingresos,
      gastos: row.gastos,
      saldo: row.saldo,
      delta
    })
  })

  sheet.getColumn('ingresos').numFmt = '#,##0'
  sheet.getColumn('gastos').numFmt = '#,##0'
  sheet.getColumn('saldo').numFmt = '#,##0'
  sheet.getColumn('delta').numFmt = '#,##0'

  const buffer = await workbook.xlsx.writeBuffer()

  setHeader(
    event,
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  setHeader(event, 'Content-Disposition', 'attachment; filename="resumen.xlsx"')

  return Buffer.from(buffer)
})

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

  results.forEach((row) => {
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
