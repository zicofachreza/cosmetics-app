'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterForm } from '@/schemas/registerSchema'

export default function RegisterPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterForm) => {
        try {
            const response = await fetch(
                `/api/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: result.message,
                timer: 2000,
                showConfirmButton: false,
            })

            router.push('/login')
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Register Failed',
                text: error.message,
                timer: 2000,
                showConfirmButton: false,
            })
        }
    }

    return (
        <main className="min-h-screen flex">
            {/* LEFT SIDE */}
            <div className="hidden lg:flex w-1/2 bg-pink-100 items-center justify-center relative">
                <div className="text-center px-12">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="GlowBeauty"
                            width={120}
                            height={120}
                            className="mx-auto"
                        />
                    </Link>

                    <h1 className="text-4xl font-bold text-gray-800 mt-6">
                        Join GlowBeauty
                    </h1>

                    <p className="text-gray-600 mt-4 text-lg">
                        Create your account and start your beauty journey today.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Sign Up
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create account to get started
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            className="flex-1 border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                        >
                            <Image
                                src="/google-logo.png"
                                alt="Google"
                                width={20}
                                height={20}
                            />
                            <span className="text-sm font-medium">Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex-1 border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                        >
                            <Image
                                src="/facebook-logo.png"
                                alt="Facebook"
                                width={20}
                                height={20}
                            />
                            <span className="text-sm font-medium">
                                Facebook
                            </span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-400">OR</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* FORM */}
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Name
                            </label>

                            <input
                                {...register('name')}
                                type="text"
                                placeholder="John"
                                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                            />

                            {errors.name && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Username
                            </label>

                            <input
                                {...register('username')}
                                type="text"
                                placeholder="john123"
                                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                            />

                            {errors.username && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <input
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                            />

                            {errors.email && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative mt-2">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create password"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 font-medium text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                {...register('agreeTerms')}
                                className="accent-pink-400 mt-1 cursor-pointer"
                            />

                            <span>
                                I agree to the{' '}
                                <Link
                                    href=""
                                    className="text-pink-400 hover:underline"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href=""
                                    className="text-pink-400 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {errors.agreeTerms && (
                            <p className="text-red-500 font-medium text-sm">
                                {errors.agreeTerms.message}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-lg font-medium transition cursor-pointer"
                        >
                            {isSubmitting ? 'Loading...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Login */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-pink-400 font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}