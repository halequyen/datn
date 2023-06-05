export function formatDate(dob: string | Date): string {
  if (!dob) {
    return ''
  }

  const date = new Date(dob)
  if (isNaN(date.getTime())) {
    return ''
  }

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function formatExpense(amount: number): string {
  if (!amount) {
    return ''
  }
  const strAmount = amount.toString()
  let formattedAmount = ''
  let counter = 0

  for (let i = strAmount.length - 1; i >= 0; i--) {
    formattedAmount = strAmount[i] + formattedAmount
    counter++

    if (counter === 3 && i > 0) {
      formattedAmount = '.' + formattedAmount
      counter = 0
    }
  }
  return formattedAmount
}

export function formatTotalPrices(item: any): string {
  if (item && item.quantity && item.price) {
    const quantity: number = parseFloat(item.quantity) || 0
    const price: number = parseFloat(item.price) || 0
    const totalPrice: number = quantity * price

    const strAmount = totalPrice.toString()
    let formattedAmount = ''
    let counter = 0

    for (let i = strAmount.length - 1; i >= 0; i--) {
      formattedAmount = strAmount[i] + formattedAmount
      counter++

      if (counter === 3 && i > 0) {
        formattedAmount = '.' + formattedAmount
        counter = 0
      }
    }
    return formattedAmount
  }
  return '0'
}

export const patientType: any = {
  '0': 'Bệnh nhân mới',
  '1': 'Tái Khám'
}

export const patientStateColor: any = {
  '0': '#f4d454',
  '1': '#4dbb11'
}

export const patientState: any = {
  '0': 'Chưa thanh toán',
  '1': 'Đã thanh toán'
}

export const staffState: any = {
  '0': 'Đang hoạt động',
  '1': 'Đã thôi việc'
}

export const staffStateColor: any = {
  '0': '#4dbb11',
  '1': '#f4d454'
}

export const gender: any = {
  '0': 'Nam',
  '1': 'Nữ',
  '2': 'Khác'
}
