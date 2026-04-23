import { defineApiHandler } from '../../utils/handler'
import { setHeader } from 'h3'
import ExcelJS from 'exceljs'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import { requireActiveProfile } from '../../utils/auth'
import mongoose from 'mongoose'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const profileObjectId = new mongoose.Types.ObjectId(profileId)
  const [gastos, resumenSheet] = await Promise.all([
    GastoModel.find({ profileId }).sort({ date: -1 }).lean(),
    buildResumenSheet(profileObjectId)
  ])

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Mi Contabilidad'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet('Gastos', {
    views: [{ state: 'frozen', ySplit: 1 }]
  })

  worksheet.columns = [
    { header: 'Descripción', key: 'description', width: 40 },
    { header: 'Categoría', key: 'category', width: 25 },
    { header: 'Monto', key: 'amount', width: 18 },
    { header: 'Fecha', key: 'date', width: 20 }
  ]

  // Estilizar cabeceras
  const headerRow = worksheet.getRow(1)
  headerRow.height = 30
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // slate-900
    }
    cell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
      size: 12
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    }
  })

  // Llenar datos
  let totalAmount = 0
  gastos.forEach((gasto, index) => {
    const date = gasto.date instanceof Date ? gasto.date : new Date(gasto.date)
    const row = worksheet.addRow({
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount: Number(gasto.amount ?? 0),
      date: Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    })

    totalAmount += Number(gasto.amount ?? 0)

    // Zebra striping y bordes
    const isEven = index % 2 === 0
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFF8FAFC' : 'FFFFFFFF' } // slate-50 / white
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
      cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'right' : 'left' }
    })
  })

  // Fila de Total
  const totalRow = worksheet.addRow({
    description: 'TOTAL',
    category: '',
    amount: totalAmount,
    date: ''
  })
  totalRow.height = 25
  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true, size: 12, color: { argb: 'FF0F172A' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1F5F9' } // slate-100
    }
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    }
    if (colNumber === 3) cell.alignment = { horizontal: 'right' }
  })
  worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`)
  totalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' }

  // Formato de moneda para toda la columna de monto
  worksheet.getColumn('amount').numFmt = '"$"#,##0.00'

  // ==========================================
  // SHEET: RESUMEN
  // ==========================================
  const resumen = workbook.addWorksheet('Resumen', {
    views: [{ state: 'frozen', ySplit: 1 }]
  })

  resumen.columns = [
    { header: 'Mes', key: 'month', width: 25 },
    { header: 'Ingresos', key: 'ingresos', width: 20 },
    { header: 'Gastos', key: 'gastos', width: 20 },
    { header: 'Saldo Final', key: 'saldo', width: 20 },
    { header: 'Variación vs Anterior', key: 'delta', width: 25 }
  ]

  const headerRowResumen = resumen.getRow(1)
  headerRowResumen.height = 30
  headerRowResumen.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }
    }
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  resumenSheet.forEach((dataRow, index) => {
    const row = resumen.addRow(dataRow)
    const isEven = index % 2 === 0
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFF8FAFC' : 'FFFFFFFF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'left' : 'right' }

      // Colores para saldo y delta
      if (colNumber === 4) { // Saldo
        cell.font = { bold: true, color: { argb: Number(cell.value) >= 0 ? 'FF059669' : 'FFE11D48' } } // emerald-600 / rose-600
      }
      if (colNumber === 5) { // Delta
        cell.font = { bold: true, color: { argb: Number(cell.value) >= 0 ? 'FF059669' : 'FFE11D48' } }
      }
    })
  })

  const cols = ['ingresos', 'gastos', 'saldo', 'delta']
  cols.forEach((key) => {
    resumen.getColumn(key).numFmt = '"$"#,##0.00'
  })

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
  year: number
  month: number
}

type MonthTotals = {
  ingresos: number
  gastos: number
}

async function buildResumenSheet(profileId: mongoose.Types.ObjectId) {
  const months = getRecentMonths(6)
  const [ingresosByMonth, gastosByMonth] = await Promise.all([
    aggregateByMonth(IngresoModel, profileId),
    aggregateByMonth(GastoModel, profileId)
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

async function aggregateByMonth(
  model: typeof GastoModel | typeof IngresoModel,
  profileId: mongoose.Types.ObjectId
) {
  const results = await model.aggregate<{ _id: MonthKey, total: number }>([
    { $match: { profileId } },
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
  const label = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric'
  }).format(date)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}
