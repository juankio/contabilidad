import { useToast } from '#imports'

export function useProfilePageFeedback() {
  const toast = useToast()

  const resetActionFeedback = () => {}

  const setActionMessage = (message: string) => {
    toast.add({
      title: message,
      color: 'primary',
      icon: 'i-lucide-check-circle'
    })
  }

  const setActionError = (message: string) => {
    toast.add({
      title: message,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }

  return {
    resetActionFeedback,
    setActionMessage,
    setActionError
  }
}
