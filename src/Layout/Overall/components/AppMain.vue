<template>
    <section class="app-main">
        <!-- <transition name="fade-transform" mode="out-in"> -->
            <router-view />
        <!-- </transition> -->
    </section>
</template>

<script>
    import { mapState } from 'vuex'
    import { xyTransformation } from '@/utils/methods'

    export default {
        name: 'AppMain',
        data() {
            return {
                client:null
            };
        },
        computed: {
            ...mapState('user',[
                'permissionVO',
            ]),
            ...mapState('equip',[
                'equipTypeMenu',
            ]),
            alarmFlag() {
                return this.$store.state.app.alarmFlag ;
            },
            projecPermissionList(){
                return this.permissionVO.projecPermissionList;
            },
        },
        created () {
            this.client = this.$mqtt.connect(`topic_warning`);
            this.$mqtt.listen(this.client,res=>{
                const { address, alertMsg, devName, fc, time, lng, lat, projectId, projectName } = res;

                //查询是否有该项目的权限, 决定是否弹出
                const HasProjectPermission  = this.projecPermissionList.some( item=> item.assetId == projectId );
                if( !HasProjectPermission ) return;
                console.log(res,'告警信息')

                xyTransformation([lng,lat]).then(result=>{
                    if(this.alarmFlag){
                        this.$notify({ 
                            duration: 30000,
                            title: '告警信息',
                            type: 'warning',
                            dangerouslyUseHTMLString: true,
                            message: `
                                <div class="noti">
                                    <div>设备名称 : <strong>${ devName }</strong></div>
                                    <div>设备类型 : <strong>${ this.getEquipType(fc) }</strong></div>
                                    <div>设备地址域 : <strong>${ address }</strong></div>
                                    <div>所属项目 : <strong>${ projectName || 'xxx' }</strong></div>
                                    <div>告警信息 : <strong class="red">${ alertMsg }</strong></div>
                                    ${result?`<div>经纬度 : <strong >${ result }</strong></div>`:''}
                                    <div>告警时间 : <strong>${this.$moment(time).format('YYYY-MM-DD HH:mm:ss')}</strong></div>
                                    <div class="tip">注 :点击查看详情</div>
                                </div>
                            `,
                            onClick:this.checkDetail.bind(this,res)
                        });
                    }
                    this.$store.dispatch('overall/saveAlarm',[
                        {
                            ...res,
                            equipType:this.getEquipType(fc),
                            position: result && result.join(',')
                        },
                        ...this.$store.state.overall.alarmBox
                    ])
                })
            });
        },
        destroyed () {
            this.client && this.client.end();
        },
        methods: {
            //查看告警详情
            checkDetail(item){
                const { warnInfoId  ,projectName , projectId } = item;
                sessionStorage.setItem('project',JSON.stringify({ id:projectId, name:projectName }));
                sessionStorage.setItem('obj',JSON.stringify({...item,id:warnInfoId}));
                this.$router.push({name:'AlarmDetail',params:{ warnInfoId }});
            },
            //获取设备类型
            getEquipType(fc){
                const { value } = this.equipTypeMenu.filter(item => item.id == fc)[0]
                return value;
            }
        },
    }
</script>

<style lang="scss">
    .app-main{
        padding-top:50px; 
        height: calc(100vh - 50px);
        background: #ecefef;
        overflow-y: auto;
    }
    .el-notification__group{
        cursor: pointer;
        .el-notification__title{
            font-size: 20px;
        }
        .noti{
            & > div{
                padding: 5px 0;
                font-size: 15px;
                text-align: left;
            }
            .red{
                color:red
            }
            .tip{
                font-size: 14px;
                font-weight: bolder;
            }
        }
        .el-notification__closeBtn {
            top: 15px;
            font-size: 22px;
        }
    }
</style>