import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import UserModel from '@/models/user'

export const runtime = 'nodejs'

type GoogleTokenResponse = {
    access_token?: string
    id_token?: string
    error?: string
    error_description?: string
}

type GoogleUserInfo = {
    sub: string
    email: string
    email_verified: boolean
    name: string
    given_name?: string
    family_name?: string
    picture?: string
}

export async function GET(
    request: Request
) {
    try {
        const url = new URL(request.url)

        const code =
            url.searchParams.get('code')

        const state =
            url.searchParams.get('state')

        const error =
            url.searchParams.get('error')

        /*
         * User cancel Google login
         */
        if (error) {
            return NextResponse.redirect(
                new URL(
                    '/login?error=google_cancelled',
                    request.url
                )
            )
        }

        /*
         * Authorization code wajib ada
         */
        if (!code || !state) {
            return NextResponse.redirect(
                new URL(
                    '/login?error=google_invalid_request',
                    request.url
                )
            )
        }

        const cookieStore = await cookies()

        const savedState =
            cookieStore.get(
                'google_oauth_state'
            )?.value

        /*
         * Validasi OAuth state
         */
        if (
            !savedState ||
            savedState !== state
        ) {
            return NextResponse.redirect(
                new URL(
                    '/login?error=google_invalid_state',
                    request.url
                )
            )
        }

        /*
         * Hapus state cookie
         */
        cookieStore.delete(
            'google_oauth_state'
        )

        const clientId =
            process.env.GOOGLE_CLIENT_ID

        const clientSecret =
            process.env.GOOGLE_CLIENT_SECRET

        const redirectUri =
            process.env.GOOGLE_REDIRECT_URI

        if (
            !clientId ||
            !clientSecret ||
            !redirectUri
        ) {
            throw new Error(
                'Google OAuth environment variables are not configured'
            )
        }

        /*
         * Exchange authorization code
         * menjadi Google access token.
         */
        const tokenResponse =
            await fetch(
                'https://oauth2.googleapis.com/token',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/x-www-form-urlencoded',
                    },

                    body: new URLSearchParams({
                        code,

                        client_id:
                            clientId,

                        client_secret:
                            clientSecret,

                        redirect_uri:
                            redirectUri,

                        grant_type:
                            'authorization_code',
                    }),

                    cache: 'no-store',
                }
            )

        const tokenData =
            (await tokenResponse.json()) as GoogleTokenResponse

        if (
            !tokenResponse.ok ||
            !tokenData.access_token
        ) {
            console.error(
                'Google token error:',
                tokenData
            )

            throw new Error(
                'Failed to get Google access token'
            )
        }

        /*
         * Ambil profile user dari Google
         */
        const userResponse =
            await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization:
                            `Bearer ${tokenData.access_token}`,
                    },

                    cache: 'no-store',
                }
            )

        if (!userResponse.ok) {
            throw new Error(
                'Failed to get Google user profile'
            )
        }

        const googleUser =
            (await userResponse.json()) as GoogleUserInfo

        /*
         * Pastikan email tersedia dan verified.
         */
        if (
            !googleUser.email ||
            !googleUser.email_verified
        ) {
            return NextResponse.redirect(
                new URL(
                    '/login?error=google_email_not_verified',
                    request.url
                )
            )
        }

        /*
         * Cari/create user di MongoDB
         * lalu generate JWT kita sendiri.
         */
        const accessToken =
            await UserModel.findOrCreateGoogleUser({
                googleId:
                    googleUser.sub,

                email:
                    googleUser.email,

                name:
                    googleUser.name ||
                    googleUser.given_name ||
                    googleUser.email.split(
                        '@'
                    )[0],
            })

        /*
         * Redirect kembali ke aplikasi.
         */
        const response =
            NextResponse.redirect(
                new URL(
                    '/',
                    request.url
                )
            )

        /*
         * Gunakan cookie auth yang sama
         * dengan login email/password.
         */
        response.cookies.set(
            'Authorization',
            `Bearer ${accessToken}`,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    'production',

                sameSite: 'strict',

                path: '/',

                maxAge: 60 * 60 * 24,
            }
        )

        return response
    } catch (error) {
        console.error(
            'Google OAuth callback error:',
            error
        )

        return NextResponse.redirect(
            new URL(
                '/login?error=google_failed',
                request.url
            )
        )
    }
}