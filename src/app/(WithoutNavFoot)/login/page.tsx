'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, LoginForm } from '@/schemas/loginSchema'
import { handleLogin } from './action'

export default function LoginPage() {
    const [showPassword, setShowPassword] =
        useState(false)

    const [serverError, setServerError] =
        useState('')

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    useEffect(() => {
        const params =
            new URLSearchParams(
                window.location.search
            )

        const error =
            params.get('error')

        if (!error) {
            return
        }

        const errorMessages: Record<
            string,
            string
        > = {
            google_cancelled:
                'Masuk dengan Google dibatalkan.',

            google_invalid_request:
                'Permintaan autentikasi Google tidak valid.',

            google_invalid_state:
                'Sesi autentikasi Google telah kedaluwarsa. Silakan coba lagi.',

            google_email_not_verified:
                'Email Google Anda belum diverifikasi.',

            google_failed:
                'Gagal masuk dengan Google. Silakan coba lagi.',
        }

        setServerError(
            errorMessages[error] ||
                'Login Google gagal.'
        )

        /*
         * Hapus query error dari URL
         */
        window.history.replaceState(
            {},
            '',
            '/login'
        )
    }, [])

    const onSubmit = async (
        data: LoginForm
    ) => {
        setServerError('')

        const result =
            await handleLogin(data)

        if (result?.error) {
            setServerError(
                result.error
            )
        }
    }

    return (
        <main className="min-h-screen flex flex-col lg:flex-row">
            {/* MOBILE LOGO */}

            <div className="lg:hidden w-full bg-pink-100 flex items-center justify-center py-8">
                <Link href="/">
                    <Image
                        src="/ik_logo_2.png"
                        alt="GlowBeauty"
                        width={150}
                        height={150}
                        className="w-28 h-28 object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* DESKTOP LOGO */}

            <div className="hidden lg:flex lg:w-1/2 bg-pink-100 items-center justify-center relative min-h-screen">
                <div className="text-center px-12">
                    <Link href="/">
                        <Image
                            src="/ik_logo_2.png"
                            alt="GlowBeauty"
                            width={280}
                            height={280}
                            className="mx-auto"
                            priority
                        />
                    </Link>
                </div>
            </div>

            {/* LOGIN FORM */}

            <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 lg:py-0">
                <div className="w-full max-w-md">

                    {/* HEADER */}

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Masuk
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Masukkan kredensial Anda untuk mengakses akun
                        </p>
                    </div>

                    {/* GOOGLE LOGIN */}

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

                    {/* SERVER ERROR */}

                    {serverError && (
                        <p className="text-red-500 font-medium text-sm mb-4 text-center">
                            {serverError}
                        </p>
                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-5"
                    >
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
                                    autoComplete="current-password"
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

                        {/* REMEMBER / FORGOT */}

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember_me"
                                    className="accent-pink-400 cursor-pointer"
                                />

                                Tetap Masuk
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-pink-400 hover:text-pink-500 hover:underline"
                            >
                                Lupa Kata Sandi?
                            </Link>
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
                                : 'Masuk'}
                        </button>
                    </form>

                    {/* REGISTER */}

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Belum punya akun?{' '}

                        <Link
                            href="/register"
                            className="text-pink-400 font-medium hover:underline"
                        >
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}