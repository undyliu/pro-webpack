import fetch from '@/utils/fetch'

export function fetchList (query) {
  return fetch({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
