import { useCalendarDateInput } from './useCalendarDateInput'
import { useMoneyInput } from './useMoneyInput'

export function useGastoForm(onSaved: () => void | Promise<void>) {
  const form = reactive({
    description: '',
    category: '',
    amount: 0
  })
  const newCategoryInput = ref('')
  const isSaving = ref(false)
  const formError = ref('')
  const receiptFile = ref<File | null>(null)
  const receiptPreviewUrl = ref('')

  const { dateValue } = useCalendarDateInput()
  const { amountInput } = useMoneyInput(toRef(form, 'amount'))
  const { activeExpenseCategories, refreshProfileCatalog } = useProfile()

  const categories = computed(() => activeExpenseCategories.value)

  const normalizeCategory = (value: string) => value.trim().slice(0, 40)
  const selectedCategory = computed(() => {
    const custom = normalizeCategory(newCategoryInput.value)
    return custom || form.category
  })

  watch(
    categories,
    (nextCategories) => {
      if (!nextCategories.includes(form.category)) {
        form.category = nextCategories[0] ?? ''
      }
    },
    { immediate: true }
  )

  watch(receiptFile, (next, prev) => {
    if (receiptPreviewUrl.value) {
      URL.revokeObjectURL(receiptPreviewUrl.value)
      receiptPreviewUrl.value = ''
    }

    if (next) {
      receiptPreviewUrl.value = URL.createObjectURL(next)
    }

    if (prev && prev !== next) {
      // No-op: preview URL is revoked above.
    }
  })

  const setReceiptFile = (file: File | null) => {
    if (!file) {
      receiptFile.value = null
      return
    }

    const validMime = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    if (!validMime) {
      formError.value = 'El comprobante debe ser JPG, PNG o WEBP.'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      formError.value = 'El comprobante no debe superar 5MB.'
      return
    }

    formError.value = ''
    receiptFile.value = file
  }

  const clearReceiptFile = () => {
    receiptFile.value = null
  }

  const uploadReceipt = async () => {
    if (!receiptFile.value) {
      return null
    }

    const signPayload = await $fetch<{
      cloudName: string
      apiKey: string
      folder: string
      timestamp: string
      signature: string
    }>('/api/uploads/cloudinary-sign', {
      method: 'POST'
    })

    const formData = new FormData()
    formData.append('file', receiptFile.value)
    formData.append('api_key', signPayload.apiKey)
    formData.append('timestamp', signPayload.timestamp)
    formData.append('signature', signPayload.signature)
    formData.append('folder', signPayload.folder)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Cloudinary upload failed')
    }

    const uploaded = await response.json() as { secure_url?: string, public_id?: string }
    if (!uploaded.secure_url || !uploaded.public_id) {
      throw new Error('Cloudinary response invalid')
    }

    return {
      url: uploaded.secure_url,
      publicId: uploaded.public_id
    }
  }

  const submitGasto = async () => {
    formError.value = ''

    if (!form.description.trim()) {
      formError.value = 'Agrega una descripcion.'
      return
    }

    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      formError.value = 'Agrega un monto valido.'
      return
    }

    if (!selectedCategory.value.trim()) {
      formError.value = 'Selecciona o escribe una categoria.'
      return
    }

    isSaving.value = true

    try {
      const uploadedReceipt = await uploadReceipt()
      const date = dateValue.value ? dateValue.value.toString() : undefined
      await $fetch('/api/gastos', {
        method: 'POST',
        body: {
          description: form.description.trim(),
          category: selectedCategory.value,
          amount,
          date,
          ...(uploadedReceipt ? { receipt: uploadedReceipt } : {})
        }
      })
      await refreshProfileCatalog()
      await onSaved()
      form.description = ''
      form.amount = 0
      newCategoryInput.value = ''
      clearReceiptFile()
    } catch {
      formError.value = 'No se pudo guardar el gasto o subir el comprobante.'
    } finally {
      isSaving.value = false
    }
  }

  onMounted(async () => {
    await refreshProfileCatalog()
  })

  onUnmounted(() => {
    if (receiptPreviewUrl.value) {
      URL.revokeObjectURL(receiptPreviewUrl.value)
    }
  })

  return {
    form,
    categories,
    newCategoryInput,
    dateValue,
    amountInput,
    isSaving,
    formError,
    receiptFile,
    receiptPreviewUrl,
    setReceiptFile,
    clearReceiptFile,
    submitGasto
  }
}
