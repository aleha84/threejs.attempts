var scene, camera, renderer;
var cameraDefaultY = 150;
var gos = [];
function init () {
	scene = new THREE.Scene();
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,cameraDefaultY,400);
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	document.body.appendChild(renderer.domElement);

	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);

	var sphereGeometry = new THREE.SphereGeometry(50,32,16);
	var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x8888ff });
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(0, 0, 0);
	
	gos.push(new Stars.Star({obj : sphere}));

	var sphereGeometry = new THREE.SphereGeometry(50,32,16);
	var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x8888ff });
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(0, 0, -1000);
	gos.push(new Stars.Star({obj : sphere}));

	animate();
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function render() 
{	
	renderer.render( scene, camera );
}

function update()
{
	var i = gos.length;
	while (i--) {
		gos[i].update();
		if(!gos[i].alive){
			var deleted = gos.splice(i,1);
		}
	}
}

