import { useGetRestaurant } from '@/api/RestaurantApi'
import MenuItemComponent from '@/components/MenuItemComponent'
import OrderSummary from '@/components/OrderSummary'
import RestaurantInfo from '@/components/RestaurantInfo'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardFooter } from '@/components/ui/card'
import { MenuItem as MenuItemType } from '../types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CheckoutButton from '@/components/CheckoutButton'

export type CartItem = {
  _id: string
  name: string
  price: number
  quantity: number
}

const DetailPage = () => {
  const { restaurantId } = useParams()
  const { restaurant, isLoading } = useGetRestaurant(restaurantId)

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`)
    return storedCartItems ? JSON.parse(storedCartItems) : []
  })

  if (isLoading || !restaurant) {
    return 'Loading...'
  }

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      // 1. check if the item is already in the cart
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      )

      let updatedCartItems

      // 2. if item is in cart, update the quantity
      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      // 3. if item is not in cart, add it as a new item
      else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ]
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      )

      return updatedCartItems
    })
  }

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      )

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      )

      return updatedCartItems
    })
  }

  return (
    <div className='flex flex-col gap-10'>
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          alt=''
          className='rounded-md object-cover h-full w-full'
        />
      </AspectRatio>
      <div className='grid md:grid-cols-[4fr_2fr] gap-5 md:px-32'>
        <div className='flex flex-col gap-4'>
          <RestaurantInfo restaurant={restaurant} />
          <span className='text-2xl font-bold tracking-tight'>Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItemComponent
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DetailPage
