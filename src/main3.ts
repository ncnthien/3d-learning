import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("c3")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const light = new THREE.PointLight(0xffffff, 500);
const targetVector = new THREE.Vector3(0, 1.65, 0);
camera.position.set(0, 2, 2);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(targetVector.x, targetVector.y, targetVector.z);
const objects = [];

function moveToHead() {
  new TWEEN.Tween(camera.position).to({ x: 0, y: 1.65, z: 0.5 }, 1000).start();
}

function lookAtFeet() {
  new TWEEN.Tween(controls.target).to({ x: 0, y: 0, z: 0 }, 1000).start();
}

light.position.set(10, 0, 0);
scene.add(light);
renderer.render(scene, camera);
gltfLoader.load(
  "/658e81be0ff72a263151aa70.gltf",
  function (object: THREE.Object3D) {
    console.log(object);
    objects.push(object.scene);
    const grid = new THREE.GridHelper(10, 10);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    object.scene.add(grid);

    scene.add(object.scene);
  },
);

function render(time: number) {
  time *= 0.001;
  renderer.render(scene, camera);
  // objects.forEach((obj) => {
  //   obj.rotation.y = time;
  // });
  controls.update();
  TWEEN.update();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

const button = document.querySelector("#movetohead")!;
button.addEventListener("click", moveToHead);
const moveToFeet = document.querySelector("#movetofeet")!;
moveToFeet.addEventListener("click", lookAtFeet);
