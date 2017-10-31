<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sysModel" placeholder="系统模块">
        <el-option v-for="item in  sysModelOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.funcGroup" placeholder="功能分组">
        <el-option v-for="item in  funcGroupOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

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

      <el-table-column width="150px" align="center" label="所属分组">
        <template scope="scope">
          <span>{{scope.row.funcGroup}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="250px" align="center" label="URL">
        <template scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="描述">
        <template scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="edit">编辑</el-button>
          </el-button>
          <el-button size="small" type="danger" icon="delete" @click="handleDelete(scope.row)">删除
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
      <el-form class="small-space" :model="sysForm" :rules="rules" ref="sysForm" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="系统模块" prop="sysModel">
          <el-select class="filter-item" v-model="sysForm.sysModel" placeholder="请选择">
            <el-option v-for="item in  sysModelOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="功能分组">
          <el-select class="filter-item" v-model="sysForm.funcGroup" placeholder="请选择">
            <el-option v-for="item in  funcGroupOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
        </el-form-item>

        <el-form-item label="URL" prop="url">
          <el-input v-model="sysForm.url"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="sysForm.desc">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('sysForm')">确 定</el-button>
        <el-button v-else type="primary" @click="update('sysForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/auth/func'
import waves from '@/directive/waves/index.js' // 水波纹指令

const sysModelOptions = [
  { key: 'auth', display_name: '权限管理' },
  { key: 'basic', display_name: '基础数据' },
  { key: 'mall', display_name: '商城' },
  { key: 'wms', display_name: '进销存' },
  { key: 'tms', display_name: '配送' }
]

const funcGroupOptions = [
  { key: 'CN', display_name: '中国' },
  { key: 'US', display_name: '美国' },
  { key: 'JP', display_name: '日本' },
  { key: 'EU', display_name: '欧元区' }
]

export default {
  name: 'func',
  directives: {
    waves
  },
  data () {
    return {
      sysModelOptions,
      funcGroupOptions,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        code: undefined,
        name: undefined,
        sort: '+id'
      },
      sysForm: {
        id: undefined,
        sysModel: '',
        url: '',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      tableKey: 0,
      rules: {
        sysModel: [
          { required: true, message: '请选择系统模块', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入URL', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 150 个字符', trigger: 'blur' }
        ]
      }
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
    handleCreate () {
      this.resetSysForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.sysForm = Object.assign({}, row)
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
    create (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        } else {
          this.sysForm.id = parseInt(Math.random() * 100) + 1024
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    resetSysForm () {
      this.sysForm = {
        id: undefined,
        name: '',
        desc: ''
      }
    }
  }
}
</script>
