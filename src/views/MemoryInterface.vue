<!-- 内存管理项目的主界面 -->
<template>
    <div class="MemoryInterface">       
        <el-container>
            <el-aside width="220px"><Condition ref="condition"></Condition></el-aside>
            <el-main>
                <MemoryBlock class="blockflex" ref="memoryBlock"></MemoryBlock>
                <InstrForm class="formflex" align="center" ref="instrForm"></InstrForm>
                <el-button type="primary" @click="executeInstruction" round ><i class="el-icon-edit"></i>单步执行</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" @click="click_multiple" round><i class="el-icon-edit"></i>多步执行</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" @click="reload" round><i class="el-icon-refresh"></i>刷新</el-button>
            </el-main>                
        </el-container>        
    </div>    
</template>

<script>
import Condition from '@/components/condition.vue'
import MemoryBlock from '@/components/memoryBlock.vue'
import InstrForm from '@/components/instrForm.vue'
export default {
    name: 'MemoryInterface',
    components:{
        Condition,
        MemoryBlock,
        InstrForm
    },
    data(){
        return{
            sequence:[{index:'al_1',value:[]},{index:'al_2',value:[]}],
            OK:false,
        }
    },
    methods:{
        setTimer: function () {
　　　　    this.timer = setInterval(this.executeInstruction, 100);
        },
        click_multiple:function(){
            this.setTimer();
        }, 
        reload:function(){
            this.$router.go(0);
        },   
        executeInstruction:function(){   //执行指令函数;
            
            if(this.OK==true){
                return;
            }
            
            let instrID=this.$refs.condition.cur_instructions;
            let page=this.$refs.memoryBlock.page;
            let curPage= Math.floor(instrID / 10);
            let miss=false;            //当前指令所在页;
            let missFlag=[-1,-1];  //前者表示物理块，后者表示换出页;
            missFlag=this.missingThePage(curPage,page);    //判断当前指令是否导致缺页;
            if(missFlag[0] < 0){
                missFlag = this.replacePage(curPage,page);         //换页操作函数;
                miss=true;
            }
            this.updateSequence(missFlag[0]);  //更新替换算法的序列;
            //执行;
            this.execute(instrID,missFlag[0]);
            //添加执行表格信息;
            this.addRecord(instrID,miss,missFlag);
            //更新已执行指令条数;当前正要执行指令，缺页次数，缺页率;
            this.updateCondition(miss,instrID);

        },
        missingThePage:function(curPage,page){
            
            for(let i=0;i<page.length;i++){
                if(page[i].value==curPage){
                    return [i,-1];
                }
            }
            return [-1,-1];
        },
        replacePage:function(curPage,page){      //如果当前存在某一个内存块没有加载页，则加载此页， 反之则采用替换算法进行替换操作。
          
          let p=[-1,-1];
          for(let i=0;i<page.length;i++){
                if(page[i].flag==false){  
                    this.$refs.memoryBlock.loadingPage(i,curPage)
                    return [i,-1];
                }
            }
            //当前不存在内存块未加载页的情况，需要进行替换页操作; 
            let idea_al= this.$refs.condition.value_al; //换页算法;
            for(let i=0;i<this.sequence.length;i++){
                if(this.sequence[i].index==idea_al){

                    p = this.replacement(curPage,this.sequence[i].value);  //返回值是新替换页的内存块号
                    this.sequence[i].value[0]=-1;
                    return p;
                }
            }
            
        },
        replacement:function(curPage,seq){
            let firstPage=seq[0];
            let cur=this.$refs.memoryBlock.page[firstPage].value;
            this.$refs.memoryBlock.loadingPage(firstPage,curPage);
            return [firstPage,cur];
        },
        FIFO:function(page){
            let seq=this.sequence[0].value;
            let flag=0;
            for(let i=0;i<seq.length;i++){
                if(seq[i]==page){
                    flag=1;
                    break;
                }
            }
            if(flag==0){
                if(seq.length<4){
                    seq.push(page);
                }
                else{                   
                    seq.splice(0,1);
                    seq.push(page);
                }
            }
            this.sequence[0].value=seq;
        },
        LRU:function(page){
            let seq=this.sequence[1].value;
            let flag=0;
            for(let i=0;i<seq.length;i++){
                if(seq[i]==page){
                    flag=1;
                    seq.splice(i,1);
                    seq.push(page);
                    break;
                }
            }
            if(flag==0){
                if(seq.length<4){
                    seq.push(page);
                }
                else{
                    seq.splice(0,1);
                    seq.push(page);
                }
            }
            this.sequence[1].value=seq;
        },
        updateSequence:function(page){
            this.FIFO(page);
            this.LRU(page);
        },
        addRecord:function(instruction,miss,flag){
            let deviation=instruction%10;
            let add=flag[0]*10+deviation;
            let m='false';
            if(miss==true){
                m='true';
            }           
            this.$refs.instrForm.addInstruction(instruction,add,m,flag[1]);
        },
        updateCondition:function(miss,instruction){
            if(miss==true){
                this.$refs.condition.addmissingPage();
            }
            this.$refs.condition.addexInstructions();
            this.$refs.condition.computeMissingRate();
            //更新即将执行指令;
            let flag = this.$refs.condition.updatecurInstruction(instruction);
            if(flag==false){
                this.$notify({
                    title: '成功',
                    message: '指令已经成功执行完成！',
                    type: 'success'
                });
                this.OK=true;
                clearInterval(this.timer);
            }
        },
        execute:function(instr,ipage){
            if(this.OK!=true){
                this.$refs.memoryBlock.setColor(instr,ipage);
            }

        }
    },
}
</script>
<style scoped>
.header{
    background-color:#DCDFE6   
}
.aside{
    background-color:#616366
}
.blockflex{
    margin-right:20px;
}
.formflex{

    display:block;
    margin-top: 20px;
    margin-bottom: 20px;
}
.buttonflex{
    display:block;
    margin-top:40px;
    margin-right:20px;
}
</style>
