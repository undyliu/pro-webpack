import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
List.push(Mock.mock({
  id: '@increment',
  code: 'auth',
  name: '权限管理',
  homePage: 'http://www.baidu.com'
}))

export default {
  getList: config => {
    const { name, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  }
}
