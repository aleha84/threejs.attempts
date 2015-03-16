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
	sphere.position.set(0, 50, -50);
	scene.add(sphere);

	THREE.ImageUtils.crossOrigin = '';
	var floorTexture = THREE.ImageUtils.loadTexture('http://stemkoski.github.io/Three.js/images/checkerboard.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(10,10);
	var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(1000,1000,1,1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = Math.PI / 2;
	floor.position.y = -0.5;
	scene.add(floor);

	var skyBoxGeometry = new THREE.CubeGeometry(10000,10000,10000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide});
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

	scene.add(skyBox);

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
	if(gos.length < 20)
	{
		var cubeSize = getRandom(5,10);
		var cubeFallSpeed = getRandom(0,1);
		var axisRotationSpeeds = [
			getRandom(-0.1,0.1),
			getRandom(-0.1,0.1),
			getRandom(-0.1,0.1)
		]
		gos.push(new GO(createCube(cubeSize,cubeSize,cubeSize,getRandom(-200,200),100,getRandom(-200,200)),function(){
			this.obj.position.y-=cubeFallSpeed;
			this.obj.rotation.x += axisRotationSpeeds[0];
			this.obj.rotation.y += axisRotationSpeeds[1];
			this.obj.rotation.z += axisRotationSpeeds[2];
			if(this.obj.position.y < 0)
			{
				this.setDead();
			}
		}));
	}
	rotateCamera();
	var i = gos.length;
	while (i--) {
		gos[i].update();
		if(!gos[i].alive){
			var deleted = gos.splice(i,1);
		}
	}
}

var cameraAngleY = 0.005;
var cameraYangle = 0;
function rotateCamera()
{
	var m = new THREE.Matrix3();
	m.set(Math.cos(cameraAngleY),0,Math.sin(cameraAngleY), 0,1,0, -Math.sin(cameraAngleY),0, Math.cos(cameraAngleY));
	camera.position.applyMatrix3(m);
	camera.position.y = cameraDefaultY + 50*Math.sin(cameraYangle+=0.05);
	camera.lookAt(scene.position);
	//cameraAngleZ+=0.01;
}

function createCube(width,height,depth, x,y,z)
{
	var cubeMaterialArray = [];
	var newCube;
	// order to add materials: x+,x-,y+,y-,z+,z-
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: getRandomColor(true) } ) );
	var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
	// Cube parameters: width (x), height (y), depth (z), 
	//        (optional) segments along x, segments along y, segments along z
	var cubeGeometry = new THREE.CubeGeometry( width, height, depth, 1, 1, 1 );
	// using THREE.MeshFaceMaterial() in the constructor below
	//   causes the mesh to use the materials stored in the geometry
	var newCube = new THREE.Mesh( cubeGeometry, cubeMaterials );
	newCube.position.set(x,y,z);//-100, 50, -50);
	return newCube;
}

function getRandom(min, max){
	return Math.random() * (max - min) + min;
}

function getRandomColor(asInt) {
	if(asInt === undefined)
	{
		asInt = false;
	}

    var letters = '0123456789ABCDEF'.split('');
    var color = asInt? '' : '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return asInt? parseInt(color,16) : color;
}

var GO = function(obj, updateCallback) {
	this.alive = true;
	this.obj = obj;
	scene.add(this.obj);
	var that = this;
	this.update = function(){
		if(this.alive){
			updateCallback.call(that);	
		}
	}

	this.setDead = function(){
		this.alive = false;
		scene.remove(this.obj);
	}

}