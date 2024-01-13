import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("c4")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
const light = new THREE.PointLight(0xffffff, 50);
const secondLight = new THREE.PointLight(0xffffff, 50);
const gltfLoader = new GLTFLoader();
const controls = new OrbitControls(camera, renderer.domElement);

controls.autoRotate = true;
controls.target.set(0, 0, 0);
light.position.set(0, 5, 0);
secondLight.position.set(-5, 5, -5);
camera.position.set(0, 2, 0);
scene.add(light);
scene.add(secondLight);
scene.add(camera);

gltfLoader.load(
  "niceroom.glb",
  function (gltf) {
    console.log(gltf);
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  },
);

function render(time: number) {
  time *= 0.001;
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
