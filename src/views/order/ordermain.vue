<template>
  <div class="nextbox">
    <h5>订单详情/<text>订单编号:268072002079876423</text></h5>
    <div class="nexttiao">
      <el-steps :active="active" finish-status="success">
        <el-step title="下单，代付款" :description="'下单时间：' + a" />
        <el-step title="已收款，待发货" :description="'付款时间：' + a" />
        <el-step title="已发货，待收货" :description="'发货时间：' + a" />
        <el-step title="已完成订单" :description="'确认收货时间：' + a" />
      </el-steps>

      <el-button style="margin-top: 12px" @click="next">Next step</el-button>
    </div>
  </div>
  <div class="statuscontent">
    <h5>订单状态:<text>已完成</text></h5>
    <div class="contentbox">
      <div>
        <p>买家：张三的id</p>
        <p>收货地址：广东省 广州市 天河区 和北林3路 河里小区 2栋 301</p>
        <p>手机号：135****0001</p>
        <p>留言：请尽快发货</p>
      </div>
      <div>
        <p>付款方式：支付宝</p>
        <p>支付总额：24.5</p>
        <p>运费总额：8</p>
        <p>实付金额：24.5</p>
      </div>
    </div>
  </div>
  <div class="tablebox">
    <table>
      <tr>
        <th>商品信息</th>
        <th>单价</th>
        <th>数量</th>
        <th>订单小计</th>
        <th>优惠金额</th>
        <th>实付款</th>
      </tr>
      <tr>
        <td>订单编号:268072002079876423</td>
        <td>￥25.00</td>
        <td>1</td>
        <td>￥25.00</td>
        <td>0.5</td>
        <td>￥24.50</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const a = ref("2022-6-5 10:59:01");

const active = ref(0);

const next = () => {
  if (active.value++ > 3) active.value = 0;
};
</script>
<style scoped lang="less">
.nextbox {
  background-color: white;
  padding: 10px 20px;
  width: 94%;
  margin: 0 auto;
  margin-top: 10px;
  h5 {
    padding: 20px 0;
    border-bottom: 1px solid rgb(216, 213, 213);
    text {
      color: blue;
    }
  }
  .nexttiao {
    margin-top: 20px;
  }
}
.statuscontent {
  background-color: white;
  width: 94%;
  margin: 0 auto;
  margin-top: 10px;
  padding: 10px 20px;
  h5 {
    padding: 20px 0;
    text {
      color: blue;
      font-size: 17px;
    }
  }
  .contentbox {
    display: flex;
    justify-content: space-around;
    div {
      width: 50%;
    }
    div:nth-child(2) {
      border-left: 1px dashed black;
      padding-left: 40px;
    }
    p {
      padding: 10px 20px;
    }
  }
}
.tablebox {
  background-color: white;
  width: 94%;
  margin: 0 auto;
  margin-top: 10px;
  padding: 10px 20px;
  table {
    text-align: left;
    width: 100%;
    th {
      padding: 20px 0;
      border-bottom: 1px dashed black;
    }
    td {
      padding: 10px 20px 10px 0;
    }
  }
}
</style>
