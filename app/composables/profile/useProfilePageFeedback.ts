export function useProfilePageFeedback() {
  const profileActionMessage = ref('')
  const profileActionError = ref('')

  const resetActionFeedback = () => {
    profileActionMessage.value = ''
    profileActionError.value = ''
  }

  const setActionMessage = (message: string) => {
    profileActionMessage.value = message
    profileActionError.value = ''
  }

  const setActionError = (message: string) => {
    profileActionError.value = message
    profileActionMessage.value = ''
  }

  return {
    profileActionMessage,
    profileActionError,
    resetActionFeedback,
    setActionMessage,
    setActionError
  }
}
