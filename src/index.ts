import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  Color4,
  AmmoJSPlugin,
  MeshBuilder,
  PhysicsImpostor,
  Mesh,
  VertexData,
  PBRMetallicRoughnessMaterial,
  Color3,
  ArcRotateCamera,
  HDRCubeTexture,
} from "babylonjs"
import Ammo from "ammojs-typed"
import { createSpiralTube } from "./tube"
import envHdr from "./environment.hdr"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

const scene = new Scene(engine)
const camera = new ArcRotateCamera("camera1", 0, Math.PI / 2, 5, Vector3.Zero(), scene)
camera.setTarget(Vector3.Zero())
camera.attachControl(canvas, false)
new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

const gravity = new Vector3(0, -9.81, 0)
const ammo = await Ammo()
const physicsPlugin = new AmmoJSPlugin(true, ammo)
scene.enablePhysics(gravity, physicsPlugin)

scene.clearColor = new Color4(0, 0, 0, 0)

const spring = new Mesh("spring", scene)
spring.position.set(0, 0, 0)
const springMaterial = new PBRMetallicRoughnessMaterial("standard", scene)
springMaterial.roughness = 0.6
springMaterial.metallic = 0.9
springMaterial.baseColor = new Color3(1.0, 0.8, 0.3)
springMaterial.environmentTexture = new HDRCubeTexture(envHdr, scene, 512)
spring.material = springMaterial

const springGeometry = createSpiralTube(1, 0.1, 3, 0.1, 100, 30)
const positions = [] as number[]
springGeometry.points.forEach((p) => {
  return positions.push(p.x, p.y, p.z)
}, [] as number[])
const indices = [] as number[]
springGeometry.triangles.forEach((t) => {
  return indices.push(t[0], t[1], t[2])
}, [] as number[])
const normals = [] as number[]
VertexData.ComputeNormals(positions, indices, normals)

const vertexData = new VertexData()
vertexData.positions = positions
vertexData.indices = indices
vertexData.normals = normals
vertexData.applyToMesh(spring)
spring.physicsImpostor = new PhysicsImpostor(spring, PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9 }, scene) 

const box = MeshBuilder.CreateSphere("sphere", { diameter: 1 })
box.position.set(0, 0, 0)
box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.SphereImpostor, { mass: 100, restitution: 0.1 })
const boxMaterial = new PBRMetallicRoughnessMaterial("standard", scene)
boxMaterial.roughness = 0.3
boxMaterial.metallic = 0.8
boxMaterial.baseColor = new Color3(0.6, 0.6, 0.6)
boxMaterial.environmentTexture = new HDRCubeTexture(envHdr, scene, 512)
box.material = boxMaterial

let t = 0
const dt = 0.01
let dr = 0.01
engine.runRenderLoop(function() {
  spring.rotate(new Vector3(0, 0, 1), dr)
  scene.render()
  t += dt
})

window.addEventListener("resize", function() {
  engine.resize()
})