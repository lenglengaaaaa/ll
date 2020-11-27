 <template>
    <div id="container" @click="mouseClick" />
</template>

<script>
    import * as THREE from "three";
    import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
    import { CSS2DRenderer, CSS2DObject } from "three-css2drender";
    
    const OrbitControls = require("three-orbit-controls")(THREE);

    export default {
        name: "vue-three",
        data() {
            return {
                texts: {
                    code: "",
                    type: "",
                },
                dragTop: -100,
                dragLeft: -200,
                scene: "",
                light: "",
                camera: "",
                controls: "",
                renderer: "",
                selectObj: null
            };
        },
        methods: {
            //初始化three.js相关内容
            init() {
                this.scene = new THREE.Scene();
                // this.scene.background = new THREE.Color(0xf0f0f0);
                // this.scene.add(new THREE.AmbientLight(0x0000)); //环境光

                // // this.light = new THREE.DirectionalLight(0x1e90ff, 1); //从正上方（不是位置）照射过来的平行光，0.45的强度
                // this.light = new THREE.DirectionalLight(0xffffff, 1.0, 0); //设置平行光源
                // // this.light = new THREE.PointLight(0xffffff, 1) // 点光源
                // this.light.position.set(100, 200, 100);
                // this.light.position.multiplyScalar(0.3);
                // this.scene.add(this.light);

                // this.scene.add(new THREE.AmbientLight(0x444444));

                this.light = new THREE.DirectionalLight(0xffffff);
                this.light.position.set(0, 200, 100 );

                this.light.castShadow = true;
                this.light.shadow.camera.top = 180;
                this.light.shadow.camera.bottom = -100;
                this.light.shadow.camera.left = -120;
                this.light.shadow.camera.right = 120;

                //告诉平行光需要开启阴影投射
                // this.light.castShadow = true;

                this.scene.add(this.light);

                // 环境光
                // const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.3) // 环境光
                // this.scene.add(ambientLight)

                //坐标轴
                // var axisHelper = new THREE.AxisHelper(20); //参数是坐标轴的长度
                // this.scene.add(axisHelper);

                
                //初始化相机
                this.camera = new THREE.PerspectiveCamera(
                    45,
                    window.innerWidth / window.innerHeight,
                    1,
                    1000
                );
                this.camera.position.set(-60, 30, 45);
                this.camera.lookAt(this.scene.position);

                //渲染
                this.renderer = new THREE.WebGLRenderer({ alpha: true });
                // this.renderer.setClearColor(0x000000);
                this.renderer.setPixelRatio(window.devicePixelRatio); //为了兼容高清屏幕
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            
                const container = document.getElementById("container");
                container.appendChild(this.renderer.domElement);
                window.addEventListener("resize", this.onWindowResize, false); //添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
            },
            //窗口监听函数
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            animate() {
                this.controls.update();
                requestAnimationFrame(this.animate);
                this.render();
            },
            render() {
                this.renderer.render(this.scene, this.camera);
            },
            //外部模型加载函数
            loadObj() {
                let objLoader = new OBJLoader();
                let mtlLoader = new MTLLoader();
                let _this = this;
                //包含材质
                mtlLoader.setPath("/static/models/");
                mtlLoader.load("./static/models/bolt_06.mtl", (materials) => {
                    // 预加载
                    materials.preload();

                    // 设置当前加载的纹理
                    objLoader.setMaterials(materials);
                    // objLoader.setPath('./static/models/')
                    objLoader.load("./static/models/bolt_06.obj", (obj) => {
                        _this.oldChildren = _this.dealMeshMaterial(obj.children);
                        // obj.position.set(45, 0, 0); //模型摆放的位置
                        // obj.scale.set(0.01, 0.01, 0.01); //模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
                        this.scene.add(obj);

                    },this.onProgress);
                });
            },
            /*
            * 模型加载进程
            */
            onProgress (xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100
                    console.log(Math.round(percentComplete, 2) + '% downloaded')
                }
            },
            /**
             * 留住每个模型的原材质
             */
            dealMeshMaterial(arrs) {
                console.log(arrs,'arrs')
                let result = [];
                for (let i = 0; i < arrs.length; i++) {
                    let obj = {
                        name: arrs[i].name,
                        material: arrs[i].material,
                    };
                    result.push(obj);
                }
                return result;
            },
            /**
             * 初始化控制器
             */
            initControls() {
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);

                // // 拉近摄像头
                // this.controls.minDistance = 5;
                // this.controls.maxDistance = 600;
                // 垂直旋转
                this.controls.maxPolarAngle = Math.PI / 2;
                this.controls.minPolarAngle = Math.PI / 4;

                // 使动画循环使用时阻尼或自转 意思是否有惯性
                this.controls.enableDamping = true;
            
                this.controls.target.set(0, 5, 0);

                //是否可以缩放
                this.controls.enableZoom = true;
                //是否自动旋转
                this.controls.autoRotate = false;
                this.controls.autoRotateSpeed = 0.5;

                //设置相机距离原点的最远距离
                this.controls.minDistance = 1;
                //设置相机距离原点的最远距离
                this.controls.maxDistance = 2000;
                //是否开启右键拖拽
                this.controls.enablePan = true;

                this.controls.update();

            },

            //==========================点击事件===========================================
            /**
             * 点击事件
             */
            mouseClick(event) {
                // 还原之前的 点击状态
                this.restore(this.scene.children[2].children, this.oldChildren);
                // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
                let intersects = this.getIntersects(event);
                console.log('点击了对象：'+intersects);
                // 获取选中最近的 Mesh 对象
                if ( intersects.length != 0 && intersects[0].object instanceof THREE.Mesh ) {
                    let selectObject = intersects[0].object;
                    this.showObject(selectObject, event);
                }
            },
            /**点击事件，高亮的原理是之前先备份一份原材质，在点击之前先还原，最后通过new THREE.材质map 使用原来记录的材质map添加一个高亮颜色就可以了*/
            restore(arrsNew, arrsOld) {
                for (let i = 0; i < arrsNew.length; i++) {
                    for (let j = 0; j < arrsOld.length; j++) {
                        if (arrsNew[i].name === arrsOld[j].name) {
                            arrsNew[i].material = arrsOld[j].material;
                            break;
                        }
                    }
                }
            },
            /**
             * 展示点击内容
             */
            showObject(obj, event) {
                console.log(obj.name,'obj.name');


                // let key = obj.name;
                // let objs = this.cabinetData.filter((item) => {
                //     return item.code === key;
                // });
                // // 显示内容，高亮
                // if (objs.length > 0) {
                //     let oldOneMaterial = this.oldChildren.filter( (item) => item.name === key)[0];
                //     obj.material = new THREE.MeshPhongMaterial({
                //         color: 0xfff,
                //         map: oldOneMaterial.material.map,
                //     });
                //     // oldOneMaterial.material.visible = false;
                //     //obj.material.visible = false;
                //     this.texts = objs[0];
                //     // 处理坐标
                //     this.dragTop = event.clientY - 50;
                //     this.dragLeft = event.clientX - 100;
                // }else{
                //     this.init();
                // }
            },
            /**
             * 将屏幕坐标转换为3d 坐标
             */
            getIntersects(event) {
                var mainCanvas=event.path[0];
                event.preventDefault();
                var raycaster = new THREE.Raycaster();
                var mouse = new THREE.Vector2();
                // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left)/mainCanvas.offsetWidth) * 2 - 1;
                mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top)/mainCanvas.offsetHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, this.camera);
                var intersects = raycaster.intersectObjects(this.scene.children, true);
                return intersects;
            },

            //==========================点击时间===========================================
        },
        mounted() {
            this.init();
            this.initControls();
            this.loadObj();
            this.animate();
            window.addEventListener('mousemove', this.onDocumentMouseMove, false)
        },

    }
</script>

<style lang="scss" scoped>
    
    #container {
        width: 1200px;
        margin: 0 auto;
        height: 800px;
        overflow: hidden;
    }
    
    .text {
        position: absolute;
        font-size: 40px;
        color: #47fff8;
        left: 40px;
        bottom: 60px;
        cursor: pointer;
        animation: glow-animation 2s linear infinite alternate;
    }
    .moveText {
        position: absolute;
        padding: 10px;
        background: rgba(154, 200, 225, 0.3);  
    }
    @keyframes glow-animation {
        0% {
            font-size: 40px;
        }
        50% {
            font-size: 42px;
        }
        100% {
            font-size: 44px;
        }
    }

</style>