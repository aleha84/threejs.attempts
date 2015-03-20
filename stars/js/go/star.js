Stars.Star = function  (init) {
	Stars.GO.call(this,init);	
}

Stars.Star.prototype = Object.create( Stars.GO.prototype );
Stars.Star.prototype.constructor = Stars.Star;