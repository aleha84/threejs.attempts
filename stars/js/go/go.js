var Stars = {};

Stars.GO = function(init){
	this.obj = init.obj;
	this.alive = true;
	scene.add(this.obj);
}

Stars.GO.visibleRange = 2000;

Stars.GO.prototype = {
	constructor: Stars.GO,

	setDead : function(){
		this.alive = false;
		scene.remove(this.obj);
	},

	changeVisibility : function(){
		this.obj.visible = this.obj.position.distanceTo(camera.position) <= Stars.GO.visibleRange;
	},

	update : function(){
		this.changeVisibility();
	},
}