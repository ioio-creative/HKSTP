import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
// import OrbitControls from "three-orbitcontrols";
// import * as dat from "dat.gui";
// import Stats from "stats.js";
import { TweenMax, TimelineMax } from "gsap";
import { updateIsStarted, updatePage, updateImageClickedIdx, updateHideProjects } from "../../reducers";
import mask from './mask.jpg';

console.warn = function(){};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const ThreejsBg = props => {
  const canvasWrap = useRef(null);
  const initImageFunction = useRef(null);
  const removeImageFunction = useRef(null);
  const updateImageEffectFunction = useRef(null);
  const loadImageFunction = useRef(null);
  const updateStopEaseFunction = useRef(null);
  const backToHomeFunction = useRef(null);
  const onClickFunction = useRef(null);
  const prevProps = usePrevious({page: props.page});

  useEffect(() => {
    let scene, camera, renderer, dist;
    let screenWidth, screenHeight, initHeight;
    // let onWindowResize;
    // const stats = new Stats();

    const instancedCount = 10,
        limitedTextureCount = 16;

    let plane,
        planeWidth = 10,
        planeHeight = planeWidth * 0.75;
    const planeOffsets = [],
        planeSpeed = [];
    let planeOffsetAttribute;

    let clicked = false,
        initedImage = false;

    let images,
        imagesMaterial = null,
        changedCategory = false,
        offset = {x:0, y:0, z:0},
        rotate = {x:0, y:0, z:0},
        disableEase = false,
        tween = [];
        
    let imageInstancedCount,
        imageOffsetAttribute,
        imageRotateAttribute,
        imageScaleAttribute,
        imageTextureIdxAttribute,
        imageSlideProgressAttribute,
        imageDisplacementAttribute,
        imageVisibleAttribute;

    let imageOffsets = [],
        imageBGOffsets = [],
        imageBGEase = [],
        imageRotate = [],
        imageScale = [],
        imageSize = [],
        imageTexture = [],
        imageTextureIdx = [],
        // imageTextureSize = [],
        imageSlideProgress = [],
        imageDisplacement = [],
        imageVisible = [],
        imageLoaded = [],
        imageInScreenIdx = [],
        imageInScreenTexture = [],
        imageClickedIdx,
        tempImageSize = [];
        
    let imageWrapDOM = null;

    let logo,
        logoRotateSpeed = {value: 0},
        rotateSpeed = {value: 0.004};

    let guiWireframe;

    const options = {
      planeSpeed: 0.001,
      slideProgress: 0,
      gary: false
    };

    const init = function() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
      // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, .1, 1000 );

      dist = camera.position.z = 60;
      const screen = getScreenSize();
      screenWidth = screen.width;
      screenHeight = screen.height;
      // new OrbitControls(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 0);
      canvasWrap.current.appendChild(renderer.domElement);

      // gui = new dat.GUI({ width: 350 });
      // gui.add(options, "planeSpeed").min(0).max(2).name('background plane speed').listen();
      // gui.add(options, "slideProgress").min(0).max(1).name('color of logo slider').listen();
      // const g = gui.add(options, "gary").name('set Gary image');
      // g.onChange(()=>{
      //   if(imagesMaterial)
      //     imagesMaterial.uniforms.isGary.value = options.gary;
      // })
      // gui.domElement.parentNode.style.zIndex = 999;

      // stats
      // stats.showPanel(0);
      // stats.domElement.style.position = "fixed";
      // stats.domElement.style.top = 0;
      // document.body.appendChild(stats.domElement);

      initLight();
      initMesh();

      renderer.setAnimationLoop(function() {
        update();
        render();
      });

      TweenMax.to(options, .6, {planeSpeed: .1, ease:'Power3.easeInOut'});
      TweenMax.to(logo.position, 2, {x:5, z:20, ease:'Power3.easeInOut'});
    };

    const getScreenSize = function() {
      let w,h;
      const vFOV = THREE.Math.degToRad(camera.fov);
      
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
    };

    const initLogo = () => {
      const bigBallSize = 4;
      const smallBallSize = 2.5;
      const ballDist = 15;
      const cylinderHeight = ballDist * .8;
      const shpereDetail = 32;

      const material = new THREE.MeshBasicMaterial({ color: 0xe9e9e9 });
      
      const topShpereGeometry = new THREE.SphereGeometry(smallBallSize, shpereDetail, shpereDetail);
      const topShpere = new THREE.Mesh(topShpereGeometry, material);
      topShpere.position.set(0, ballDist*Math.sin(45*Math.PI/180), ballDist*Math.cos(45*Math.PI/180));
      
      const botShpereGeometry = new THREE.SphereGeometry(smallBallSize, shpereDetail, shpereDetail);
      const botShpere = new THREE.Mesh(botShpereGeometry, material);
      botShpere.position.set(0, ballDist*Math.sin(-45*Math.PI/180), ballDist*Math.cos(-45*Math.PI/180));

      const leftShpereGeometry = new THREE.SphereGeometry(smallBallSize, shpereDetail, shpereDetail);
      const leftShpere = new THREE.Mesh(leftShpereGeometry, material);
      leftShpere.position.set(-ballDist*Math.sin(45*Math.PI/180), 0, -ballDist*Math.cos(45*Math.PI/180));

      const rightShpereGeometry = new THREE.SphereGeometry(smallBallSize, shpereDetail, shpereDetail);
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
      let centerShpereGeometry = new THREE.SphereGeometry(bigBallSize, shpereDetail, shpereDetail);
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
      
      const finalMaterial = new THREE.ShaderMaterial({
        uniforms:{
          disp:{ type:'t', value: new THREE.TextureLoader().load(mask) },
          slideProgress:{ type:'f', value:0 }
        },
        vertexShader: [
          'varying vec2 vUv;',
          'void main(){',
            'vUv = uv;',
            'vec3 newPosition = position;',
            'vec4 position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
            'gl_Position = position;',
          '}'
        ].join('\n'),
        fragmentShader:[
          'uniform sampler2D disp;',
          'uniform float slideProgress;',

          'varying vec2 vUv;',

          'void main(){',
            'vec4 disp = texture2D(disp, vUv);',
            'float r = (slideProgress) * 2. - 1.;',
            'float value = clamp((disp.r + r - .7) * 5., 0., 1.);',
            'vec3 color = mix(vec3(14./255., 45./255., 118./255.), vec3(233./255., 233./255., 233./255.), value);',
            'gl_FragColor = vec4(color, 1.);',
          '}'
        ].join('\n'),
        side:THREE.DoubleSide 
      });

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

      planeOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array(planeOffsets), 3 );
      geometry.addAttribute("offset", planeOffsetAttribute);

      var material = new THREE.MeshBasicMaterial({ color: 0xefefef, wireframe:true, transparent:true });
      material.onBeforeCompile = function(shader) {
        shader.vertexShader =
          "attribute vec3 offset;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          ['vec3 newPosition = position;',
          'newPosition.z = (sin(newPosition.x + offset.y) + sin(newPosition.y + offset.y)) * .3;',
          "vec3 transformed = vec3(newPosition + offset);"].join("\n")
        );
      };

      plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    };

    const loadTexture = (i, src) => {
      new THREE.TextureLoader().load(
        src,
        (t)=>{
          t.flipY = false;
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
          imageTexture[i] = t;
          resizeImage();
        }
      );
    }

    const loadImage = () => {
      if(imageWrapDOM){
        const lth = imageWrapDOM.length;//document.querySelectorAll('#projects li').length;
        for (let i = 0; i < lth; i++) {
          const elem = imageWrapDOM[i].children[1];
          // const elem = document.querySelector(`#projects li:nth-child(${i+1}) .imageWrap`);
          if(elem){
            const offset = elem.getBoundingClientRect();
            if(offset.top > 0 && offset.top-elem.offsetHeight < window.innerHeight*2 && !imageLoaded[i]){
              loadTexture(i, elem.getAttribute('data-src'));
              imageLoaded[i] = true;
            }
          }
        
        }
      }
    }
    loadImageFunction.current = {loadImage};

    
    const resizeImage = () => {
      if(imageTexture.length){
        const lth = imageWrapDOM.length;//document.querySelectorAll(`#projects li`).length;

        for(let i=0; i< lth; i++){
          if(imageTexture[i]){
            const elem = imageWrapDOM[i].children[1];//document.querySelector(`#projects li:nth-child(${i+1}) .imageWrap`);
            if(elem){
              if(imageTexture[i].image){
                elem.style.height = elem.offsetWidth * (imageTexture[i].image.height / imageTexture[i].image.width) + 'px';
                // elem.style.height = elem.offsetWidth * (imageTextureSize[i].h / imageTextureSize[i].w) + 'px';
              }
            }
            imageSize[i] = {w:elem.offsetWidth, h:elem.offsetHeight};

            if(!tempImageSize[i]) tempImageSize[i] = imageSize[i];
          }
        }

        // resize 3d image
        for(let i=0; i<tempImageSize.length; i++){
          if(tempImageSize[i]){
            const scaleHeight = imageSize[i].h / (imageSize[i].w);
            const w = imageSize[i].w / tempImageSize[i].w;
            const hh = (1-initHeight/window.innerHeight);
            if(imageScaleAttribute){
              imageScaleAttribute.setXY(i, imageSize[i].w/tempImageSize[i].w - hh * w, scaleHeight * (imageSize[i].w/tempImageSize[i].w - hh * w));
              imageScaleAttribute.setXY(i+imageInstancedCount/2, imageSize[i].w/tempImageSize[i].w - hh * w, scaleHeight * (imageSize[i].w/tempImageSize[i].w - hh * w));
            }
          }
        }
      }
      // if(!tempImageSize.length) tempImageSize = Array.from(imageSize);
    }


    const initImage = (catIdx, allItem, itemSize) => {
      // console.log(allItem)
      imageWrapDOM = allItem;//document.querySelectorAll(`#projects li .imageWrap`);

      const elem = imageWrapDOM[0].children[1];//document.querySelector('#projects li:nth-child(1) .imageWrap');

      // if(elem){
        if(!initedImage){
          initHeight = window.innerHeight;
          imageInstancedCount = itemSize * 2;//document.querySelectorAll('#projects li').length * 2;

          const realCount = imageInstancedCount/2;
          const {x,y} = convert2dto3d(elem.offsetWidth, elem.offsetWidth);
          const w = x + (screenWidth - screenWidth/2);
          const h = y - (screenHeight - screenHeight/2);
          const bufferGeometry = new THREE.PlaneBufferGeometry(w,h, w*5, -h*5);
          const geometry = new THREE.InstancedBufferGeometry();
          geometry.maxInstancedCount = imageInstancedCount;
          geometry.index = bufferGeometry.index;
          geometry.attributes.position = bufferGeometry.attributes.position;
          geometry.attributes.normal = bufferGeometry.attributes.normal;
          geometry.attributes.uv = bufferGeometry.attributes.uv;
        
          for (let i = 0; i < imageInstancedCount; i++) {
            imageOffsets.push(0,-screenHeight,0);
            imageBGOffsets.push({x:Math.random()*.7+.3, y:Math.random()*1+.5, z:0});
            imageBGEase.push(Math.random()*0.2+0.08);
            imageRotate.push(0,0,0);
            imageScale.push(1,1,1);
            imageTextureIdx.push(i);
            imageSlideProgress.push({value:0});
            imageDisplacement.push({value:0});
            imageVisible.push(0);
          }
          

          imageOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageOffsets), 3 );
          geometry.addAttribute("offset", imageOffsetAttribute);
          imageScaleAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageScale), 3 );
          geometry.addAttribute("scale", imageScaleAttribute);
          imageRotateAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageRotate), 3 );
          geometry.addAttribute("rotate", imageRotateAttribute);
          imageTextureIdxAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageTextureIdx), 1 );
          geometry.addAttribute("textureIdx", imageTextureIdxAttribute);
          imageSlideProgressAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageSlideProgress), 1 );
          geometry.addAttribute("slideProgress", imageSlideProgressAttribute);
          imageDisplacementAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageDisplacement), 1 );
          geometry.addAttribute("displacement", imageDisplacementAttribute);
          imageVisibleAttribute = new THREE.InstancedBufferAttribute( new Float32Array(imageVisible), 1 );
          geometry.addAttribute("visible", imageVisibleAttribute);


          changedCategory = catIdx;
          imagesMaterial = new THREE.ShaderMaterial({
            uniforms:{ 
                // images:{ type:'t', value: imageTexture },
                inScreenIdx:{ type:'f', value: [0,1,2,3] },
                inScreenTexture:{ type:'t', value: imageInScreenTexture },
                clickedIdx:{ type: 'f', value: -1 },
                isGary:{ type:'bool', value: options.gary },
                changedCategory: {type:'bool', value: changedCategory}
            },
            vertexShader: [
              `uniform float inScreenIdx[${limitedTextureCount}];`,
              `uniform sampler2D inScreenTexture[${limitedTextureCount}];`,
              
              'attribute float textureIdx;',
              'attribute float slideProgress;',
              'attribute float displacement;',
              'attribute vec3 offset;',
              'attribute vec3 rotate;',
              'attribute vec3 scale;',
              'attribute float visible;',

              'varying vec2 vUv;',
              'varying float idx;',
              'varying float colorProgress;',
              'varying float vVisible;',
              
              'void main(){',
                  'float PI = 3.14159;',
                  'vUv = uv;',
                  'idx = textureIdx;',
                  'vVisible = visible;',
                  // Rotate
                  "mat4 rXPos = mat4(vec4(1.0,0.0,0.0,0.0),",
                                    "vec4(0.0,cos(rotate.x),-sin(rotate.x),0.0),",
                                    "vec4(0.0,sin(rotate.x),cos(rotate.x),0.0),",
                                    "vec4(0.0,0.0,0.0,1.0));",

                  "mat4 rYPos = mat4(vec4(cos(rotate.y),0.0,sin(rotate.y),0.0),",
                                    "vec4(0.0,1.0,0.0,0.0),",
                                    "vec4(-sin(rotate.y),0.0,cos(rotate.y),0.0),",
                                    "vec4(0.0,0.0,0.0,1.0));",

                  "mat4 rZPos = mat4(vec4(cos(rotate.z),-sin(rotate.z),0.0,0.0),",
                                    "vec4(sin(rotate.z),cos(rotate.z),0.0,0.0),",
                                    "vec4(0.0,0.0,1.0,0.0),",
                                    "vec4(0.0,0.0,0.0,1.0));",

                  'mat4 sPos = mat4(vec4(scale.x,0.0,0.0,0.0),',
                                  'vec4(0.0,scale.y,0.0,0.0),',
                                  'vec4(0.0,0.0,scale.z,0.0),',
                                  'vec4(offset,1.0));',

                  'mat4 matPos = sPos * rXPos * rYPos * rZPos;',
                  'vec3 newPosition = position;',


                'if(visible == 1.){',
                  `for(int i=0; i<${limitedTextureCount}; i++){`,
                    'if(inScreenIdx[i] == -1.)',
                      'break;',
                    `if(idx == inScreenIdx[i]+${realCount}.){`,
                      'vec4 texture = texture2D(inScreenTexture[i], vUv);',
                      'float color = texture.r + texture.g + texture.b;',
                      'newPosition.z += color * 2.;',

                      'if(color < .3)',
                        'newPosition.z += 4.;',
                      'if(color < .5)',
                        'newPosition.z -= 5.;',

                      'break;',
                    '}',
                  '}',
                  'newPosition.z *= displacement;',

                  `if(textureIdx > ${realCount-1}.){`,
                    'colorProgress = pow(((slideProgress * 3. - 1.) + uv.y - uv.x)* 5. - 5. / 2., 4.);',
                    'newPosition.z += 5. * -sin(max(0., min(1., colorProgress))* 360. * PI/180.);',
                  '}',

                  
                  'vec4 position = projectionMatrix * modelViewMatrix * matPos * vec4(newPosition, 1.0);',
                  
                  'gl_Position = position;',
                '}',
                'else',
                  'gl_Position = projectionMatrix * modelViewMatrix * matPos * vec4(newPosition, 1.0);',
              '}'
            ].join('\n'),
            fragmentShader:[
              `uniform float inScreenIdx[${limitedTextureCount}];`,
              `uniform sampler2D inScreenTexture[${limitedTextureCount}];`,
              'uniform bool isGary;',
              'uniform bool changedCategory;',

              'varying vec2 vUv;',
              'varying float idx;',
              'varying float colorProgress;',
              'varying float vVisible;',

              'void main(){',
                'if(vVisible == 1.){',
                  'vec4 color = vec4(vec3(1.,1.,1.), 1.);',
                  `for(int i=0; i<${limitedTextureCount}; i++){`,
                    'if(inScreenIdx[i] == -1.)',
                      'break;',
                    `if(idx == inScreenIdx[i]+${realCount}.){`,
                      'color = texture2D(inScreenTexture[i], vUv);',
                      'if(isGary){',
                        'float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));',
                        'color = vec4(vec3(gray), 1.0);',
                      '}',
                      'break;',
                    '}',
                    'if(idx == inScreenIdx[i]){',
                      'if(changedCategory)',
                        'color = vec4(vec3(236./255., 105./255., 0./255.), 1.);', // orange
                      'else',
                        'color = vec4(vec3(14./255., 45./255., 118./255.), 1.);', // blue
                      'break;',
                    '}',
                  '}',

                  'gl_FragColor = color;',
                '}',
                'else',
                  'gl_FragColor = vec4(vec3(1.,1.,1.), 0.);',
              '}'
            ].join('\n'),
            depthTest: false,
            side:THREE.DoubleSide,
            transparent:true
          });

          imagesMaterial.minFilter = THREE.LinearFilter;
          // imagesMaterial.uniforms.isGary.value = true;

          images = new THREE.Mesh(geometry, imagesMaterial);
          scene.add(images);
          initedImage = true;

          resizeImage();

          const imageAnim = (i) => {
            tween[i] = TweenMax.fromTo(imageSlideProgress[i], Math.random()+1, {value:0},{delay:Math.random()*8+2, value:1,ease:'Power3.easeInOut', 
              onComplete:()=>{imageAnim(i)}
            });
          }
          for (let i = 0; i < imageInstancedCount; i++) {
            imageAnim(i);
          }

          // if(guiWireframe) gui.remove(guiWireframe);
          // guiWireframe = gui.add(imagesMaterial, "wireframe");
        }
      // }
    }
    initImageFunction.current = {initImage}


    const imageEffect = (idx) => {
      if(images){
        if(idx !== null){
          if(images.material.uniforms.clickedIdx.value !== idx){
            const realCount = imageInstancedCount/2;
            const realIdx = idx+realCount;
            images.material.uniforms.clickedIdx.value = realIdx;
            
            TweenMax.to(rotate, .4, {x:45*Math.PI/180, y:45*Math.PI/180, ease:'Power3.easeOut'});
            TweenMax.to(imageDisplacement[realIdx], 1, {delay:.6, value: 1, ease:'Power4.easeInOut',
              onStart:()=>{
                if(imagesMaterial)
                  imagesMaterial.depthTest = true;
              }
            });

            imageClickedIdx = realIdx;
          }
        }
        else{
          // when closed
          stopEase();
          imagesMaterial.depthTest = false;

          images.material.uniforms.clickedIdx.value = -1;
          TweenMax.to(imageDisplacement, .6, {value: 0, ease:'Power3.easeOut'});
          TweenMax.to(rotate, .4, {x:0, y:0, ease:'Power3.easeOut'});
        }
      }
    }
    updateImageEffectFunction.current = {imageEffect};

    const stopEase = () => {
      disableEase = true;
      setTimeout(()=>{
        disableEase = false;
      },100)
    }
    updateStopEaseFunction.current = {stopEase};

    const removeImage = () => {
      if(images){
        // console.log('del')
        for(let i=0; i<tween.length; i++){
          tween[i].kill();
          tween[i] = undefined;
        }
        tween = [];
        images.geometry.dispose();
        images.material.dispose();
        scene.remove(images);
        images = undefined;
        imagesMaterial.dispose();
        imagesMaterial = undefined;

        imageOffsets = [];
        imageBGOffsets = [];
        imageBGEase = [];
        imageRotate = [];
        imageScale = [];
        imageSize = [];
        imageTexture = [];
        imageTextureIdx = [];
        imageSlideProgress = [];
        imageDisplacement = [];
        imageVisible = [];
        imageLoaded = [];
        imageInScreenIdx = [];
        imageInScreenTexture = [];
        imageClickedIdx = undefined;
        tempImageSize = [];

        rotate = {x:0, y:0, z:0};

        initedImage = false;
      }
    }
    removeImageFunction.current = {removeImage}


    // const start = Date.now();
    const draw = () => {
      // const timer = (Date.now() - start) * 0.0001;

      logoRotateSpeed.value += rotateSpeed.value;
      logo.rotation.x += (logoRotateSpeed.value - logo.rotation.x) * .1;
      logo.rotation.y += (logoRotateSpeed.value - logo.rotation.y) * .1;
      logo.material.uniforms.slideProgress.value = options.slideProgress;


      for (let i = 0; i < instancedCount; i++) {
        let x = planeOffsets[i * 3 + 0];
        let y = (planeOffsets[i * 3 + 1] += options.planeSpeed * planeSpeed[i]);

        if (y > screenHeight / 2 + planeHeight+1) {
          let botPos = -screenHeight / 2 - planeHeight-1;
          planeSpeed[i] = Math.random()+.5;
          planeOffsets[i * 3 + 1] = botPos;
          const r = getRandomXY(botPos);
          x = r.x;
          y = r.y;
          planeOffsets[i * 3 + 0] = x;
          planeOffsets[i * 3 + 1] = y;
        }
        planeOffsetAttribute.setXY(i, x, y);
      }
      planeOffsetAttribute.needsUpdate = true;


      loadImage();
      if(initedImage && imageSize.length){
        imageInScreenIdx = [];
        imageInScreenTexture = [];


        for(let i=0; i<imageInstancedCount; i++){
          const realCount = imageInstancedCount/2;
          let ease = disableEase ? 1 : imageBGEase[i];


          if(i !== images.material.uniforms.clickedIdx.value){
            const _i = i%realCount;
            if(imageSize[_i]){
              // console.log(i%realCount+1)
              // const elem = document.querySelector(`#projects li:nth-child(${i%realCount+1}) .imageWrap`);
              if(imageWrapDOM){
                const elem = imageWrapDOM[i%realCount].children[1];
                const pos = elem.getBoundingClientRect();

                if(i < realCount){
                  if(pos.top > -imageSize[_i].h*2 && pos.top < window.innerHeight+imageSize[_i].h*2){
                  // if(pos.top > 0 && pos.top < window.innerHeight){
                    imageInScreenIdx.push(i);
                    if(imageInScreenTexture.length < limitedTextureCount)
                    imageInScreenTexture.push(imageTexture[i]);
                    
                    imageVisible[i] = 1;
                    imageVisible[i+realCount] = 1;
                  }
                  else{
                    imageVisible[i] = 0;
                    imageVisible[i+realCount] = 0;
                  }
                  imageVisibleAttribute.setX(i, imageVisible[i]);
                  imageVisibleAttribute.setX(i+realCount, imageVisible[i+realCount]);
                }
                
                const {x, y} = convert2dto3d(pos.left+ imageSize[_i].w/2, pos.top + imageSize[_i].h/2);
                offset = {x, y, z:0};

                // resize image
                // if(tempImageSize.length){
                //   if(tempImageSize[_i]){ console.log(1)
                //     const scaleHeight = imageSize[_i].h / (imageSize[_i].w);
                //     const w = imageSize[_i].w / tempImageSize[_i].w;
                //     const hh = (1-initHeight/window.innerHeight);
                //     imageScaleAttribute.setXY(i, imageSize[_i].w/tempImageSize[_i].w - hh * w, scaleHeight * (imageSize[_i].w/tempImageSize[_i].w - hh * w)  );
                //   }
                // }
              }
            }
          }
          else{
              offset = {x:0, y:0, z:30};
              // console.log(rotate.x % (Math.PI*2));
              rotate.x += 0.001;
              rotate.y += 0.001;
          }


          
          if(i >= realCount){
            if(i === imageClickedIdx){
              ease = imageBGEase[i];

              imageRotate[i*3+0] += (rotate.x - imageRotate[i*3+0]) * .1;
              imageRotate[i*3+1] += (rotate.y - imageRotate[i*3+1]) * .1;
              imageRotate[i*3+2] += (rotate.z - imageRotate[i*3+2]) * .1;

              if(imageRotate[i*3+0] >= (Math.PI*2)){
                imageRotate[i*3+0] = 0;
                rotate.x = 0;
              }
              if(imageRotate[i*3+1] >= (Math.PI*2)){
                imageRotate[i*3+1] = 0;
                rotate.y = 0;
              }
            }
            // else{
            //   console.log(1);
            //   imageRotate[i*3+0] += (0 - imageRotate[i*3+0]) * .1;
            //   imageRotate[i*3+1] += (0 - imageRotate[i*3+1]) * .1;
            //   imageRotate[i*3+2] += (0 - imageRotate[i*3+2]) * .1;
            // }
            imageOffsets[i*3+0] += (offset.x - imageOffsets[i*3+0]) * ease;
            imageOffsets[i*3+1] += (offset.y - imageOffsets[i*3+1]) * ease;
            imageOffsets[i*3+2] += (offset.z - imageOffsets[i*3+2]) * ease;
          }
          else{
            // target blue bg
            if(i === imageClickedIdx-realCount){
              ease = imageBGEase[i];
            }

            // target blue bg
            if(i === imageClickedIdx-realCount && images.material.uniforms.clickedIdx.value > -1){
              imageRotate[i*3+1] += (90*Math.PI/180 - imageRotate[i*3+1]) * ease;

              imageOffsets[i*3+0] += (0 - imageOffsets[i*3+0]) * ease;
              imageOffsets[i*3+1] += (0 - imageOffsets[i*3+1]) * ease;
              imageOffsets[i*3+2] += (0 - imageOffsets[i*3+2]) * ease;
            }
            else{ // other blue bg
              imageRotate[i*3+1] += (0 - imageRotate[i*3+1]) * ease;

              imageOffsets[i*3+0] += ((offset.x-imageBGOffsets[i].x) - imageOffsets[i*3+0]) * ease;
              imageOffsets[i*3+1] += ((offset.y+imageBGOffsets[i].y) - imageOffsets[i*3+1]) * ease;
              imageOffsets[i*3+2] += ((offset.z+imageBGOffsets[i].z) - imageOffsets[i*3+2]) * ease;
            }
          }

          imageOffsetAttribute.setXYZ(i, imageOffsets[i*3+0], imageOffsets[i*3+1], imageOffsets[i*3+2]);
          imageRotateAttribute.setXYZ(i, imageRotate[i*3+0], imageRotate[i*3+1], imageRotate[i*3+2]);
          imageSlideProgressAttribute.setX(i, imageSlideProgress[i].value);
          imageDisplacementAttribute.setX(i, imageDisplacement[i].value);
        }

        for(let i=imageInScreenIdx.length; i<limitedTextureCount; i++){
          imageInScreenIdx.push(-1);
        }
        for(let i=imageInScreenTexture.length; i<limitedTextureCount; i++){
          imageInScreenTexture.push(imageTexture[0]);
        }
        imagesMaterial.uniforms.inScreenIdx.value = imageInScreenIdx;
        imagesMaterial.uniforms.inScreenTexture.value = imageInScreenTexture;


        imageOffsetAttribute.needsUpdate = true;
        imageRotateAttribute.needsUpdate = true;
        imageScaleAttribute.needsUpdate = true;
        imageSlideProgressAttribute.needsUpdate = true;
        imageDisplacementAttribute.needsUpdate = true;
        imageVisibleAttribute.needsUpdate = true;
      }
    };

    const update = () => {
      draw();
      camera.lookAt(0, 0, 0);
      // stats.update();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    init();

    
    
    const onClick = (e) => {
      if(!clicked){
        if(e.target.getAttribute('id') !== 'langBtn'){
          clicked =true;
          props.dispatch(updatePage('projects'));
          props.dispatch(updateIsStarted(true));

          const tl = new TimelineMax();
          tl.to(options, 1.6, {planeSpeed: 2, ease:'Power3.easeInOut'},0);
          tl.to(options, 3, {slideProgress:1, ease:'Power2.easeOut'},0);
          tl.to(logo.position, 2, {x:0, z: -20, ease:'Power2.easeInOut'},0);
          tl.to(rotateSpeed, 1.3, {value: .05, ease:'Power1.easeOut'},0);
          tl.to(plane.material, 1, {opacity: .3, ease:'Power1.easeOut'},0);
          tl.to(rotateSpeed, 1.3, {value: .004, ease:'Power3.easeInOut'},1.3);
          tl.to(options, 1.6, {planeSpeed: .1, ease:'Power3.easeInOut'},1.3);
        }
      }
    };
    onClickFunction.current = {onClick};


    const backToHome = (page) => {
      if(page !== 'home'){
        props.dispatch(updatePage('home'));
        props.dispatch(updateIsStarted(false));
        props.dispatch(updateImageClickedIdx(null));
        props.dispatch(updateHideProjects(false));
        const tl = new TimelineMax();
        tl.to(options, 2, {slideProgress:0, ease:'Power3.easeOut'},0);
        tl.to(plane.material, 2, {opacity: 1, ease:'Power1.easeOut'},0);
        tl.to(logo.position, 2, {x:5, z: 20, ease:'Power2.easeInOut',
          onComplete:()=>{clicked = false;}
        },0);
        removeImage();
      }
    }
    backToHomeFunction.current = {backToHome};



    const onWindowResize = () => {
      // camera.left = -window.innerWidth / 2;
      // camera.right = window.innerWidth / 2;
      // camera.top = window.innerHeight / 2;
      // camera.bottom = -window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if(initedImage){
        resizeImage();
      }

      const screen = getScreenSize();
        screenWidth = screen.width;
        screenHeight = screen.height;
      };
      window.addEventListener("resize", onWindowResize);
      // document.addEventListener("click", onClick);

      return () => {
        window.removeEventListener("resize", onWindowResize);
        // document.removeEventListener("click", onClick);
      };
    },[canvasWrap]);


    useEffect(()=>{
      if(props.data)
        document.addEventListener("click", onClickFunction.current.onClick);
      return () => {
        document.removeEventListener("click", onClickFunction.current.onClick);
      };
    },[props.data])
    

    // when clicked image
    useEffect(()=>{
      updateImageEffectFunction.current.imageEffect(props.imageClickedIdx);
    },[props.imageClickedIdx]);


    // when updated category or language
    useEffect(()=>{
      if(props.projectItems && props.imageClickedIdx === null && props.page === 'projects'){
        const idx = props.data['projects'].categories.findIndex(v => v.slug === props.category);

        removeImageFunction.current.removeImage();
        initImageFunction.current.initImage( idx < 0 ? 0 : idx, props.projectItems, props.projectItems.length);
      }
    },[props.projectItems]);

    useEffect(()=>{
      if(prevProps){
        if(prevProps.page !== 'projects' && props.page === 'projects'){
          updateStopEaseFunction.current.stopEase();
        }
      }
    },[props.page])

    useEffect(()=>{
      if(props.isHideProjects){
        removeImageFunction.current.removeImage();
      }
    },[props.isHideProjects])

    useEffect(()=>{
      backToHomeFunction.current.backToHome(props.page);
    },[props.lang])

    return <div ref={canvasWrap} id="canvasWrap" />
  };

  const mapStateToProps = state => {
    return {
      lang: state.lang,
      isStarted: state.isStarted,
      data: state.data ? state.data[state.lang] : null,
      projectItems: state.projectItems,
      category: state.category,
      imageClickedIdx: state.imageClickedIdx,
      page: state.page,
      isHideProjects: state.isHideProjects
    };
};

export default connect(mapStateToProps)(ThreejsBg);
