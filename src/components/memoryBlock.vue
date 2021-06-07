<template>
    <div class="memoryBlock">
        <div class="borders" >
            <div v-for="(card,i) in page" :key="i" class="block">
                <el-card class="box-card" > 
                    <div slot="header" class="clearfix">
                        <i class="el-icon-box"></i><br>
                        <span>page</span>
                        <span v-if ="card.flag">
                            {{card.value}}
                        </span>                                          
                    </div>
                    <div v-if="card.flag">
                        <div v-for="(o,index) in 10"  :key="index" ref="nodes"
                            class="text item" >
                            {{ card.value*10+o-1 }}                           
                        </div>
                    </div>                 
                </el-card>
            </div>    
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            page:[
                {value:-1, flag:false, id:0},
                {value:-1, flag:false, id:1},
                {value:-1, flag:false, id:2},
                {value:-1, flag:false, id:3}],
            color:[],
        }
    },
    methods :{
        loadingPage:function(cur,Page){
            this.page[cur].value=Page;
            this.page[cur].flag=true;
        },
        initColor:function(){
            for(let i=0;i<320;i++){
                this.color.push(false);
            }
        },
        setColor:function(instr,ipage){ 

           let d=instr%10;
           let add=ipage*10+d;
           let list=this.$refs.nodes;
           if(list && list[add]){
                console.log(list[add])
                list[add].style.backgroundColor="rgb(247, 118, 12)"
                setTimeout(()=>{list[add].style.backgroundColor='rgb(158, 235, 218)';},1000);
           }
        },
    },
}
</script>


<style scoped>
.borders{

    border-width: 3px;
    border-radius: 4px;
    border-style: solid;
    border-color: rgb(167, 167, 175);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.text {
    font-size: 12px;
  }

.item {
margin-bottom: 1px;
margin-left:5px;
margin-right:5px;
background-color: rgb(158, 235, 218);
border-color: rgb(167, 167, 175);
box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
border-width:2px;
border-radius: 4px;
border-style: solid;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both
}
.block{
    display: inline-flex;
    margin-top: 15px;
    margin-right:20px;
    margin-bottom: 15px;
}
.box-card {
width: 250px;
}
</style>