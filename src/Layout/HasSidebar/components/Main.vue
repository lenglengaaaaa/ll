<template>
    <section class="apply_main">
        <div class="bar">
            <i :class="isCollapse?'el-icon-s-fold':'el-icon-s-unfold'" @click="toggleSideBar"/>
            <Breadcrumb />
        </div>
        <div class="main">
            <transition name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
    </section>
</template>

<script>
    import Breadcrumb from '@/components/Breadcrumb'
    import {xyTransformation} from '@/utils/methods'

    export default {
        components: {
            Breadcrumb,
        },
        data() {
            return {
                bread: [],
                flag:false,
                client:null
            }
        },
        created () {
            if(!sessionStorage.getItem('project'))return;
            this.client = this.$mqtt.connect(`topic_warning_${this.projectId}`);
            this.$mqtt.listen(this.client,res=>{
                console.log(res,'告警信息')
                const {address,alertMsg,devName,time,lng,lat,projectName} = res;
                xyTransformation([lng,lat]).then(result=>{
                    if(this.alarmFlag){
                        this.$notify({ 
                            duration: 30000,
                            title: '告警信息',
                            type: 'warning',
                            dangerouslyUseHTMLString: true,
                            message: `
                                <div class="noti">
                                    <div>设备名称 : <strong>${devName}</strong></div>
                                    <div>设备地址域 : <strong>${address}</strong></div>
                                    <div>所属项目 : <strong>${projectName || 'xxx'}</strong></div>
                                    <div>告警信息 : <strong class="red">${alertMsg}</strong></div>
                                    ${result?`<div>经纬度 : <strong >${result}</strong></div>`:''}
                                    <div>告警时间 : <strong>${moment(time).format('YYYY-MM-DD HH:mm:ss')}</strong></div>
                                    <div class="tip">注 :点击查看详情</div>
                                </div>
                            `,
                            onClick:this.checkDetail.bind(this,res)
                        });
                    }
                    this.$store.dispatch('app/saveAlarm',[
                        {
                            ...res,
                            position:result&&result.join(',')
                        },
                        ...this.$store.state.app.alarmBox
                    ])
                })
            })
        },
        mounted () {
            const screen = this.$store.state.app.device;
            this.fitScreen(screen)
        },
        destroyed () {
            this.client&&this.client.end();
        },
        watch: {
            '$store.state.app.device'(screen){
                this.fitScreen(screen)
            },
            '$store.state.app.sidebar.opened'(flag) {
                const type = this.$store.state.app.device;
                if(type ==='mobile')return;
                this.$('.apply_main').css({width:!flag?'calc(100% - 54px)':'calc(100% - 210px)'})
            },
            //暂时用于无权限监听关闭mqtt
            $route(to,from){
                if(to.redirectedFrom==='/senior'){
                    this.client&&this.client.end();
                }
            },
        },
        computed: {
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            alarmFlag() {
                return this.$store.state.app.alarmFlag ;
            }
        },
        methods: {
            checkDetail(item){
                const { warnInfoId  ,projectName , projectId } = item;
                sessionStorage.setItem('project',JSON.stringify({ id:projectId, name:projectName }));
                sessionStorage.setItem('obj',JSON.stringify({...item,id:warnInfoId}));
                this.$router.push({name:'AlarmDetail',params:{warnInfoId}});
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            fitScreen(screen){
                if(screen ==='mobile'){
                    this.$('.apply_main').css({width:''})
                } 
                if(screen ==='desktop'){
                    const fold = this.$store.state.app.sidebar.opened;
                    this.$('.apply_main').css({width:!fold?'calc(100% - 54px)':'calc(100% - 210px)'})
                }
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .apply_main{
            .bar{
                margin: 0 0 15px 0 !important;
            }
        }
    }
    .loadingMsg{
        margin-left: 20px;
    }
    .apply_main{
        width: 100%;
        // height: 100%;
        .bar{
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            height: 50px;
            margin: 15px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            .el-icon-s-fold,.el-icon-s-unfold{
                cursor: pointer;
                font-size: 20px;
            }
            .el-breadcrumb{
                padding-left: 10px;
            }
        }
        .main{
            padding:0 15px 15px;
            height: calc(100vh - 145px);
            overflow: auto;
        }
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
    }
    
</style>