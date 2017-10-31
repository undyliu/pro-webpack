import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
List.push(Mock.mock({
  id: '@increment',
  sysModel: '基础数据',
  funcGroup: '商品管理',
  url: 'http://www.baidu.com',
  desc: '这是一个测试的角色'
}))

export default {
  getList: config => {
    const { page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List

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
