import { ACESFilmicToneMapping, AmbientLight, BufferGeometry, Color, CylinderGeometry, DirectionalLight, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, TorusGeometry, TubeGeometry, CatmullRomCurve3, Vector3, WebGLRenderer, DoubleSide } from "three";

export function createDressScene(host: HTMLElement) {
 const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
 renderer.toneMapping = ACESFilmicToneMapping;
 renderer.toneMappingExposure = .9;
 renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
 renderer.setClearColor(new Color("#f2d8df"), 0);
 renderer.domElement.setAttribute("aria-hidden", "true");
 host.appendChild(renderer.domElement);
 const scene = new Scene();
 const camera = new PerspectiveCamera(35, 1, .1, 30);
 camera.position.set(0, 2.2, 7);
 camera.lookAt(0, 1.65, 0);
 scene.add(new AmbientLight("#fff8f5", 1.3));
 const key = new DirectionalLight("#fff8f5", 2.5); key.position.set(3, 5, 4); scene.add(key);
 const rim = new DirectionalLight("#db93b0", 1.4); rim.position.set(-3, 3, -2); scene.add(rim);
 const gown = new Group(); scene.add(gown);
 const satin = new MeshStandardMaterial({ color: "#fff1e2", roughness: .48, metalness: .08, side: DoubleSide });
 const trim = new MeshStandardMaterial({ color: "#dbbfa7", roughness: .6, metalness: .15 });
 const pedestalMaterial = new MeshStandardMaterial({ color: "#d6b3bf", roughness: .85 });
 const pedestal = new Mesh(new CylinderGeometry(1.45, 1.5, .14, 64), pedestalMaterial); pedestal.position.y = .12; scene.add(pedestal);
 function surface(rows: number, columns: number, position: (t: number, a: number) => [number, number, number]) {
  const vertices: number[] = [], indices: number[] = [];
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) vertices.push(...position(row / rows, col / columns * Math.PI * 2));
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
   const a = row * (columns + 1) + col, b = a + columns + 1;
   indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new BufferGeometry(); geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const mesh = new Mesh(geometry, satin); gown.add(mesh); return mesh;
 }
 surface(22, 96, (t, a) => {
  const radius = .255 + 1.01 * Math.pow(1 - t, 1.2);
  const fold = Math.cos(a * 16) * .047 * Math.pow(1 - t, .7);
  const train = Math.max(0, -Math.sin(a)) * .12 * Math.pow(1 - t, 2);
  return [Math.cos(a) * (radius + fold), .23 + t * 1.91, Math.sin(a) * (radius + fold + train)];
 });
 surface(18, 64, (t, a) => {
  const radius = .255 + .145 * Math.sin(t * Math.PI * .7);
  const front = Math.max(0, Math.sin(a));
  const sweetheart = .08 * Math.cos(Math.cos(a) * Math.PI * 2) * front;
  return [Math.cos(a) * radius, 2.14 + t * (.63 - sweetheart - .13 * Math.max(0, -Math.sin(a))), Math.sin(a) * radius * .72];
 });
 for (const side of [-1, 1]) {
  const curve = new CatmullRomCurve3([new Vector3(side * .29, 2.7, .19), new Vector3(side * .3, 3.02, .02), new Vector3(side * .29, 2.66, -.2)]);
  gown.add(new Mesh(new TubeGeometry(curve, 20, .022, 6, false), satin));
 }
 const belt = new Mesh(new TorusGeometry(.263, .012, 6, 64), trim); belt.rotation.x = Math.PI / 2; belt.scale.y = .75; belt.position.y = 2.14; gown.add(belt);
 // Small covered buttons down the back; no textures or remote model files.
 for (let i = 0; i < 8; i++) {
  const button = new Mesh(new CylinderGeometry(.011, .011, .012, 6), trim); button.rotation.x = Math.PI / 2; button.position.set(0, 2.2 + i * .047, -.23 - i * .004); gown.add(button);
 }
 let rotation = -.28;
 let visible = true;
 let disposed = false;
 function render() { if (!disposed && visible && !document.hidden) renderer.render(scene, camera); }
 function resize() {
  const { width, height } = host.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); render();
 }
 function rotate(delta: number) { rotation += delta; gown.rotation.y = rotation; host.dataset.rotation = rotation.toFixed(3); render(); }
 gown.rotation.y = rotation;
 const observer = new ResizeObserver(resize); observer.observe(host);
 const resume = () => render(); document.addEventListener("visibilitychange", resume);
 resize();
 return {
  rotate,
  setVisible(value: boolean) { visible = value; if (value) render(); },
  dispose() {
   disposed = true; observer.disconnect(); document.removeEventListener("visibilitychange", resume);
   scene.traverse(object => { if (object instanceof Mesh) object.geometry.dispose(); });
   satin.dispose(); trim.dispose(); pedestalMaterial.dispose(); renderer.dispose(); renderer.domElement.remove();
  }
 };
}
