import fetch from '@/utils/fetch'

export function fetchList (query) {
  return fetch({
    url: '/role/list',
    method: 'get',
    params: query
  })
}
