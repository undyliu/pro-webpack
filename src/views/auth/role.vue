<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sysModel" placeholder="系统模块">
        <el-option v-for="item in  sysModelOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150px" align="center" label="系统模块">
        <template scope="scope">
          <span>{{scope.row.sysModel}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="角色名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="300px" align="center" label="描述">
        <template scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template scope="scope">
          <el-button size="small" type="primary" icon="setting" @click="handleModifyStatus(scope.row,'published')">设置权限
          </el-button>
          <el-button size="small" type="primary" icon="edit" @click="handleModifyStatus(scope.row,'published')">编辑
          </el-button>
          <el-button size="small" type="danger" icon="delete" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="系统模块">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  sysModelOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色名称">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
<!--
        <el-transfer
          v-model="value3"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :render-content="renderFunc"
          :titles="['未选', '已选']"
          :button-texts="['添加', '移除']"
          :footer-format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="data">
        </el-transfer>
-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/auth/role'
import waves from '@/directive/waves/index.js' // 水波纹指令

const sysModelOptions = [
  { key: 'auth', display_name: '权限管理' },
  { key: 'basic', display_name: '基础数据' },
  { key: 'mall', display_name: '商城' },
  { key: 'wms', display_name: '进销存' },
  { key: 'tms', display_name: '配送' }
]

export default {
  name: 'role',
  directives: {
    waves
  },
  data () {
    return {
      sysModelOptions,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        name: '',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      tableKey: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    create () {
      /*
      this.temp.id = parseInt(Math.random() * 100) + 1024
      this.temp.timestamp = +new Date()
      this.temp.author = '原创作者'
      this.list.unshift(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      }) */
    },
    update () {
      /*
      this.temp.timestamp = +this.temp.timestamp
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, this.temp)
          break
        }
      }
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      }) */
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        name: '',
        desc: ''
      }
    }
  }
}
</script>
