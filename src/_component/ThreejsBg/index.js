import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { TweenMax, TimelineMax } from "gsap";
import { updateIsStarted } from "../../reducers";

const ThreejsBg = props => {
  const canvasWrap = useRef(null);
  const controls = useRef(null);


  useEffect(() => {
    let scene, camera, renderer, dist, vFOV;
    let screenWidth, screenHeight;
    // let onWindowResize;
    const stats = new Stats();

    const instancedCount = 5;
    let offsetAttribute;
    let planeWidth = 10,
        planeHeight = planeWidth * 0.75;
    const planeOffsets = [],
        planeSpeed = [];
    let clicked = false,
        started = false;

    let logo;

    const options = {
      planeSpeed: 0.001
    };

    const init = function() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
      // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, .1, 1000 );

      dist = camera.position.z = 60;
      vFOV = THREE.Math.degToRad(camera.fov);
      const screen = getScreenSize();
      console.log(screen);
      screenWidth = screen.width;
      screenHeight = screen.height;
      // new OrbitControls(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 0);
      canvasWrap.current.appendChild(renderer.domElement);

      const gui = new dat.GUI({ width: 300 });
      gui.add(options, "planeSpeed").min(0).max(1).listen();
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

      TweenMax.to(options, .6, {planeSpeed: .1, ease:'Power3.easeInOut'});
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
      let x = Math.random() * (screenWidth + planeWidth) - screenWidth/2 - planeWidth/2;
      let y = bottomPos || Math.random() * screenHeight - screenHeight/2;

      // avoid to overlap
      for (let o = 0; o < planeOffsets.length; o += 3) {
        const a = planeOffsets[o] - x;
        const b = planeOffsets[o + 1] - y;
        let planeDist = Math.sqrt(a * a + b * b);

        if (planeDist <= planeWidth * 1.1) {
          x = Math.random() * (screenWidth + planeWidth) - screenWidth / 2- planeWidth/2;
          if (!bottomPos) y = Math.random() * screenHeight - screenHeight / 2;
          else y -= 1;
          o = -3;
        }
      }
      return { x: x, y: y };
    };

    const initLight = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    };

    const initMesh = () => {
      initPlane();
      initLogo();
    };

    const initLogo = () => {
      const bigBallSize = 4;
      const smallBallSize = 2.5;
      const ballDist = 15;
      const cylinderHeight = ballDist * .8;

      const material = new THREE.MeshBasicMaterial({ color: 0xe9e9e9, wireframe:false, depthTest:false });
      
      const topShpereGeometry = new THREE.SphereGeometry(smallBallSize, 16, 16);
      const topShpere = new THREE.Mesh(topShpereGeometry, material);
      topShpere.position.set(0, ballDist*Math.sin(45*Math.PI/180), ballDist*Math.cos(45*Math.PI/180));
      
      const botShpereGeometry = new THREE.SphereGeometry(smallBallSize, 16, 16);
      const botShpere = new THREE.Mesh(botShpereGeometry, material);
      botShpere.position.set(0, ballDist*Math.sin(-45*Math.PI/180), ballDist*Math.cos(-45*Math.PI/180));

      const leftShpereGeometry = new THREE.SphereGeometry(smallBallSize, 16, 16);
      const leftShpere = new THREE.Mesh(leftShpereGeometry, material);
      leftShpere.position.set(-ballDist*Math.sin(45*Math.PI/180), 0, -ballDist*Math.cos(45*Math.PI/180));

      const rightShpereGeometry = new THREE.SphereGeometry(smallBallSize, 16, 16);
      const rightShpere = new THREE.Mesh(rightShpereGeometry, material);
      rightShpere.position.set(-ballDist*Math.sin(-45*Math.PI/180), 0, -ballDist*Math.cos(-45*Math.PI/180));

      // cone
      const topCylinderGeometry = new THREE.CylinderGeometry(smallBallSize*.1, smallBallSize*.6, cylinderHeight, 16, 1, true);
      const topCylinder = new THREE.Mesh(topCylinderGeometry, material);
      topCylinder.position.set(0, ballDist*.4, ballDist*.4);
      topCylinder.rotation.x = 225 * Math.PI/180;

      const botCylinderGeometry = new THREE.CylinderGeometry(smallBallSize*.1, smallBallSize*.6, cylinderHeight, 16, 1, true);
      const botCylinder = new THREE.Mesh(botCylinderGeometry, material);
      botCylinder.position.set(0, -ballDist*.4, ballDist*.4);
      botCylinder.rotation.x = -45 * Math.PI/180;

      const leftCylinderGeometry = new THREE.CylinderGeometry(smallBallSize*.1, smallBallSize*.6, cylinderHeight, 16, 1, true);
      const leftCylinder = new THREE.Mesh(leftCylinderGeometry, material);
      leftCylinder.position.set(-ballDist*.4, 0, -ballDist*.4);
      leftCylinder.rotation.set(90 * Math.PI/180, 0, -45 * Math.PI/180);
      
      const rightCylinderGeometry = new THREE.CylinderGeometry(smallBallSize*.1, smallBallSize*.6, cylinderHeight, 16, 1, true);
      const rightCylinder = new THREE.Mesh(rightCylinderGeometry, material);
      rightCylinder.position.set(ballDist*.4, 0, -ballDist*.4);
      rightCylinder.rotation.set(90 * Math.PI/180, 0, 45 * Math.PI/180);

      // all
      const centerShpereGeometry = new THREE.SphereGeometry(bigBallSize, 16, 16);
      topShpere.updateMatrix();
      centerShpereGeometry.merge(topShpere.geometry, topShpere.matrix);
      botShpere.updateMatrix();
      centerShpereGeometry.merge(botShpere.geometry, botShpere.matrix);
      leftShpere.updateMatrix();
      centerShpereGeometry.merge(leftShpere.geometry, leftShpere.matrix);
      rightShpere.updateMatrix();
      centerShpereGeometry.merge(rightShpere.geometry, rightShpere.matrix);
      
      topCylinder.updateMatrix();
      centerShpereGeometry.merge(topCylinder.geometry, topCylinder.matrix);
      botCylinder.updateMatrix();
      centerShpereGeometry.merge(botCylinder.geometry, botCylinder.matrix);
      leftCylinder.updateMatrix();
      centerShpereGeometry.merge(leftCylinder.geometry, leftCylinder.matrix);
      rightCylinder.updateMatrix();
      centerShpereGeometry.merge(rightCylinder.geometry, rightCylinder.matrix);

      logo = new THREE.Mesh(centerShpereGeometry, material);

      scene.add(logo);
    }

    const initPlane = () => {
      const bufferGeometry = new THREE.PlaneBufferGeometry( planeWidth, planeHeight, 1);
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.maxInstancedCount = instancedCount;
      geometry.index = bufferGeometry.index;
      geometry.attributes.position = bufferGeometry.attributes.position;
      geometry.attributes.normal = bufferGeometry.attributes.normal;

      for (let i = 0; i < instancedCount; i++) {
        planeSpeed.push(Math.random()+.5);
        let { x, y } = getRandomXY();
        planeOffsets.push(x, y-screenHeight-planeHeight, -5);
      }

      offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array(planeOffsets), 3 );
      geometry.addAttribute("offset", offsetAttribute);

      var material = new THREE.MeshBasicMaterial({ color: 0xf8f8f8 });
      material.onBeforeCompile = function(shader) {
        shader.vertexShader =
          "attribute vec3 offset;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          ["vec3 transformed = vec3(position + offset);"].join("\n")
        );
      };

      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    };

    const start = Date.now();
    const draw = () => {
      const timer = (Date.now() - start) * 0.0001;

      logo.rotation.set(timer,timer,0);

      for (let i = 0; i < instancedCount; i++) {
        let x = planeOffsets[i * 3 + 0];
        let y = (planeOffsets[i * 3 + 1] += options.planeSpeed * planeSpeed[i]);

        if (y > screenHeight / 2 + planeHeight+1) {
          let botPos = -screenHeight / 2 - planeHeight-1;
          planeSpeed[i] = Math.random()+.5;
          if (!started) {
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
      if(!clicked){
        clicked =true;
        props.dispatch(updateIsStarted(true));
        
        const tl = new TimelineMax();
        tl.to(options, 1.6, {planeSpeed: 1, ease:'Power3.easeInOut'},0);
        tl.to(camera.position, 4, {z: 40, ease:'Power3.easeInOut'},0);
        tl.add(()=>{ started =true; }, 2);
      }
    };

    // const onClickEvent = ()=>{
      
    // }
    // controls.current = {onClickEvent};

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
  },[canvasWrap]);

  
  // useEffect(()=>{
    // if(props.clicked){
      // console.log(props.clicked);
  //     controls.current.onClickEvent();
  //   }
  // },[props.clicked]);

  return <div ref={canvasWrap} id="canvasWrap" />
};

const mapStateToProps = state => {
  return {
    lang: state.lang,
    isStarted: state.isStarted
  };
};

export default connect(mapStateToProps)(ThreejsBg);
