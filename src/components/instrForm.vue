<template>
    <div class="instrForm">
        <el-table height="200px"
            :data="tableData"
            stripe
            style="width: 50%">
            <el-table-column
            prop="instruction"
            label="指令"
            width="150">
            </el-table-column>
            <el-table-column
            prop="address"
            label="地址"
            width="150">
            </el-table-column>
            <el-table-column
            prop="missPage"
            label="缺页"
            width="150">
            </el-table-column>
            <el-table-column
            prop="passPage"
            label="换出页">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: []
      }
    },
    methods :{
      addInstruction:function(inst,add,miss,pass){

        this.tableData.push({instruction:inst,address:add,missPage:miss,passPage:pass});

      }
    }
  }
</script>