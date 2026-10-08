'use client'

import Swal from 'sweetalert2'

export default function NewsletterSubscribe() {
    const handleSubscribe = () => {
        Swal.fire({
            title: 'Layanan Belum Tersedia',
            text: 'Fitur berlangganan saat ini belum tersedia',
            icon: 'info',
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    'bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer',
            },
        })
    }

    return (
        <div className="flex mt-8 bg-white border border-pink-200 rounded-full overflow-hidden">
            <input
                type="email"
                placeholder="Masukkan email Anda"
                className="min-w-0 flex-1 px-4 sm:px-6 py-3 outline-none text-sm sm:text-base"
            />

            <button
                type="button"
                onClick={handleSubscribe}
                className="shrink-0 whitespace-nowrap flex items-center justify-center bg-pink-400 text-white px-4 sm:px-8 py-3 text-sm sm:text-base hover:bg-pink-500 transition cursor-pointer"
            >
                Berlangganan
            </button>
        </div>
    )
}
