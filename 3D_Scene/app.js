const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 8
camera.position.y = 5
camera.position.z = 15
scene.add(camera)

//Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.zoomSpeed = 1.2
controls.enablePan = false
controls.minDistance = 3
controls.maxDistance = 30
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI
controls.minAzimuthAngle = -Infinity
controls.maxAzimuthAngle = Infinity
controls.rotateSpeed = 1.0
controls.target.set(0, 2, 0)

// Éclairage
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(5, 10, 7)
directionalLight.castShadow = true
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight2.position.set(-5, 3, -5)
scene.add(directionalLight2)

const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
backLight.position.set(0, 2, -10)
scene.add(backLight)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

//Loader
const loader = new THREE.GLTFLoader()
loader.load('assets/model_t.glb',
    (gltf) => {
        const model = gltf.scene
        
        // Activer les ombres sur le modèle
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        
        scene.add(model)
        console.log('Modèle chargé avec succès')
        
        // Ajuster la cible des contrôles à la taille du modèle
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        controls.target.copy(center)
    },
    ( xhr ) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
    },
    (error) => {
        console.error('Erreur de chargement:', error)
    }
)

// Ajouter un repère visuel (optionnel - peut être supprimé si non désiré)
// const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444)
// gridHelper.position.y = 0
// scene.add(gridHelper)

// Axes helper (optionnel - pour le debug)
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animation
const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()