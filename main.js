import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Perlin from "./src/perlin.js";


// camera
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0,300,50)

// scene
const scene = new THREE.Scene();

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement)

var geometry = new THREE.PlaneGeometry(10000, 10000, 512, 512);
var material = new THREE.MeshLambertMaterial({color:0x555555});
var terrain = new THREE.Mesh(geometry, material);
terrain.rotateX(-Math.PI/2)
scene.add(terrain)

const perlin = new Perlin()

const smoothing = 2000;
var peak = 400;
var vertices = terrain.geometry.attributes.position.array
for(var i=0;i<=vertices.length; i+=3)
{
  vertices[i+2] = peak * perlin.noise(
      vertices[i]/smoothing , 
      vertices[i+1]/smoothing
);
}
terrain.geometry.attributes.position.needsUpdate = true
terrain.geometry.computeVertexNormals();

// light
const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)
const directionLight = new THREE.DirectionalLight()
directionLight.lookAt(terrain)
scene.add(directionLight)

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  camera.position.z += 1
}
animate();