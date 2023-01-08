import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
//args are fov, aspect ratio, near far
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
//setting the render size to the size of the given window
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);

//https://threejs.org/docs/index.html#api/en/geometries/TorusKnotGeometry
const geometry = new THREE.TorusKnotGeometry(10,3,100,16);
//mesh for geometry, basic mesh requires no light source, standard mesh requires a light source
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347} );
const torusKnot = new THREE.Mesh(geometry,material);
scene.add(torusKnot);

//lighting, ambient is all light, point light is just like a lightbulb
const ambientLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight, ambientLight);

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

globe.position.setZ(30);
globe.position.setX(-10);

torusKnot.position.setZ(200);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.setZ(t * -0.01);
  camera.position.setY(t * -0.0002);
  camera.position.setX(t * -0.0002);

}

document.body.onscroll = moveCamera


//actually rendering the scene
function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.01;
  globe.rotation.x += 0.05;
  globe.rotation.y+= 0.075;
  globe.rotation.z += 0.05;

  controls.update();

  renderer.render(scene,camera);
}

animate();