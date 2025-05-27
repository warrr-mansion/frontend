import api from '@/api/axiosInstance'

export const fetchFavoriteRegions = async (pageNo = 1, pageSize = 10) => {
  const res = await api.get('/v1/favorites/REGION', {
    params: { pageNo, pageSize },
  })

  console.log('📦 [fetchFavoriteRegions] 응답 전체:', res)
  console.log('📦 [fetchFavoriteRegions] res.data:', res.data)

  return res.data
}

export const addFavoriteRegionAPI = (regionCode) =>
  api.post('/v1/favorites', {
    favoriteType: 'REGION',
    code: String(regionCode), // 숫자여도 문자열로 전달해야 함
  })

export const deleteFavoriteRegion = (regionCode) =>
  api.delete('/v1/favorites', {
    data: {
      favoriteType: 'REGION',
      code: String(regionCode),
    },
  })

export const fetchFavoriteHouses = async (pageNo = 1, pageSize = 10) => {
  const res = await api.get('/v1/favorites/HOUSE', {
    params: { pageNo, pageSize },
  })
  console.log('📦 [fetchFavoriteHouses] res.data:', res.data)
  return res.data
}

export const deleteFavoriteHouse = (id) =>
  api.delete('/v1/favorites', {
    data: {
      favoriteType: 'HOUSE',
      code: String(id),
    },
  })
