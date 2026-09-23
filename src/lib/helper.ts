import { ShippingInfo } from "@/types/userType"

export default function idr(num: number) {
    return num.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'idr',
        minimumFractionDigits: 0,
    })
}

export function formatMidtransAddress(shipping: ShippingInfo) {
  return {
    first_name: shipping.firstName,
    last_name: shipping.lastName,
    address: shipping.address,
    phone: shipping.phone,
    country_code: 'IDN',
  }
}