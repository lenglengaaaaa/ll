<template>
    <!-- <el-row :gutter="15" type="flex"> -->
        <!-- <el-col :span="8" v-for="item in rows" :key="item.icon" :xs="24"> -->
            <div class="COUNT_WRAP">
                <div class="grid-content" v-for="item in rows" :key="item.icon" @click="rowClick(item.path)">
                    <div class="card-panel">
                        <div>
                            <div :class="iconClass(item.className)">
                                <svg-icon 
                                    :iconClass="item.icon" 
                                    className="icon"
                                />
                            </div>
                        </div>
                        <div>
                            <span class="name">{{item.name}}</span>
                            <span>
                                <span :style="{color:'#008000'}">{{item.has}}</span>/
                                <span :style="{fontSize:'1.2rem'}">{{item.total}}</span>
                            </span>
                        </div>
                    </div>
                    <div class="progress">
                        <el-progress :percentage="item.has/item.total*100" :show-text="false"></el-progress>
                    </div>
                </div>
            </div>
        <!-- </el-col> -->
    <!-- </el-row> -->
</template>

<script>
    import { mapActions } from 'vuex'
    
    export default {
        data() {
            return {
                rows: [
                    {
                        name:"项目",
                        icon:'project',
                        path:'/project',
                        className:'icon-project',
                        total:0,
                        has:0,
                    },
                    {
                        name:'设备',
                        icon:'equip',
                        path:'/project',
                        className:'icon-equip',
                        total:0,
                        has:0
                    },
                    {
                        name:'网关',
                        icon:'gateway',
                        path:'/gateway',
                        className:'icon-gateway',
                        total:0,
                        has:0
                    }
                ]
            }
        },
        mounted () {
            this.initiate()
        },
        methods:{
            ...mapActions('overall',[
                'getOnlineDevice',
                'getLiveProject'
            ]),
            initiate(){
                Promise.all([this.getLiveProject(),this.getOnlineDevice()]).then(res=>{
                    res.map((item,index)=>{
                        if(!item)return;
                        this.$set(this.rows[index], 'total', item.sum );
                        this.$set(this.rows[index], 'has', index==0? item.normal:item.online );
                    })
                })
            },
            rowClick(path){
                this.$router.push(path)
            },
            iconClass(className) {
                return `card-panel-icon-wrapper ${className}`
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .el-row{
                flex-direction: column;
                .icon {
                    width: 4.5em !important;
                    height: 4.5em !important;
                }
        }
    }
    .COUNT_WRAP{
        height: inherit;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .el-row {
        flex-direction: column;
        height: 100%;
        .grid-content {
                &:nth-child(2){
                    margin: 10px 0;
                }
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding:10px;
                padding-top: 20px;
                height: 100%;
                background: #fff;
                cursor: pointer;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                border-radius: 5px;
                .card-panel{
                    display: flex;
                    .card-panel-icon-wrapper{
                        padding:16px;
                        border-radius: 6px;
                    }
                    div{
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        align-items: center;
                        justify-content: center;
                        .icon {
                            width: 4.6875vw;
                            height: 4.6875vw;
                        }
                        .name{
                            font-size: 1.2rem;
                            font-weight: bold;
                        }
                        span{
                            padding: 15px 0;
                        }
                    }
                    .icon-gateway{
                        color: #f4516c;
                    }
                    .icon-project{
                        color:#36a3f7;
                    }
                    .icon-equip{
                        color: #34bfa3;
                    }
                }
                .progress{
                    padding: 20px;
                    margin-top: 10px;
                }
                &:hover{
                    .card-panel-icon-wrapper{
                        color:#fff;
                    }
                    .icon-gateway{
                        background: #f4516c;
                    }
                    .icon-project{
                        background:#36a3f7;
                    }
                    .icon-equip{
                        background: #34bfa3;
                    }
                }
            }
    }
</style>