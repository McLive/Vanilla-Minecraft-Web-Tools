<!--
3-D Minecraft Skin Viewer
By Kent Rasmussen @ earthiverse.ath.cx
Using Three.Js HTML5 3D Engine from https://github.com/mrdoob/three.js/
Add ?user=USERNAME to render a specific username
Add &refresh to re-grab the skin and generate new parts

edited by eder.alexan
-->
<?php include('backend/backend.php');
if(!isset($user)) $user = mugiwaraboy;
if(isset($refresh)) minecraft_skin_delete($user);
minecraft_skin_download($user);
if(!isset($fancybox) || $fancybox == false) {
	echo '<script type="text/javascript" src="/js/jquery.1.7.2.min.js"></script>';
	echo '<link rel="stylesheet" type="text/css" href="/css/default.css"/>';
}
?>

<script type="text/javascript" src="/skin/backend/resources/3d/Three.js"></script>
<script type="text/javascript" src="/skin/backend/resources/3d/Cube.js"></script>
<script type="text/javascript" src="/skin/backend/resources/3d/ImageUtils.js"></script>
<script type="text/javascript" src="/skin/backend/resources/3d/RequestAnimationFrame.js"></script>

<div id="skin">
<div>
	<div class="button" id="skinButton">
		<span><span>||</span></span>
	</div>
</div>
</div>
<div id="playercard">
	<ul>
		<li id="username"><?php echo $user; ?></li>
		<li id="health"><img class="heart" id="heart1" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart2" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart3" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart4" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart5" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart6" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart7" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart8" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart9" src="/images/mc_icons/heart_empty.png"/><img class="heart" id="heart10" src="/images/mc_icons/heart_empty.png"/></li>
		<li id="hunger"><img class="food" id="food1" src="/images/mc_icons/food_empty.png"/><img class="food" id="food2" src="/images/mc_icons/food_empty.png"/><img class="food" id="food3" src="/images/mc_icons/food_empty.png"/><img class="food" id="food4" src="/images/mc_icons/food_empty.png"/><img class="food" id="food5" src="/images/mc_icons/food_empty.png"/><img class="food" id="food6" src="/images/mc_icons/food_empty.png"/><img class="food" id="food7" src="/images/mc_icons/food_empty.png"/><img class="food" id="food8" src="/images/mc_icons/food_empty.png"/><img class="food" id="food9" src="/images/mc_icons/food_empty.png"/><img class="food" id="food10" src="/images/mc_icons/food_empty.png"/></li>
		<li id="xpbar"><span id="level"></span></li>
		<li id="dimension"></li>
	</ul>
<div>

