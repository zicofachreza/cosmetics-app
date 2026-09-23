import { cookies } from 'next/headers'
import AutoNavbar from './AutoNavbar'

export default async function Navbar() {
    const cookieStore = await cookies()
    const authorization = cookieStore.get('Authorization')

    return <AutoNavbar initialAuth={!!authorization} />
}
