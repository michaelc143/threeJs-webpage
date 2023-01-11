  import './style.css';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

  function setup() {
  const scene = new THREE.Scene();
  //args are fov, aspect ratio, near far
  const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  //setting the render size to the size of the given window
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.position.setZ(-0.1);



  //https://threejs.org/docs/index.html#api/en/geometries/TorusKnotGeometry
  const geometry1 = new THREE.BoxGeometry(5, 5, 5);
  const geometry2 = new THREE.BoxGeometry(3, 3, 3);
  //mesh for geometry, basic mesh requires no light source, standard mesh requires a light source
  const material = new THREE.MeshStandardMaterial( { color: 0xC5050C} );
  const cube = new THREE.Mesh(geometry1,material);
  const cube2 = new THREE.Mesh(geometry2,material);
  const cube3 = new THREE.Mesh(geometry1,material);
  const cube4 = new THREE.Mesh(geometry2,material);
  scene.add(cube, cube2, cube3, cube4);

  //lighting, ambient is all light, point light is just like a lightbulb
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  const pointLight = new THREE.PointLight(0xffffff);
  scene.add(pointLight, ambientLight);

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  // directionalLight.target = (15,4,10);
  directionalLight.target.x = 15;
  directionalLight.target.y = 4;
  directionalLight.target.z = 10;
  scene.add(directionalLight);
  directionalLight.position.x = 15;
  directionalLight.position.y = 6;
  directionalLight.position.z = 10;
  //orbit controls, allows user to interact with page by moving geometry with mouse drags
  const controls = new OrbitControls(camera, renderer.domElement);

  function addStars() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    //getting random number from 1 to 100 for positions
    const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x,y,z);
    scene.add(star);
  }
  //populating with 200 stars
  Array(200).fill().forEach(addStars);
  //setting background to this image
  const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
  scene.background = spaceTexture;

  const globeTexture = new THREE.TextureLoader().load('globe.jpeg');
  const globeNorm = new THREE.TextureLoader().load('globe-normal.jpeg');
  const globe = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({
        map: globeTexture,
        normalMap: globeNorm
      })
  );

  scene.add(globe);

  const loader = new FontLoader();

  loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    const geometryText = new TextGeometry( 'HELLO WORLD!', {
      font: font,
      size: 80,
      height: 5,
      width: 50,
      depth: 3,

    } );

    const materialText = new THREE.MeshStandardMaterial( { color: 0xC5050C} );
    const text = new THREE.Mesh(geometryText,materialText);
    scene.add(text);
    text.position.setZ(30);
    text.position.setX(15);
    text.position.setY(5);
  } );


  globe.position.setZ(30);
  globe.position.setX(-15);

  cube.position.setZ(10);
  cube.position.setX(15);

  cube2.position.setZ(10);
  cube2.position.setX(15);
  cube2.position.setY(4);

  cube3.position.setZ(10);
  cube3.position.setX(-15);

  cube4.position.setZ(10);
  cube4.position.setX(-15);
  cube4.position.setY(4);

  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    if(t >= 0)
      t = -1;

    camera.position.setZ(t * 0.1);
    // camera.position.setY(t * -0.1);
    // camera.position.setY(t * 0.002);
    // camera.position.setX(t * -0.0002);

  }

  document.body.onscroll = moveCamera


  //actually rendering the scene
  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.y -= 0.01;
    cube2.rotation.y += 0.01;
    cube3.rotation.y += 0.01;
    cube4.rotation.y -= 0.01;
    // cube.rotation.y += 0.005;
    // cube.rotation.z += 0.01;
    globe.rotation.y+= 0.0075;

    controls.update();

    renderer.render(scene,camera);
  }

  animate();
  }
window.onload = setup;