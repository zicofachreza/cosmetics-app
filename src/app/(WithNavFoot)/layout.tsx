import { CartProvider } from '../components/CartContext'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { UserProvider } from '../components/UserContext'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <UserProvider>
            <CartProvider>
                <Navbar />
                <main className="pt-15">{children}</main>
                <Footer />
            </CartProvider>
        </UserProvider>
    )
}
