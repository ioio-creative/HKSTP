import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { TweenMax, TimelineMax } from "gsap";
import { updateIsStarted } from "../../reducers";

const ThreejsBg = props => {
  const canvasWrap = useRef(null);
  const initImageFuction = useRef(null);
  const updateImageEffectFuction = useRef(null);


  useEffect(() => {
    let scene, camera, renderer, dist, vFOV;
    let screenWidth, screenHeight;
    // let onWindowResize;
    const stats = new Stats();

    const instancedCount = 10;
    let offsetAttribute,
        imageInstancedCount,
        imageOffsetAttribute,
        imageScaleAttribute,
        imageTextureIdxAttribute,
        imageSlideProgressAttribute;
    let planeWidth = 10,
        planeHeight = planeWidth * 0.75;
    const planeOffsets = [],
        planeSpeed = [];
    let clicked = false,
        started = false,
        initedImage = false;
    let images;
    const imageOffsets = [],
        imageScale = [],
        imageSize = [],
        imageTexture = [],
        imageTextureIdx = [],
        imageSlideProgress = [];
    let tempImageSize = [];
        // imagesShader;

    let logo,
        logoRotateSpeed = {x:0.004,y:0.004};

    const options = {
      planeSpeed: 0.001,
      slideProgress: 0
    };

    const init = function() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
      // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, .1, 1000 );

      dist = camera.position.z = 60;
      vFOV = THREE.Math.degToRad(camera.fov);
      const screen = getScreenSize();
      screenWidth = screen.width;
      screenHeight = screen.height;
      // new OrbitControls(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 0);
      canvasWrap.current.appendChild(renderer.domElement);

      const gui = new dat.GUI({ width: 300 });
      gui.add(options, "planeSpeed").min(0).max(2).listen();
      gui.add(options, 'slideProgress').min(0).max(1).listen();
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
      TweenMax.to(logo.position, 2, {z: 20, ease:'Power3.easeInOut'});
    };

    const getScreenSize = function() {
      let w,h;
      if (vFOV) {
        h = 2 * Math.tan(vFOV / 2) * dist;
        w = h * camera.aspect;
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
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

    const convert2dto3d = (x,y) => {
      var vector = new THREE.Vector3((x / window.innerWidth ) * 2 - 1, - ( y / window.innerHeight ) * 2 + 1, 1);
      vector.unproject( camera );
      var dir = vector.sub( camera.position ).normalize();
      var distance = - camera.position.z / dir.z;
      return camera.position.clone().add( dir.multiplyScalar( distance ) );
    }

    const initLight = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    };

    const initMesh = () => {
      initPlane();
      initLogo();

      initImageFuction.current = {initImage}
      // initImage();
    };

    const initLogo = () => {
      const bigBallSize = 4;
      const smallBallSize = 2.5;
      const ballDist = 15;
      const cylinderHeight = ballDist * .8;

      const material = new THREE.MeshBasicMaterial({ color: 0xe9e9e9 });
      
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
      let centerShpereGeometry = new THREE.SphereGeometry(bigBallSize, 16, 16);
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

    
      const finalMaterial = new THREE.MeshBasicMaterial({ color: 0xe9e9e9, wireframe:false, depthTest:false, side:THREE.DoubleSide });
      material.onBeforeCompile = function(shader) {
        shader.vertexShader =
          // "attribute vec3 offset;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          ["vec3 transformed = vec3(position);"].join("\n")
        );
      };

      logo = new THREE.Mesh(centerShpereGeometry, finalMaterial);
      logo.position.z = 60;

      scene.add(logo);
    }

    const initPlane = () => {
      const bufferGeometry = new THREE.PlaneBufferGeometry( planeWidth, planeHeight, planeWidth, planeHeight);
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

      var material = new THREE.MeshBasicMaterial({ color: 0xf8f8f8, wireframe:true });
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

    const initImage = () => {
      const elem = document.querySelector('#projects li:nth-child(1) .imageWrap'); 
      if(elem){
        if(!initedImage){
          imageInstancedCount = document.querySelectorAll('#projects li').length;
          const {x,y} = convert2dto3d(elem.offsetWidth, elem.offsetWidth);
          const w = x + (screenWidth - screenWidth/2);
          const h = y - (screenHeight - screenHeight/2);
          const bufferGeometry = new THREE.PlaneBufferGeometry(w,h, w*2, -h*2);
          const geometry = new THREE.InstancedBufferGeometry();
          geometry.maxInstancedCount = imageInstancedCount;
          geometry.index = bufferGeometry.index;
          geometry.attributes.position = bufferGeometry.attributes.position;
          geometry.attributes.normal = bufferGeometry.attributes.normal;
          geometry.attributes.uv = bufferGeometry.attributes.uv;
        
          for (let i = 0; i < imageInstancedCount; i++) {
            const elem = document.querySelector(`#projects li:nth-child(${i+1}) .imageWrap`);
            imageOffsets.push(0,0,0);
            imageScale.push(1,1,1);
            imageSize[i] = {w:elem.offsetWidth, h:elem.offsetHeight};

            imageTextureIdx.push(i);

            const texture = new THREE.TextureLoader().load(elem.getAttribute('data-src'));
            texture.flipY = false;
            imageTexture.push(texture);

            imageSlideProgress.push({value:0});
          }
          tempImageSize = Array.from(imageSize);

          imageOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageOffsets), 3 );
          geometry.addAttribute("offset", imageOffsetAttribute);
          imageScaleAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageScale), 3 );
          geometry.addAttribute("scale", imageScaleAttribute);
          imageTextureIdxAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageTextureIdx), 1 );
          geometry.addAttribute("textureIdx", imageTextureIdxAttribute);
          imageSlideProgressAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageSlideProgress), 1 );
          geometry.addAttribute("slideProgress", imageSlideProgressAttribute);
          // imageClickedIdxAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageClickedIdx), 1 );
          // geometry.addAttribute("clickedIdx", imageClickedIdxAttribute);

          const loopTexture = (indexName) => {
            const t = [];
            for(let i = 0; i<imageInstancedCount; i++){
              if(i===0){ 
                t.push('vec4 texture;');
                t.push(`int n = int(${indexName});`);
              }
              t.push(`${i>0?'else':''} if(n == int(${i}.0))`);
              t.push(`texture = texture2D(images[${i}], vUv);`);
            }
            return t.join('\n');
          }


          const material = new THREE.ShaderMaterial({
            uniforms:{ 
                images:{ type:'t', value: imageTexture },
                clickedIdx:{ type: 'f', value: 0 }
                // slideProgress:{ type:'f', value: 0 }
            },
            vertexShader: [
              `uniform sampler2D images[${imageInstancedCount}];`,
              'uniform float clickedIdx;',
              
              'attribute float textureIdx;',
              'attribute float slideProgress;',
              'attribute vec3 offset;',
              'attribute vec3 scale;',

              'varying vec2 vUv;',
              'varying float idx;',
              'varying float colorProgress;',
              
              'void main(){',
                'float PI = 3.14159;',
                'vUv = uv;',
                'idx = textureIdx;',
                'mat4 matPos = mat4(vec4(scale.x,0.0,0.0,0.0),',
                                'vec4(0.0,scale.y,0.0,0.0),',
                                'vec4(0.0,0.0,scale.z,0.0),',
                                'vec4(offset,1.0));',
                'vec3 newPosition = (matPos * vec4(position, 1.)).xyz;',

                'int i = int(idx);',
                'int c = int(clickedIdx);',
                'if(c == i){',
                  loopTexture('clickedIdx'),
                  'colorProgress = 1.;',
                  'newPosition.z += (texture.r + texture.g + texture.b) * 2.5;',
                '}',
                // 'else{',
                //   'colorProgress = pow(((slideProgress * 3. - 1.) + uv.y - uv.x)* 5. - 5. / 2., 4.);',
                //   'newPosition.z = 8. * -sin(max(0., min(1., colorProgress))* 360. * PI/180.);',
                // '}',

                
                'vec4 position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
                'gl_Position = position;',
              '}'
            ].join('\n'),
            fragmentShader:[
              `uniform sampler2D images[${imageInstancedCount}];`,

              'varying vec2 vUv;',
              'varying float idx;',
              'varying float colorProgress;',

              'void main(){',
                loopTexture('idx'),
                // 'vec3 texture2 = vec3(texture.r+texture.g+texture.b);',
                // 'gl_FragColor = vec4(mix(texture2.xyz, texture.xyz, max(0., min(1.,colorProgress))), 1.);',
                'gl_FragColor = texture;',
              '}'
            ].join('\n'),
            side:THREE.DoubleSide,
            // wireframe:true
          });

          images = new THREE.Mesh(geometry, material);
          scene.add(images);
          initedImage = true;


          const imageAnim = (i) => {
            TweenMax.fromTo(imageSlideProgress[i], Math.random()+1, {value:0},{delay:Math.random()*8+2, value:1,ease:'Power3.easeInOut', 
              onComplete:()=>{imageAnim(i)}
            });
          }
          for (let i = 0; i < imageInstancedCount; i++) {
            imageAnim(i);
          }
        }
        else{
          const {x,y} = convert2dto3d(elem.offsetWidth, elem.offsetWidth);
          const w = x + (screenWidth - screenWidth/2);
          const h = y - (screenHeight - screenHeight/2);
          const bufferGeometry = new THREE.PlaneBufferGeometry(w,h, w, -h);
          images.geometry.maxInstancedCount = imageInstancedCount;
          images.geometry.index = bufferGeometry.index;
          images.geometry.attributes.position = bufferGeometry.attributes.position;
          images.geometry.attributes.normal = bufferGeometry.attributes.normal;
          images.geometry.attributes.uv = bufferGeometry.attributes.uv;
          for (let i = 0; i < imageInstancedCount; i++) {
            const elem = document.querySelector(`#projects li:nth-child(${i+1}) .imageWrap`);
            imageSize[i] = {w:elem.offsetWidth, h:elem.offsetHeight};
          }
          tempImageSize = Array.from(imageSize);
        }
      }
    }

    const imageEffect = (idx) => {
      if(idx)
      images.material.uniforms.clickedIdx.value = idx;
      console.log(idx);
    }
    updateImageEffectFuction.current = {imageEffect};

    const start = Date.now();
    const draw = () => {
      // const timer = (Date.now() - start) * 0.0001;

      logo.rotation.x += logoRotateSpeed.x;
      logo.rotation.y += logoRotateSpeed.y;

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


      if(initedImage){
        for(let i=0; i<imageInstancedCount; i++){
          const elem = document.querySelector(`#projects li:nth-child(${i+1}) .imageWrap`);
          const pos = elem.getBoundingClientRect();
          if(imageTexture[i].image){
            elem.style.height = elem.offsetWidth * (imageTexture[i].image.height / imageTexture[i].image.width) + 'px';
          }
          imageSize[i] = {w:elem.offsetWidth, h:elem.offsetHeight};

          const scaleHeight = imageSize[i].h / imageSize[i].w;
          const {x, y} = convert2dto3d(pos.left+ imageSize[i].w/2, pos.top + imageSize[i].h/2);

          if(tempImageSize.length)
            imageScaleAttribute.setXY(i, imageSize[i].w/tempImageSize[i].w, scaleHeight * (imageSize[i].w/tempImageSize[i].w));        


          imageOffsets[i*3+0] = x;
          imageOffsets[i*3+1] = y;
          imageOffsetAttribute.setXY(i, x, y);

          imageSlideProgressAttribute.setX(i, imageSlideProgress[i].value);
        }

        imageOffsetAttribute.needsUpdate = true;
        imageScaleAttribute.needsUpdate = true;
        imageSlideProgressAttribute.needsUpdate = true;

        // images.material.uniforms.slideProgress.value = options.slideProgress;
      }
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
        tl.to(options, 1.6, {planeSpeed: 2, ease:'Power3.easeInOut'},0);
        tl.to(logo.position, 4, {z: 0, ease:'Power3.easeInOut'},0);
        tl.to(logoRotateSpeed, 2, {x: .05, y: .05, ease:'Power3.easeInOut'},0);
        tl.to(logoRotateSpeed, 2, {x: .004, y: .004, ease:'Power3.easeInOut'},2);
        tl.add(()=>{ started =true; }, 2.6);
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

      // scene.remove( images );
      // images.geometry.dispose();
      // images.material.dispose();
      initImage();

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

  
  useEffect(()=>{
    initImageFuction.current.initImage();
  },[props.isStarted]);

  
  useEffect(()=>{
    updateImageEffectFuction.current.imageEffect(props.imageClickedIdx);
  },[props.imageClickedIdx]);

  return <div ref={canvasWrap} id="canvasWrap" />
};

const mapStateToProps = state => {
  return {
    lang: state.lang,
    isStarted: state.isStarted,
    projectsData: state.projectsData ? state.projectsData : null,
    imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(ThreejsBg);
