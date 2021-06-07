<!--侧边条件筛选栏组件-->
<template>
  <div class="condition"><br>
    <div class="borders">
      <div>
        <div >置换算法</div><br>
        <el-select v-model="value_al" placeholder="请选择" size=small>
          <el-option
            v-for="item in options_al"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div><br>
      <div>
        <div>执行方式</div><br>
        <el-select v-model="value_ex"  placeholder="请选择" size=small >
          <el-option
            v-for="item in options_ex"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div><br>
    </div>
    <el-divider><i class="el-icon-time"></i></el-divider>

    <div class="borders">
      <div>总指令条数</div><br>
      <div>{{instructions}}条</div>
      <el-divider><i class="el-icon-collection-tag"></i></el-divider>
      <div>已执行指令条数</div><br>
      <div>{{ex_instructions}}条</div>
      <el-divider><i class="el-icon-collection-tag"></i></el-divider>
      <div>当前正在执行指令</div><br>
      <div>{{cur_instructions}}</div>
    </div>
    <el-divider><i class="el-icon-time"></i></el-divider>
    <div class="borders">
      <div>缺页次数</div><br>
      <div>{{missing_page}}</div>
      <el-divider><i class="el-icon-collection-tag"></i></el-divider>
      <div>缺页率</div><br>
      <div>{{missing_page_rate}}%</div>
    </div>
  </div>
</template>


<script>
  export default {
    name: "condition",
    data() {
      return {
        options_al: [{
          value: 'al_1',
          label: 'FIFO'
        }, {
          value: 'al_2',
          label: 'RLU'
        }],
        options_ex: [{
          value: 'ex_1',
          label: '顺序执行'
        }, {
          value: 'ex_2',
          label: '随机执行'
        },{
          value: 'ex_3',
          label: '混合执行'
        }],
        value_al: 'al_1',
        value_ex: 'ex_1',
        instructions:320,
        ex_instructions:0,
        cur_instructions:0,
        missing_page:0,
        missing_page_rate:0,
        nextInstruction:[],
        kind:[0,0,0]
      }
    },
    methods :{

      random:function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      addmissingPage:function(){
        this.missing_page++;
      },
      addexInstructions:function(){
        this.ex_instructions++;
      },
      computeMissingRate: function(){
        if(this.ex_instructions==0){
          this.missing_page_rate=0;
        }
        else{
          this.missing_page_rate=(this.missing_page/this.ex_instructions)*100;
        }
      },
      updatecurInstruction:function(instruction){
        let tmp=this.getNextInstruction(instruction);
        if(tmp==-1){
          console.log("指令执行结束了")
          return false;
        }
        this.cur_instructions=tmp;
        return true;
      },
      getNextInstruction:function(instr){
        
        this.nextInstruction[instr]=true;
        if(this.ex_instructions >= 320){
          return -1;
        }
        
        if(this.value_ex=='ex_1'){          
          return instr + 1;
        }
        else if(this.value_ex=='ex_2'){
          while(1){
            let i=this.random(0,320);
            if(this.nextInstruction[i]==false){
              return i;
            }
          }
        }
        else if(this.value_ex=='ex_3'){
          while(1){
            let i=this.random(0,3);
            console.log(i);
            if(i==0 && this.kind[0]<=80){
              if (instr==0){
                continue;
              }
              let ins = this.random(0,instr);
              this.kind[0]++;
              return ins;
            }
            else if(i==1 && this.kind[1]<=160){
              this.kind[1]++;
              let ins=(instr+1)%320;
              return ins;
            }
            else if(i==2 && this.kind[2]<=80){
              let ins=this.random(instr,320);
              this.kind[2]++;
              return ins;
            }
          }
        }
      },
      randInstruction:function(){
        for(let i=0;i<320;i++){

        }
      },
      initInstruction:function(){
        for(let i=0;i<320;i++){
          this.nextInstruction[i]=false;
        }
      }
    },
       
  mounted:function(){
    this.initInstruction();
  }
}
</script>

<style scoped>
.borders{
    border-width: 2px;
    border-radius: 4px;
    border-style: solid;
    border-color: rgb(167, 167, 175);
}

</style>