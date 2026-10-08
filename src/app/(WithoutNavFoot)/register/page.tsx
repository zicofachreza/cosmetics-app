'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    registerSchema,
    RegisterForm,
} from '@/schemas/registerSchema'

export default function RegisterPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] =
        useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterForm>({
        resolver: zodResolver(
            registerSchema
        ),
    })

    const onSubmit = async (
        data: RegisterForm
    ) => {
        try {
            const response =
                await fetch(
                    '/api/register',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',
                        },

                        body: JSON.stringify(
                            data
                        ),
                    }
                )

            const result =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        result.error ||
                        'Pendaftaran Gagal'
                )
            }

            await Swal.fire({
                icon: 'success',

                title: 'Success',

                text: result.message,

                timer: 2000,

                showConfirmButton: false,
            })

            router.push('/login')
        } catch (error) {
            Swal.fire({
                icon: 'error',

                title: 'Pendaftaran Gagal',

                text:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan',

                timer: 2000,

                showConfirmButton: false,
            })
        }
    }

    return (
        <main className="min-h-screen flex flex-col lg:flex-row">
            {/* MOBILE */}

            <div className="lg:hidden w-full bg-pink-100 flex items-center justify-center py-8">
                <Link href="/">
                    <Image
                        src="/ik_logo_2.png"
                        alt="IyahKosmetik"
                        width={150}
                        height={150}
                        className="w-28 h-28 object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* DESKTOP */}

            <div className="hidden lg:flex w-1/2 bg-pink-100 items-center justify-center relative min-h-screen">
                <div className="text-center px-12">
                    <Link href="/">
                        <Image
                            src="/ik_logo_2.png"
                            alt="IyahKosmetik"
                            width={280}
                            height={280}
                            className="mx-auto"
                            priority
                        />
                    </Link>
                </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">

                    {/* HEADER */}

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Daftar
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Buat akun untuk memulai
                        </p>
                    </div>

                    {/* GOOGLE SIGN UP */}

                    <a
                        href="/api/auth/google"
                        className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                    >
                        <Image
                            src="/google-logo.png"
                            alt="Google"
                            width={20}
                            height={20}
                        />

                        <span className="text-sm font-medium">
                            Google
                        </span>
                    </a>

                    {/* DIVIDER */}

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200" />

                        <span className="px-4 text-sm text-gray-400">
                            Atau lanjutkan dengan
                        </span>

                        <div className="flex-1 border-t border-gray-200" />
                    </div>

                    {/* FORM */}

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                    >
                        {/* NAME */}

                        <div>
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                            >
                                Nama
                            </label>

                            <input
                                id="name"
                                {...register(
                                    'name'
                                )}
                                type="text"
                                placeholder="John Doe"
                                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                            />

                            {errors.name && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {
                                        errors
                                            .name
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}

                        <div>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Alamat Email
                            </label>

                            <input
                                id="email"
                                {...register(
                                    'email'
                                )}
                                type="email"
                                placeholder="nama@domain.com"
                                autoComplete="email"
                                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                            />

                            {errors.email && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {
                                        errors
                                            .email
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}

                        <div>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Kata Sandi
                            </label>

                            <div className="relative mt-2">
                                <input
                                    id="password"
                                    {...register(
                                        'password'
                                    )}
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="**********"
                                    autoComplete="new-password"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-pink-400 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={
                                                20
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                20
                                            }
                                        />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {
                                        errors
                                            .password
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* TERMS */}

                        <div>
                            <label className="flex items-start gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    {...register(
                                        'agreeTerms'
                                    )}
                                    className="accent-pink-400 mt-1 cursor-pointer"
                                />

                                <span>
                                    Saya menyetujui{' '}

                                    <Link
                                        href="/terms"
                                        className="text-pink-400 hover:underline"
                                    >
                                        Ketentuan Layanan
                                    </Link>{' '}

                                    dan{' '}

                                    <Link
                                        href="/privacy"
                                        className="text-pink-400 hover:underline"
                                    >
                                        Kebijakan Privasi
                                    </Link>
                                </span>
                            </label>

                            {errors.agreeTerms && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {
                                        errors
                                            .agreeTerms
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting
                            }
                            className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-300 text-white py-3 rounded-lg font-medium transition cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? 'Memuat...'
                                : 'Daftar'}
                        </button>
                    </form>

                    {/* LOGIN */}

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Sudah punya akun?{' '}

                        <Link
                            href="/login"
                            className="text-pink-400 font-medium hover:underline"
                        >
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}