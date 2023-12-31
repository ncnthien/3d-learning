import * as THREE from "three";

const canvas = document.querySelector("#c")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const scene = new THREE.Scene();
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);

camera.position.z = 120;
renderer.render(scene, camera);
light.position.set(-1, 2, 4);
scene.background = new THREE.Color(0xaaaaaa);
scene.add(light);

function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
}

const cubes = [
  makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];

function render(time: number) {
  time *= 0.001; // convert time to seconds
  renderer.render(scene, camera);

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
