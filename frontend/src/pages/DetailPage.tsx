import { useGetRestaurant } from '@/api/RestaurantApi'
import MenuItemComponent from '@/components/MenuItemComponent'
import RestaurantInfo from '@/components/RestaurantInfo'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useParams } from 'react-router-dom'

const DetailPage = () => {
  const { restaurantId } = useParams()
  const { restaurant, isLoading } = useGetRestaurant(restaurantId)

  if (isLoading || !restaurant) {
    return 'Loading...'
  }

  const addToCart = () => {}

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
              addToCart={() => addToCart()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DetailPage
