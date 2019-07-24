<template>
    <div class="EQUIP_CONTAINER">
        <!-- <div class="info">
            <el-popover
                placement="right-start"
                ref="popover4"
                title="标题"
                width="200"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            >
            </el-popover>
            <i class="el-icon-info" v-popover:popover4></i>
        </div> -->
        <div class="magic" v-if="hasMagic"> 
            <div class="title">
                <span>魔节环境数据</span>
                <el-divider></el-divider>
                <p>
                    <span>更新时间:</span>
                    <strong>2019-07-04 14:42:20</strong>
                </p>
            </div>
            <div class="content">
                <div class="wrap">
                    <Magic></Magic>
                </div>
            </div>
        </div>
        <div class="line" v-if="hasLine">
            <div class="title">
                <span>线缆温度传感器</span>
                <el-divider></el-divider>
                <div class="content">
                    <div class="wrap">
                        <Tline></Tline>
                    </div>
                </div>
            </div>
        </div>
        <div class="lone" v-if="hasLone">
            <div class="title">
                <span>独立传感器</span>
                <el-divider></el-divider>
            </div>
            <div class="content">
                <div class="wrap"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import Magic from './components/Magic'
    import Tline from './components/Tline'

    export default {
        components: {
            Magic,
            Tline
        },
        props: {
            hasMagic: {
                type: Boolean,
                default: true
            },
            hasLine: {
                type: Boolean,
                default: true
            },
            hasLone: {
                type: Boolean,
                default: true
            },
        },
        created () {
            const result =JSON.parse(sessionStorage.getItem("obj"));
        },
        data() {
            return {
                
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .EQUIP_CONTAINER{
            .seletGroup{
                flex-direction: column;
                .el-form{
                    flex-direction: column;
                }
            }
        }
    }

    .EQUIP_CONTAINER{
        position: relative;
        .info{
            z-index: 1000;
            position: absolute;
            right: 10px;
            top: 25px;
            i{
                cursor: pointer;
            }
        }
        .title{
            padding: 20px 0 10px 0;
            >span{
                font-size: 20px;
                font-weight: bold;
                padding: 0 10px;
                border: 0 solid #e4e6eb;
                border-left-width: 5px;
                border-radius: 5px;
                border-left-color: #36a9e1;
            }
            .el-divider--horizontal{
                margin: 10px 0;
            }
            p{
                margin:15px 0;
                display: flex;
                align-items: center;
                span,strong{
                    font-size: 15px;
                }
            }
        }
        .content{
            display: flex;
            justify-content: center;
            .wrap{
                width: 95%;
                background: #fff;
                padding: 20px;
                box-shadow: 0 1px 1px rgba(189, 195, 199, 0.8);
                border-radius: 5px;
                .seletGroup{
                    padding-bottom: 20px;
                    display: flex;
                    // justify-content: space-between;
                    align-items: center;
                    .el-form{
                        width: 100%;
                        display: flex;
                        .el-form-item{
                            padding: 0 10px;
                        }
                    }
                    .icon{
                        margin: 20px 0 0 10px;
                        i{
                            cursor: pointer;
                            background: #ecefef;
                            padding: 5px;
                            border-radius: 5px;
                        }
                    }
                }
            }
        }
    }
</style>