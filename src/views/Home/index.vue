<template>
    <div class="wrap">
        <!-- <div>

        </div> -->
        <MapChart
            :value="result"
        />
        <div class="btn">
            <el-button 
                type="primary"
                plain
                @click="skip"
            >
                项目列表
            </el-button>
        </div>
    </div>
</template>

<script>
    import { MapChart } from '@/components/Charts'
    import { mapActions } from 'vuex'


    export default {
        components:{
            MapChart
        },
        data(){
            return{
                result:[]
            }
        },
        mounted () {
            this.getList();
        },
        methods:{
            ...mapActions('overall',[
                'getProjectList', 
            ]),
            // 获取项目列表
            getList(){
                return this.getProjectList({
                    size:100,    
                    current:1 ,   
                }).then(res=>{
                    if(!res)return;
                    const { data } = res;

                    this.result = data;

                    // const result = data.reduce((pre,cur)=>{
                    //     pre.push({
                    //         name: cur.name,
                    //         value:[ cur.longitude, cur.latitude , 50]
                    //     })
                    //     return pre;
                    // },[])

                    // this.result = result;
                })
            },
            skip(){
                this.$router.push({ name:"Project" });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap{
        height: 100vh;
        position: relative;
        .btn{
            position: absolute;
            top: 20px;
            right: 30px;
        }
    }
</style>