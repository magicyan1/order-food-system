<template>
  <div class="listbox">
    <div class="listul">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first"> </el-tab-pane>
        <el-tab-pane label="待支付" name="second"></el-tab-pane>
        <el-tab-pane label="支付中" name="third"></el-tab-pane>
        <el-tab-pane label="制作中" name="fourth"></el-tab-pane>
        <el-tab-pane label="已完成" name="fifth"></el-tab-pane>
        <el-tab-pane label="已失效" name="sixth"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tablebox">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="下单时间" width="180">
          <template #default="scope">{{
            new Date(scope.row.orderStatusTime).toLocaleString()
          }}</template>
        </el-table-column>
        <el-table-column property="orderNumber" label="下单客户编号" />
        <el-table-column property="finalPrice" label="总价" />
        <el-table-column property="discount" label="份数" />
        <el-table-column property="payment" label="支付方式" />
        <el-table-column property="remarks" label="备注" />
        <el-table-column label="订单状态" property="name">
          <template #default="scope">
            <el-tag type="Home" disable-transitions>{{
              scope.row.orderStatus
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button link type="primary" size="small">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElTable } from "element-plus";
import type { TabsPaneContext } from "element-plus";
import http from "../../utils/http.js";

const charge1 = () => {
  console.log(1111111);
};
const formInline = reactive({
  user: "",
  region: "",
  username: "",
  region1: "",
  date1: "",
});
interface User {
  remarks: string;
  finalPrice: string;
  discount: string;
  orderStatusTime: string;
  payment: string;
}
// const tableData = ref<User>({
//   remarks: "",
//   finalPrice: "",
//   discount: "",
//   orderStatusTime: "",
//   goodsName: "",
//   payment: "",
//   goodsDetails: "",
// });
const tableData = ref([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

const onSubmit = () => {
  console.log("submit!");
};

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.props.name == "first") {
    http({
      url: "/order/shop/shop/list",
      method: "get",
    }).then((res) => {
      tableData.value = res.data.data.order_shop;
    });
  } else if (tab.props.name == "fourth") {
    http({
      url: "/order/shop/shop/status",
      method: "get",
      params: {
        orderStatus: "制作中",
      },
    }).then((res) => {
      tableData.value = res.data.data;
    });
  } else if (tab.props.name == "second") {
    http({
      url: "/order/shop/shop/status",
      method: "get",
      params: {
        orderStatus: "待支付",
      },
    }).then((res) => {
      tableData.value = res.data.data;
    });
  } else if (tab.props.name == "third") {
    http({
      url: "/order/shop/shop/status",
      method: "get",
      params: {
        orderStatus: "支付中",
      },
    }).then((res) => {
      tableData.value = res.data.data;
    });
  } else if (tab.props.name == "sixth") {
    http({
      url: "/order/shop/shop/status",
      method: "get",
      params: {
        orderStatus: "已失效",
      },
    }).then((res) => {
      tableData.value = res.data.data;
    });
  } else {
    http({
      url: "/order/shop/shop/status",
      method: "get",
      params: {
        orderStatus: "已完成",
      },
    }).then((res) => {
      tableData.value = res.data.data;
    });
  }
};

const listtotal = ref({
  goodsName: "",
  goodsDetails: "",
});
//获取数据
onMounted(() => {
  http({
    url: "/order/shop/shop/list",
    method: "get",
  }).then((res) => {
    tableData.value = res.data.data.order_shop;
  });
});
//
const pay = [];
const listhh = [1, 2, 3, [1, 2, 3, 4], 12, 3];
</script>

<style scoped lang="less">
// 表格
.listbox {
  background-color: white;
  margin: 0 auto;
  width: 92%;
  margin-top: 10px;
  padding: 20px;
  .el-pagination {
    text-align: center;
    width: 50%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .tablebox {
    margin-top: 40px;
  }
}
</style>
