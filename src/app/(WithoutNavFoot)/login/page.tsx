'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, LoginForm } from '@/schemas/loginSchema'
import { handleLogin } from './action'

export default function LoginPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        const result = await handleLogin(data)

        if (result?.error) {
            setServerError(result.error)
            return
        }

        router.refresh()
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
                        Welcome Back
                    </h1>

                    <p className="text-gray-600 mt-4 text-lg">
                        Sign in to continue your beauty journey with GlowBeauty.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
                <div className="w-full max-w-md">
                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Sign In
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* SOCIAL LOGIN */}
                    <div className="flex gap-4 mb-6">
                        <button className="flex-1 border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer">
                            <Image
                                src="/google-logo.png"
                                alt="Google"
                                width={20}
                                height={20}
                            />
                            <span className="text-sm font-medium">Google</span>
                        </button>

                        <button className="flex-1 border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer">
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

                    {/* DIVIDER */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-400">OR</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {serverError && (
                        <p className="text-red-500 font-medium text-sm mb-4 text-center">
                            {serverError}
                        </p>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* EMAIL */}
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

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative mt-2">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
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

                        {/* REMEMBER */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember_me"
                                    className="accent-pink-400 cursor-pointer"
                                />
                                Remember me
                            </label>

                            <Link
                                href=""
                                className="text-pink-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-lg font-medium transition cursor-pointer"
                        >
                            {isSubmitting ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>

                    {/* REGISTER */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don’t have an account?{' '}
                        <Link
                            href="/register"
                            className="text-pink-400 font-medium hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}
