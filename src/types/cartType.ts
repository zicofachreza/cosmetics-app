export type CartItem = {
    _id: string
    productId: string
    size: string
    quantity: number
    price: number
    product: {
        name: string
        thumbnail: string
        slug: string
    }
}

export type CartContextType = {
    cartCount: number
    setCartCount: (count: number) => void
    incrementCart: () => void
    syncCart: () => Promise<void>
    isLoggedIn: boolean
}
