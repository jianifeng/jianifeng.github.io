/*
 * This is a recreation of @jackrugile's
 * pen http://codepen.io/jackrugile/full/aCzHs/
 *
 */



		// canvas settings //

var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext('2d'),
    
    // parameters //
    
    TotalOrbitals = 100,
    Speed = 65,
    Scale = 1,
    RadiusJitter =
    HueJitter = 0,
    ClearAlpha = 10,
    ToggleOrbitals = true,
    OrbitalAlpha = 100,
    ToggleLight = true,
    LightAlpha = 5,
    Clear = reset,
    
    // other values //
    
    orbitals = [],
    tau = Math.PI * 2,
    center = { x: w/2, y: h/2 },
    colorTemplate = 'hsla(hue, 80%, 50%, alp)',
    orbitalColorTemplate,
    lightColorTemplate,
    mouseDown = false,
    gui = new dat.GUI(),
    params = [ 'TotalOrbitals', 'Speed', 'Scale', 'RadiusJitter', 'HueJitter', 'ClearAlpha', 'ToggleOrbitals', 'OrbitalAlpha', 'ToggleLight', 'LightAlpha', 'Clear' ],
    G = new GUI();
    
    // functions //

function init() {
  
  setupGUI();
  inputInitialOrbits();
  redraw();
  loop();
}

function loop() {
  
  window.requestAnimationFrame( loop );
  
  reassignFromGUI();
  updateTemplates();
  update();
  draw();
}

			// init functions //

function setupGUI() {
  gui.add( G, 'TotalOrbitals' )
    .name( 'Total Orbitals' );
  gui.add( G, 'Speed', -300, 300 );
  gui.add( G, 'Scale', .5, 5 );
  gui.add( G, 'RadiusJitter', 0, 5 )
    .name( 'Radius Jitter' );
  gui.add( G, 'HueJitter', 0, 90 )
    .name( 'Hue Jitter' );
  gui.add( G, 'ClearAlpha', 0, 100 )
    .name( 'Clear Alpha' );
  gui.add( G, 'ToggleOrbitals' )
    .name( 'Toggle Orbitals' );
  gui.add( G, 'OrbitalAlpha', 0, 100 )
  	.name( 'Orbital Alpha' );
  gui.add( G, 'ToggleLight' )
  	.name( 'Toggle Light' );
  gui.add( G, 'LightAlpha', 0, 100 )
  	.name( 'Light Alpha' );
  gui.add( G, 'Clear' );
  
  guiContainer.appendChild( gui.domElement );
}

function inputInitialOrbits() {
  
  for( var i = 0; i < TotalOrbitals; ++i ) {
    
    orbitals.push( new Orbital( Math.random() * tau, i * 3 ) );
  }
}

function redraw() {
  
  ctx.fillStyle = '#222';
  ctx.fillRect( 0, 0, w, h );
}
		
		// loop functions //

function reassignFromGUI() {
  
  G.TotalOrbitals = orbitals.length;
  gui.__controllers[0].updateDisplay();
  
  for( var i = 1; i < params.length - 2; ++i ) {
    window[ params[ i ] ] = G[ params[ i ] ];
  }
}

function updateTemplates() {
  
  orbitalColorTemplate = colorTemplate.replace( 'alp', OrbitalAlpha / 100 );
  lightColorTemplate = colorTemplate.replace( 'alp', LightAlpha / 100 );
}

function update() {
  
  orbitals.map( function( orb ) {
    orb.update();
  } );
}

function draw() {
  
  ctx.fillStyle = 'rgba(0, 0, 0, alp)'
    .replace( 'alp', ClearAlpha / 100 );
  ctx.fillRect( 0, 0, w, h );
  
  ctx.globalCompositeOperation = 'lighter';
  ctx.translate( center.x, center.y );
  orbitals.map( function( orb ) {
    orb.draw();
  } );
  ctx.translate( -center.x, -center.y );
  ctx.globalCompositeOperation = 'source-over';
}

function reset() {
  
  orbitals.length = 0;
}

		// GUI constructor //

function GUI() {
  
  for( var i = 0; i < params.length; ++i)
    this[ params[ i ] ] = window[ params[ i ] ];
}

		// click handler //

c.addEventListener( 'mousedown', function(e) {
  
  mouseDown = true;
  inject( e );
  
} );
c.addEventListener( 'mousemove', inject );
c.addEventListener( 'mouseup', function() {
  
  mouseDown = false;
} );

function inject( e ) {
  
  if( !mouseDown ) return false;
  
  var x = e.clientX - center.x,
      y = e.clientY - center.y,
      radius = Math.sqrt( x*x + y*y ),
      radiant = x < 0 ? Math.atan( y/x ) + Math.PI : Math.atan( y/x );
  
  orbitals.push( new Orbital( radiant, radius ) );
}

		// finally, the orbital constructor //

function Orbital( radiant, radius ) {
  
  this.rad = radiant;
  this.r = radius;
  
  this.speed = ( Math.random() / 4 + .75 ) / 20;
}

Orbital.prototype.update = function() {
  
  this.rad += this.speed * Speed / 100;
  this.rad %= tau;
}

Orbital.prototype.draw = function() {
  
  var radius = ( this.r + variation( RadiusJitter ) ) * Scale,
      hue = ( this.rad / tau ) * 360 + variation( HueJitter );
  
  if( ToggleOrbitals ) {
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = orbitalColorTemplate.replace( 'hue', hue );
    ctx.beginPath();
    ctx.arc( 0, 0, radius, this.rad - this.speed * 1.2, this.rad );
    ctx.stroke();
  }
  
  if( ToggleLight ) {
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = lightColorTemplate.replace( 'hue', hue );
    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( Math.cos( this.rad ) * radius, Math.sin( this.rad ) * radius );
    ctx.stroke();
  }
}

function variation( value ) {
  
  //just a quick utility function
  return Math.random() * value - value / 2;
}


		// and here we go! //

init();

		// just for good measure //

window.addEventListener( 'resize', function() {
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  redraw();
  
  center.x = w / 2;
  center.y = h / 2;
} );