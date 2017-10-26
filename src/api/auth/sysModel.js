import fetch from '@/utils/fetch'

export function fetchList (query) {
  return fetch({
    url: '/sysModel/list',
    method: 'get',
    params: query
  })
}
