import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            {
                message:
                    'Google OAuth environment variables are not configured',
            },
            {
                status: 500,
            }
        )
    }

    /*
     * State digunakan untuk mencegah CSRF
     * pada OAuth flow.
     */
    const state = crypto.randomBytes(32).toString('hex')

    const googleUrl =
        new URL(
            'https://accounts.google.com/o/oauth2/v2/auth'
        )

    googleUrl.searchParams.set(
        'client_id',
        clientId
    )

    googleUrl.searchParams.set(
        'redirect_uri',
        redirectUri
    )

    googleUrl.searchParams.set(
        'response_type',
        'code'
    )

    googleUrl.searchParams.set(
        'scope',
        'openid email profile'
    )

    googleUrl.searchParams.set(
        'state',
        state
    )

    const response = NextResponse.redirect(
        googleUrl
    )

    /*
     * Simpan state di httpOnly cookie.
     *
     * SameSite=Lax penting karena browser
     * akan kembali dari Google melalui
     * top-level GET redirect.
     */
    response.cookies.set(
        'google_oauth_state',
        state,
        {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                'production',

            sameSite: 'lax',

            path: '/',

            maxAge: 60 * 10,
        }
    )

    return response
}