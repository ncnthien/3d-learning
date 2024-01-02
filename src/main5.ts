import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import "./index.css";

const canvas = document.getElementById("c5") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
const scene = new THREE.Scene();
const light = new THREE.PointLight(0xffffff, 500);
const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
controls.target.set(0, 0, 0);
controls.update();
camera.position.set(0, 0, 5);
light.position.set(0, 0, 5);
scene.add(light);
scene.add(camera);

const labelContainerElem = document.getElementById("labels") as HTMLDivElement;
function makeInstance(geometry, color, x, name) {
  console.log("makeInstance", geometry, color, x, name);
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  const elem = document.createElement("div");
  elem.textContent = name;
  labelContainerElem.appendChild(elem);
  return { cube, elem };
}
const cubes = [
  makeInstance(geometry, 0x44aa88, 0, "Aqua Colored Box"),
  makeInstance(geometry, 0x8844aa, -2, "Purple Colored Box"),
  makeInstance(geometry, 0xaa8844, 2, "Gold Colored Box"),
];

const tempVector = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

function render(time: number) {
  time *= 0.001;
  controls.update();
  cubes.forEach((cubeInfo, ndx) => {
    const { cube, elem } = cubeInfo;
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
    cube.updateWorldMatrix(true, false);
    cube.getWorldPosition(tempVector);
    tempVector.project(camera);
    // ask the raycaster for all the objects that intersect
    // from the eye toward this object's world position
    raycaster.setFromCamera(tempVector, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children);
    // We're visible if the first intersection is this object.
    const show =
      intersectedObjects.length && intersectedObjects[0].object === cube;

    if (!show || Math.abs(tempVector.z) > 1) {
      elem.style.display = "none";
    } else {
      elem.style.display = "";
      const x = (tempVector.x * 0.5 + 0.5) * canvas.clientWidth;
      const y = (tempVector.y * -0.5 + 0.5) * canvas.clientHeight;
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      elem.style.zIndex = (-tempVector.z * 0.5 + 0.5) * 100000 || 0;
    }
  });
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
