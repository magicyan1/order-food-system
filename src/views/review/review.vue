<template>
 <div class="review">
   <!-- 搜索区 -->
   <el-form
     ref="formInline"
     :model="formInline"
     class="demo-form-inline search-box"
     label-position:left>
     <el-row :gutter="20">
       <el-col :span="5">
         <el-form-item label="订单编号">
           <el-input v-model="formInline.orderNumber" placeholder="请输入" />
         </el-form-item>
       </el-col>
       <el-col :span="5">
         <el-form-item label="用户姓名">
           <el-input v-model="formInline.name" placeholder="请输入" />
         </el-form-item>
       </el-col>
       <el-col :span="5">
         <el-form-item label="用户评分">
           <el-select v-model="formInline.star" placeholder="全部">
             <el-option label="全部" value="" />
             <el-option label="1.0" value="1.0" />
             <el-option label="2.0" value="2.0" />
             <el-option label="3.0" value="3.0" />
             <el-option label="4.0" value="4.0" />
             <el-option label="5.0" value="5.0" />
           </el-select>
         </el-form-item>
       </el-col>
       <el-col :span="9">
         <el-form-item label="评价时间">
           <el-date-picker
             v-model="startDate"
             type="date"
             placeholder="年/月/日"
           />
           <span style="margin: 0 20px">-</span>
           <el-date-picker
             v-model="endDate"
             type="date"
             placeholder="年/月/日"
           />
         </el-form-item>
       </el-col>
     </el-row>
     <el-row :gutter="20">
       <el-col :span="5">
         <el-form-item label="评价内容">
           <el-input v-model="formInline.comment" placeholder="请输入" />
         </el-form-item>
       </el-col>
       <el-col :span="5">
         <div class="flex">
           <el-button type="button">搜索</el-button>
           <el-button type="button">重置</el-button>
         </div>
       </el-col>
       <el-col :span="9">
       </el-col>
     </el-row>
     <el-row :gutter="20">
       <el-col :span="5">
         <div class="flex">
           <el-button type="button">导出</el-button>
           <el-button type="button">批量处理</el-button>
         </div>
       </el-col>
     </el-row>
   </el-form>
   <!--table区域-->
   <el-table :data="data.tableData">
     <el-table-column prop="orderNumber" label="订单编号"  />
     <el-table-column prop="name" label="用户姓名"/>
     <el-table-column prop="star" label="评分"/>
     <el-table-column prop="comment" label="评价内容"/>
     <el-table-column prop="date" label="评价时间"/>
     <el-table-column fixed="right" label="操作">
       <template #default="scope">
         <el-button link type="primary" size="small" @click="handleClick(scope)"
         >查看</el-button
         >
         <el-button link type="primary" size="small">删除</el-button>
       </template>
     </el-table-column>
   </el-table>


   <el-pagination
     :page-sizes="[1, 5, 10]"
     :small="small"
     :disabled="disabled"
     :background="background"
     layout="total, sizes, prev, pager, next, jumper"
     :total=total
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
   />
<!-- 查看详情  -->
   <el-dialog
     v-model="centerDialogVisible"
     title="用户评论"
     width="30%"
     align-center
   >
    <div class="detail-box">
     <div v-if="data.lookDetail.name">
       <div class="userinfo">
         <div>{{data.lookDetail.name}}</div>
       </div>
       <img src="{{data.lookDetail.imge}}" alt="">
       <div>
         <div>第一次评论</div>
         <div>{{data.lookDetail.comment}}</div>
       </div>
     </div>
      <div v-else>
        用户还未追评
      </div>
    </div>

     <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">
          确定
        </el-button>
      </span>
     </template>
   </el-dialog>
 </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {
  addReview,
  lookSelectView,
  lookReview,
  lookAllReview
} from '../../apis/review/review.js'

// 响应
const data = reactive({
  tableData:[],
  lookDetail:[]
})
const lookId = ref('')
const newTime = ref('')

// 查看详情模态框
const centerDialogVisible = ref(false)


// 输入筛选区
const formInline = reactive({
  "comment": "",
  "endDate": "",
  "name": "",
  "orderNumber": "",
  "star": 0,
  "startDate": ""
})
console.log('formInline',formInline)




// 查看
const handleClick = (scope) => {
  lookId.value = scope.row.id
  centerDialogVisible.value=true
  lookDialog()
}


onMounted(() => {
  init()
})
// 分页区
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total = ref(0)
const limit = reactive(
  {limit:5,page:1}
)


const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  limit.limit = val
  console.log(limit.limit)
  init()
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  limit.page = val
  init()
}



// 功能函数
// 查看
async function lookDialog(){
  const res = await lookReview({orderNumber:lookId.value})
  data.lookDetail = res.data.data.list;
}
// 条件查询
async function lookSelectView(){
  const res = await lookSelectView({
    "comment": "",
    "endDate": "",
    "name": "",
    "orderNumber": "",
    "star": '',
    "startDate": ""
  })
  data.tableData = res.data.data.list;
}
// 回复
async  function add(){
  const res = await addReview({
    "comment": "",
    "date": "",
    "id": '',
    "imge": "",
    "name": "",
    "orderNumber": "",
    "userCommentId": ''
  })
  /*data.tableData = res.data.data.warnings;*/
}

// 初始化渲染
async function init(){
  const res = await lookAllReview(limit.page,limit.limit)
  data.tableData = res.data.data.list;
  total.value = res.data.data.count
}
</script>

<style lang="less" scoped>
.review {
  margin: 40px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
/deep/.el-input {
  width: 200px;
}
.el-table {
  margin:40px 0;
  padding: 20px;
}
.detail-box {
  .userinfo {
    display: flex;
    justify-content: space-between;
  }
  padding: 0 30px;
}
.search-box {
  background-color: #fff;
  padding: 20px;
}

</style>