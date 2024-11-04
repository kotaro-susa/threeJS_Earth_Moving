import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

window.addEventListener("load", init);
function init() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 500);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  // ウィンドウのリサイズに応じてサイズを更新
  window.addEventListener("resize", () => {
    console.log("リサイズ");
    renderer.setSize(window.innerWidth, window.innerHeight);
    // カメラのアスペクト比を更新し、プロジェクションマトリックスを更新
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
  // テキスチャーを追加
  const textures = new THREE.TextureLoader().load("../../textures/earth.jpg");

  // 球体を作る
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // マテリアルを作成
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });
  // メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);
  // 並行光源を追加する
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 平行光源がどこにあるのかを追加
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    3
  );
  scene.add(directionalLightHelper);

  // ポイント光源を追加
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  pointLight.decay = 1;
  pointLight.power = 3000;
  scene.add(pointLight);

  // ポイント光源がどこにあるのかを特定
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウス操作を出来るようにする
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // ポイント光源を球の周りを巡回させる
  function animate() {
    pointLight.position.set(
      200 * Math.sin(Date.now() / 500),
      200 * Math.sin(Date.now() / 1000),
      200 * Math.cos(Date.now() / 500)
    );
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
