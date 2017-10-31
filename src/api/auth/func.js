import fetch from '@/utils/fetch'

export function fetchList (query) {
  return fetch({
    url: '/func/list',
    method: 'get',
    params: query
  })
}
