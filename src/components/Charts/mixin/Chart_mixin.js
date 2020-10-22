
export default {
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        window.addEventListener('resize',this.$_handleResizeChart);
        this.$once('hook:beforeDestroy', () => {
            window.removeEventListener('resize',this.$_handleResizeChart)
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        })
    },
    watch: {
        "$store.state.app.sidebar.opened"() {
            this.chart&&this.chart.resize();
        },
        "$store.state.app.tab_index"(label) {
            const should_resize = ["魔戒总览","数据视图","RFID总览"];
            if(should_resize.includes(label)){
                this.chart && this.chart.resize();
            }
        }
    },
    methods: {
        $_handleResizeChart(){
            this.chart && this.chart.resize()
        },
    }
}