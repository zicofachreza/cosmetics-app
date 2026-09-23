import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
    isProduction: false, // Ubah ke true nanti kalau sudah live
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export const core = new midtransClient.CoreApi({
    isProduction: false, // Ubah ke true nanti kalau sudah live
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})
