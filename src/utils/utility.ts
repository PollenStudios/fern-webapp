export function isEmpty(value: string | undefined | null) {
  if (
    value &&
    value !== 'undefined' &&
    value !== 'null' &&
    value !== '' &&
    typeof value !== 'undefined'
  ) {
    return false
  }
  return true
}

export const workInProgressAlert = () => {
  alert('Coming Soon')
}

// function to show active class
export const selectedTabsFn = (condition: boolean) => {
  return condition ? 'border-b-4' : ''
}
