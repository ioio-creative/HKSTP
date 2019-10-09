import React, { useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { TweenMax, TimelineMax } from "gsap";
import { updateLanguage } from "../../reducers";

const ThreejsBg = props => {
  const canvasWrap = useRef(null);
  const dispatch = useDispatch();

  useEffect(
    () => {
      let scene, camera, renderer, dist, vFOV;
      let screenWidth, screenHeight;
      // let onWindowResize;
      const stats = new Stats();

      const instancedCount = 7;
      let offsetAttribute,
        planeOffsets = [];
      let planeWidth = 5,
        planeHeight = planeWidth * 0.75;

      // let clicked = false;

      const options = {
        planeSpeed: 0.05
      };

      const init = function() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, .1, 1000 );

        dist = camera.position.z = 10;
        vFOV = THREE.Math.degToRad(camera.fov);
        const screen = getScreenSize();
        console.log(screen);
        screenWidth = screen.width;
        screenHeight = screen.height;
        const controls = new OrbitControls(camera);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff, 0);
        //   renderer.shadowMap.enabled = true;
        //   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasWrap.current.appendChild(renderer.domElement);

        const gui = new dat.GUI({ width: 300 });
        gui
          .add(options, "planeSpeed")
          .min(0)
          .max(1)
          .listen();
        gui.domElement.parentNode.style.zIndex = 999;

        // stats
        stats.showPanel(0);
        stats.domElement.style.position = "fixed";
        stats.domElement.style.top = 0;
        document.body.appendChild(stats.domElement);

        initLight();
        initMesh();

        renderer.setAnimationLoop(function() {
          update();
          render();
        });
      };

      const getScreenSize = function() {
        if (vFOV) {
          var h = 2 * Math.tan(vFOV / 2) * dist;
          var w = h * camera.aspect;
        } else {
          var w = window.innerWidth;
          var h = window.innerHeight;
        }

        return { width: w, height: h };
      };

      const getRandomXY = bottomPos => {
        let x = Math.random() * screenWidth - screenWidth / 2;
        let y = bottomPos || Math.random() * screenHeight - screenHeight / 2;

        // avoid to overlap
        for (let o = 0; o < planeOffsets.length; o += 3) {
          const a = planeOffsets[o] - x;
          const b = planeOffsets[o + 1] - y;
          let planeDist = Math.sqrt(a * a + b * b);

          if (planeDist <= planeWidth * 1.1) {
            x = Math.random() * screenWidth - screenWidth / 2;
            if (!bottomPos) y = Math.random() * screenHeight - screenHeight / 2;
            else y -= 1;
            o = -3;
          }
        }
        return { x: x, y: y };
      };

      const initLight = () => {
        const ambientLight = new THREE.AmbientLight(0x999999);
        scene.add(ambientLight);
      };

      const initMesh = () => {
        initPlane();
      };

      const initPlane = () => {
        const bufferGeometry = new THREE.PlaneBufferGeometry(
          planeWidth,
          planeHeight,
          1
        );
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.maxInstancedCount = instancedCount;
        geometry.index = bufferGeometry.index;
        geometry.attributes.position = bufferGeometry.attributes.position;
        geometry.attributes.normal = bufferGeometry.attributes.normal;

        for (let i = 0; i < instancedCount; i++) {
          let { x, y } = getRandomXY();
          // let x = Math.random()*screenWidth-screenWidth/2;
          // let y = Math.random()*screenHeight-screenHeight/2;

          // avoid to overlap
          // for(let o=0; o<planeOffsets.length; o+=3){
          //     const a = x - planeOffsets[o];
          //     const b = y - planeOffsets[o+1];
          //     let planeDist = Math.sqrt(a*a + b*b);
          //     // console.log(o,planeDist);
          //     if(planeDist <= planeWidth*1.5){
          //         x = Math.random()*screenWidth-screenWidth/2;
          //         y = Math.random()*screenHeight-screenHeight/2;
          //         o = -3;
          //     }
          // }
          planeOffsets.push(x, y, 0);
        }

        offsetAttribute = new THREE.InstancedBufferAttribute(
          new Float32Array(planeOffsets),
          3
        );
        geometry.addAttribute("offset", offsetAttribute);

        var material = new THREE.MeshPhongMaterial({
          color: 0xf8f8f8,
          shininess: 100
        });
        material.onBeforeCompile = function(shader) {
          shader.vertexShader =
            "attribute vec3 offset;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            ["vec3 transformed = vec3(position + offset);"].join("\n")
          );
          // materialShader = shader;
        };

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
      };

      const start = Date.now();
      const draw = () => {
        const timer = (Date.now() - start) * 0.002;

        for (let i = 0; i < instancedCount; i++) {
          let x = planeOffsets[i * 3 + 0];
          let y = (planeOffsets[i * 3 + 1] += options.planeSpeed);
          if (y > screenHeight / 2 + planeHeight / 2) {
            let botPos = -screenHeight / 2 - planeHeight / 2;
            if (!props.clicked) {
              planeOffsets[i * 3 + 1] = botPos;
              const r = getRandomXY(botPos);
              x = r.x;
              y = r.y;
              planeOffsets[i * 3 + 0] = x;
              planeOffsets[i * 3 + 1] = y;
            } else {
              x = 0;
              y = botPos;
            }
          }
          offsetAttribute.setXY(i, x, y);
        }
        offsetAttribute.needsUpdate = true;
      };

      const update = () => {
        draw();
        camera.lookAt(0, 0, 0);
        stats.update();
      };

      const render = () => {
        renderer.render(scene, camera);
      };

      init();

      const onClick = () => {
        // if(!props.clicked){
        console.log(props);
        dispatch(updateLanguage("zh"));
        // const tl = new TimelineMax();
        // tl.to(options, 1, {planeSpeed: .5, ease:'Power3.easeInOut'});
        // tl.add(()=>{ props.dispatch(updateLanguage('zh'));  }, 1);
        // }
      };

      const onWindowResize = () => {
        // camera.left = -window.innerWidth / 2;
        // camera.right = window.innerWidth / 2;
        // camera.top = window.innerHeight / 2;
        // camera.bottom = -window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const screen = getScreenSize();
        screenWidth = screen.width;
        screenHeight = screen.height;
      };
      window.addEventListener("resize", onWindowResize);
      document.addEventListener("click", onClick);

      return () => {
        window.removeEventListener("resize", onWindowResize);
        document.removeEventListener("click", onClick);
      };
    },
    [canvasWrap]
  );

  return <div ref={canvasWrap} id="canvasWrap" />;
};

const mapStateToProps = state => {
  return {
    lang: state.lang,
    clicked: state.clicked
  };
};

export default connect(mapStateToProps)(ThreejsBg);
