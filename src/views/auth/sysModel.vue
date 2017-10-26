<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模块代码" v-model="listQuery.code">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模块名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="模块代码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="模块名称">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.name"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="350px" align="center" label="主页">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.homePage"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.homePage }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button :type="scope.row.edit?'success':'primary'" @click='handleUpdate(scope.row)' size="small" icon="edit">{{scope.row.edit?'完成':'编辑'}}</el-button>
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
        <el-form-item label="模块代码" prop="code">
          <el-input v-model="sysForm.code"></el-input>
        </el-form-item>

        <el-form-item label="模块名称" prop="name">
          <el-input v-model="sysForm.name"></el-input>
        </el-form-item>

        <el-form-item label="主页" prop="homePage">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="sysForm.homePage">
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
import { fetchList } from '@/api/auth/sysModel'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'sysModel',
  directives: {
    waves
  },
  data () {
    return {
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
        code: '',
        name: '',
        homePage: ''
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
        code: [
          { required: true, message: '请输入模块代码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        homePage: [
          { required: true, message: '请输入主页', trigger: 'blur' },
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
        const items = response.data.items
        this.list = items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
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
      row.edit = !row.edit
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