<script type="text/javascript">
 $.getJSON('/mc_data/player/getPlayerInfo.php?player=<?php echo $user; ?>', function (data) {
	var dim = "Overworld";
	if(data.Dimension == -1)
		dim = "Nether";
	else if(data.Dimension == 1)
		dim = "End";
	$('#dimension').css('backgroundImage','url(/images/mc_icons/dim_' + data.Dimension +'.png)')
				   .text(dim);
	
	$('#dimension').attr("src", "/images/mc_icons/dim_" + data.Dimension +".png");
	$('#level').text(data.XpLevel);
	var hunger = data.foodLevel;
	for (var i = 10; i >= 1; i--) {
		hunger = hunger - 2;
		if(hunger > 0)
			$('#food' + i).attr('src', '/images/mc_icons/food_full.png');
		else if(hunger == -1) {
			$('#food' + i).attr('src', '/images/mc_icons/food_half.png');
			break;
		} else {
			$('#food' + i).attr('src', '/images/mc_icons/food_full.png');
			break;
		}
			
	}
	var health = data.Health;
	for (var i = 1; i <= 10; i++) {
		health = health - 2;
		if(health > 0)
			$('#heart' + i).attr('src', '/images/mc_icons/heart_full.png');
		else if(health == -1) {
			$('#heart' + i).attr('src', '/images/mc_icons/heart_half.png');
			break;
		} else {
			$('#heart' + i).attr('src', '/images/mc_icons/heart_full.png');
			break;
		}
			
	}
});
	
  var camera, scene, renderer;
  var xvarX = 0;
  var xvarY  = 0;
  var targetRotationX = 0;
  var targetRotationXOnMouseDown = 0;
  var targetRotationY = 0;
  var targetRotationYOnMouseDown = 0;
  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var mouseY = 0;
  var mouseYOnMouseDown = 0;
  var windowHalfX = 200 / 2;
  var windowHalfY = 200 / 2;
  var animation;
 init();

 var rotation_loop = setInterval( loop, 25);
 function init() {
  camera = new THREE.Camera(20, 200 / 200, 1, 1000);
  scene = new THREE.Scene();

  var head_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_left.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_right.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/head_front.png')})];

  head = new THREE.Mesh( new Cube(8, 8, 8, 1, 1, head_materials), new THREE.MeshFaceMaterial());
  head.position.x = 0;
  head.position.y = 0;
  head.position.z = 0;
  scene.addObject(head);

  var body_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_right.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_left.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/body_front.png')})];

  body = new THREE.Mesh( new Cube(8, 12, 4, 1, 1, body_materials), new THREE.MeshFaceMaterial());
  body.position.x = 0;
  body.position.y = -10;
  body.position.z = 0;
  scene.addObject(body);

  var arm_left_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_inner.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_outer.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_left_front.png')})];

  arm_left = new THREE.Mesh( new Cube(4, 12, 4, 1, 1, arm_left_materials), new THREE.MeshFaceMaterial());
  arm_left.position.x = 6;
  arm_left.position.y = -10;
  arm_left.position.z = 0;
  scene.addObject(arm_left);

  var arm_right_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_outer.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_inner.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/arm_right_front.png')})];

  arm_right = new THREE.Mesh( new Cube(4, 12, 4, 1, 0, arm_right_materials), new THREE.MeshFaceMaterial());
  arm_right.position.x = -6;
  arm_right.position.y = -10;
  arm_right.position.z = 0;
  scene.addObject(arm_right);

  var leg_left_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_inner.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_outer.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_left_front.png')})];

  leg_left = new THREE.Mesh( new Cube(4, 12, 4, 1, 1, leg_left_materials), new THREE.MeshFaceMaterial());
  leg_left.position.x = 2;
  leg_left.position.y = -22;
  leg_left.position.z = 0;
  leg_left.rotation.y = 180 * Math.PI;
  scene.addObject(leg_left);

  var leg_right_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_outer.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_inner.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/leg_right_front.png')})];

  leg_right = new THREE.Mesh( new Cube(4, 12, 4, 1, 1, leg_right_materials), new THREE.MeshFaceMaterial());
  leg_right.position.x = -2;
  leg_right.position.y = -22;
  leg_right.position.z = 0;
  scene.addObject(leg_right);

  var hat_materials = [new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_right.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_left.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_top.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_bottom.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_back.png')}),new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('/skin/images/skins/<?php echo $user; ?>/hat_front.png')})];

  hat = new THREE.Mesh( new Cube(9, 9, 9, 1, 1, hat_materials), new THREE.MeshFaceMaterial());
  hat.position.x = 0;
  hat.position.y = 0;
  hat.position.z = 0;
  scene.addObject(hat);

  if(webgl()) {
     renderer = new THREE.WebGLRenderer();
  } else 
     renderer = new THREE.CanvasRenderer();
  renderer.setSize( 200, 200);
  document.getElementById('skin').appendChild( renderer.domElement );
 }


   function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationXOnMouseDown = targetRotationX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationYOnMouseDown = targetRotationY;
  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = targetRotationYOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.02;
  }

  function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
      targetRotationXOnMouseDown = targetRotationX;
      targetRotationYOnMouseDown = targetRotationY;
    }
  }

  function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationX = targetRotationXOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
      targetRotationY = targetRotationYOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.05;
    }
  }

  function animate() {
    animation = requestAnimationFrame( animate );
    loop();
  }
  

 function loop() {
  xvarX += Math.PI/90
  xvarY += Math.PI/90
  camera.target.position.x = 0;
  camera.target.position.y = -11;
  camera.target.position.z = 0;

  //Leg Swing
  leg_left.rotation.x = Math.cos(xvarX);
  leg_left.position.z = 0 - 6*Math.sin(leg_left.rotation.x);
  leg_left.position.y = -16 - 6*Math.abs(Math.cos(leg_left.rotation.x));
  leg_right.rotation.x = Math.cos(xvarX + (Math.PI));
  leg_right.position.z = 0 - 6*Math.sin(leg_right.rotation.x);
  leg_right.position.y = -16 - 6*Math.abs(Math.cos(leg_right.rotation.x));
  
  //Arm Swing
  arm_left.rotation.x = Math.cos(xvarX + (Math.PI));
  arm_left.position.z = 0 - 6*Math.sin(arm_left.rotation.x);
  arm_left.position.y = -4 - 6*Math.abs(Math.cos(arm_left.rotation.x));
  arm_right.rotation.x = Math.cos(xvarX);
  arm_right.position.z = 0 - 6*Math.sin(arm_right.rotation.x);
  arm_right.position.y = -4 - 6*Math.abs(Math.cos(arm_right.rotation.x));
  var drehX = xvarX;
  var drehY = xvarY;
  var drehZ = xvarX;
  if(!skinPlaying) {
	drehX = targetRotationX;
	drehY = targetRotationY;
	drehZ = targetRotationX;
  }
  camera.position.x = 0 - 100*Math.sin(drehX);
  camera.position.y = 0 - 30*Math.sin(drehY);
  camera.position.z = 0 - 100*Math.cos(drehZ);
  renderer.render( scene, camera );
 }
 var skinPlaying = true;
 $("#skinButton").click(function () {
			
	if(skinPlaying) {
		skinPlaying = false;
		clearInterval(rotation_loop);

		targetRotationX = xvarX;
		targetRotationY = xvarY;
		animate();
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false ); 
		$("#skinButton span span").text(">");
		
		
	} else {
		skinPlaying = true;
		xvarX = targetRotationX;
		xvarY = targetRotationY;
		rotation_loop = setInterval( loop, 25);
		document.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
		document.removeEventListener( 'touchmove', onDocumentTouchMove, false ); 
		cancelRequestAnimationFrame(animation);
		$("#skinButton span span").text("||");;
	}	
 });
 //from Detector.js from Three.js
 function webgl() { 
	try { 
		return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
	} catch( e ) { return false; } 
 }
</script>

