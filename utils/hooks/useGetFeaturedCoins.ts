import { useGetFeaturedCoinsQuery } from '../../graphql/generated'

export const useGetFeaturedCoins = () => {
  const { data, loading, error } = useGetFeaturedCoinsQuery()

  return {
    featuredCoins: data?.getFeaturedCoins || [],
    loading,
    error
  }
}
