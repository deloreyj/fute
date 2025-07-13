import * as THREE from "three";

/**
 * Team types for player variations
 */
enum TeamType {
  SPORTING = "sporting",
  BENFICA = "benfica",
}

/**
 * Main game class for the soccer game
 */
class SoccerGame {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // Game objects
  private player: THREE.Mesh;
  private ball: THREE.Mesh;

  // Movement state
  private keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    b: false,
    t: false,
  };

  private lastKeys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    b: false,
    t: false,
  };

  // Player physics
  private playerVelocity = new THREE.Vector3();
  private playerOnGround = true;

  // Animation
  private animationTime = 0;

  // Current team
  private currentTeam = TeamType.SPORTING;

  constructor() {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const container = document.getElementById("game-container");
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    // Initialize game objects
    this.setupLighting();
    this.createField();
    this.player = this.createPlayer(TeamType.SPORTING);
    this.ball = this.createBall();

    // Set up controls
    this.setupControls();

    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Start game loop
    this.animate();
  }

  /**
   * Set up lighting for the scene
   */
  private setupLighting(): void {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);
  }

  /**
   * Create the soccer field
   */
  private createField(): void {
    // Create grass field
    const fieldGeometry = new THREE.BoxGeometry(40, 0.1, 60);
    const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.receiveShadow = true;
    this.scene.add(field);

    // Add white lines (simplified)
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Center line
    const centerLineGeometry = new THREE.BoxGeometry(0.2, 0.11, 60);
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.position.y = 0.05;
    this.scene.add(centerLine);

    // Center circle
    const centerCircleGeometry = new THREE.RingGeometry(5, 5.2, 32);
    const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.06;
    this.scene.add(centerCircle);
  }

  /**
   * Create the player model (low-poly style)
   */
  private createPlayer(teamType: TeamType): THREE.Mesh {
    const playerGroup = new THREE.Group();

    // Common colors
    const skinColor = 0xfad8b0; // Light warm tan
    const hairColor = 0x2a2a2a; // Dark brown/black
    const shoeGray = 0x555555;

    // Team-specific colors
    let shirtColors: number[] = [];
    let shortsColor: number;
    let sockPrimaryColor: number;
    let sockSecondaryColor: number;

    if (teamType === TeamType.SPORTING) {
      // Sporting CP colors
      shirtColors = [0x007a33, 0xffffff]; // Green and white stripes
      shortsColor = 0x000000; // Black
      sockPrimaryColor = 0x007a33; // Green
      sockSecondaryColor = 0xffffff; // White
    } else {
      // Benfica colors
      shirtColors = [0xd40000]; // Solid red
      shortsColor = 0xffffff; // White
      sockPrimaryColor = 0xd40000; // Red
      sockSecondaryColor = 0xffffff; // White
    }

    // Head (rounded cube for low-poly look)
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    // Round the corners slightly by manipulating vertices
    const headMaterial = new THREE.MeshLambertMaterial({
      color: skinColor,
      flatShading: true,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.4;
    head.castShadow = true;
    head.receiveShadow = true;
    playerGroup.add(head);

    // Hair (simple block on top of head)
    const hairGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const hairMaterial = new THREE.MeshLambertMaterial({
      color: hairColor,
      flatShading: true,
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 2.7;
    hair.castShadow = true;
    playerGroup.add(hair);

    // Torso (tapered cuboid - wider at shoulders)
    const torsoGroup = new THREE.Group();

    if (teamType === TeamType.SPORTING) {
      // Create horizontal stripes for Sporting
      const stripeHeight = 0.125;
      const stripeCount = 8;
      for (let i = 0; i < stripeCount; i++) {
        const stripeGeometry = new THREE.BoxGeometry(1.2, stripeHeight, 0.61);
        const stripeMaterial = new THREE.MeshLambertMaterial({
          color: i % 2 === 0 ? shirtColors[0] : shirtColors[1],
          flatShading: true,
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.y = 1.5 + (i - stripeCount / 2) * stripeHeight;
        stripe.castShadow = true;
        stripe.receiveShadow = true;
        torsoGroup.add(stripe);
      }
    } else {
      // Solid color shirt for Benfica
      const torsoGeometry = new THREE.BoxGeometry(1.2, 1.0, 0.6);
      const torsoMaterial = new THREE.MeshLambertMaterial({
        color: shirtColors[0],
        flatShading: true,
      });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = 1.5;
      torso.castShadow = true;
      torso.receiveShadow = true;
      torsoGroup.add(torso);

      // White collar/trim for Benfica
      const collarGeometry = new THREE.BoxGeometry(1.21, 0.1, 0.61);
      const collarMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        flatShading: true,
      });
      const collar = new THREE.Mesh(collarGeometry, collarMaterial);
      collar.position.y = 2.0;
      torsoGroup.add(collar);
    }

    playerGroup.add(torsoGroup);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const armMaterial = new THREE.MeshLambertMaterial({
      color: skinColor,
      flatShading: true,
    });

    // Left arm
    const leftArm = new THREE.Group();
    const leftUpperArm = new THREE.Mesh(armGeometry, armMaterial);
    leftUpperArm.position.set(-0.75, 1.6, 0);
    leftUpperArm.castShadow = true;
    leftUpperArm.receiveShadow = true;
    leftArm.add(leftUpperArm);
    playerGroup.add(leftArm);

    // Right arm
    const rightArm = new THREE.Group();
    const rightUpperArm = new THREE.Mesh(armGeometry, armMaterial);
    rightUpperArm.position.set(0.75, 1.6, 0);
    rightUpperArm.castShadow = true;
    rightUpperArm.receiveShadow = true;
    rightArm.add(rightUpperArm);
    playerGroup.add(rightArm);

    // Hands (mitt blocks)
    const handGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const leftHand = new THREE.Mesh(handGeometry, armMaterial);
    leftHand.position.set(-0.75, 1.1, 0);
    leftHand.castShadow = true;
    playerGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, armMaterial);
    rightHand.position.set(0.75, 1.1, 0);
    rightHand.castShadow = true;
    playerGroup.add(rightHand);

    // Shorts
    const shortsGeometry = new THREE.BoxGeometry(1.0, 0.4, 0.5);
    const shortsMaterial = new THREE.MeshLambertMaterial({
      color: shortsColor,
      flatShading: true,
    });
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.y = 0.8;
    shorts.castShadow = true;
    shorts.receiveShadow = true;
    playerGroup.add(shorts);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.7, 0.3);

    // Left leg
    const leftLegGroup = new THREE.Group();
    const leftThigh = new THREE.Mesh(legGeometry, armMaterial);
    leftThigh.position.set(-0.3, 0.35, 0);
    leftThigh.castShadow = true;
    leftThigh.receiveShadow = true;
    leftLegGroup.add(leftThigh);

    // Left sock
    const sockGeometry = new THREE.BoxGeometry(0.32, 0.4, 0.32);
    const leftSockMaterial = new THREE.MeshLambertMaterial({
      color: sockPrimaryColor,
      flatShading: true,
    });
    const leftSock = new THREE.Mesh(sockGeometry, leftSockMaterial);
    leftSock.position.set(-0.3, -0.2, 0);
    leftSock.castShadow = true;
    leftLegGroup.add(leftSock);

    // White band on sock
    const sockBandGeometry = new THREE.BoxGeometry(0.33, 0.1, 0.33);
    const sockBandMaterial = new THREE.MeshLambertMaterial({
      color: sockSecondaryColor,
      flatShading: true,
    });
    const leftSockBand = new THREE.Mesh(sockBandGeometry, sockBandMaterial);
    leftSockBand.position.set(-0.3, -0.05, 0);
    leftLegGroup.add(leftSockBand);

    playerGroup.add(leftLegGroup);

    // Right leg
    const rightLegGroup = new THREE.Group();
    const rightThigh = new THREE.Mesh(legGeometry, armMaterial);
    rightThigh.position.set(0.3, 0.35, 0);
    rightThigh.castShadow = true;
    rightThigh.receiveShadow = true;
    rightLegGroup.add(rightThigh);

    // Right sock
    const rightSock = new THREE.Mesh(sockGeometry, leftSockMaterial);
    rightSock.position.set(0.3, -0.2, 0);
    rightSock.castShadow = true;
    rightLegGroup.add(rightSock);

    // White band on right sock
    const rightSockBand = new THREE.Mesh(sockBandGeometry, sockBandMaterial);
    rightSockBand.position.set(0.3, -0.05, 0);
    rightLegGroup.add(rightSockBand);

    playerGroup.add(rightLegGroup);

    // Feet/Shoes
    const shoeGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.5);
    const shoeMaterial = new THREE.MeshLambertMaterial({
      color: shoeGray,
      flatShading: true,
    });

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(-0.3, -0.47, 0.05);
    leftShoe.castShadow = true;
    playerGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    rightShoe.position.set(0.3, -0.47, 0.05);
    rightShoe.castShadow = true;
    playerGroup.add(rightShoe);

    // Create a container mesh for the player
    const playerMesh = new THREE.Mesh();
    playerMesh.add(playerGroup);
    playerMesh.position.set(0, 0.5, 10);

    // Store bone references for potential animation
    playerMesh.userData = {
      bones: {
        torso: torsoGroup,
        head: head,
        leftArm: leftArm,
        rightArm: rightArm,
        leftLeg: leftLegGroup,
        rightLeg: rightLegGroup,
      },
    };

    this.scene.add(playerMesh);

    return playerMesh;
  }

  /**
   * Create the ball model
   */
  private createBall(): THREE.Mesh {
    const ballGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.position.set(0, 0.5, 0);
    this.scene.add(ball);

    return ball;
  }

  /**
   * Set up keyboard controls
   */
  private setupControls(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key in this.keys) {
        this.keys[e.key as keyof typeof this.keys] = true;
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key in this.keys) {
        this.keys[e.key as keyof typeof this.keys] = false;
      }
    });
  }

  /**
   * Handle window resize
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Update game logic
   */
  private update(deltaTime: number): void {
    const moveSpeed = 10 * deltaTime;
    const jumpForce = 8;

    // Track if player is moving
    let isMoving = false;

    // Player movement
    if (this.keys.ArrowUp) {
      this.player.position.z -= moveSpeed;
      isMoving = true;
    }
    if (this.keys.ArrowDown) {
      this.player.position.z += moveSpeed;
      isMoving = true;
    }
    if (this.keys.ArrowLeft) {
      this.player.position.x -= moveSpeed;
      this.player.rotation.y = Math.PI / 2;
      isMoving = true;
    }
    if (this.keys.ArrowRight) {
      this.player.position.x += moveSpeed;
      this.player.rotation.y = -Math.PI / 2;
      isMoving = true;
    }

    // Update facing direction based on movement
    if (this.keys.ArrowUp && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
      this.player.rotation.y = 0;
    }
    if (this.keys.ArrowDown && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
      this.player.rotation.y = Math.PI;
    }

    // Animate legs when moving
    if (isMoving && this.playerOnGround && this.player.userData) {
      this.animationTime += deltaTime * 10; // Animation speed
      const swingAmount = Math.sin(this.animationTime) * 0.3;

      // Animate legs
      this.player.userData.bones.leftLeg.rotation.x = swingAmount;
      this.player.userData.bones.rightLeg.rotation.x = -swingAmount;

      // Subtle arm swing
      this.player.userData.bones.leftArm.rotation.x = -swingAmount * 0.5;
      this.player.userData.bones.rightArm.rotation.x = swingAmount * 0.5;
    } else if (this.player.userData) {
      // Reset to idle position
      this.player.userData.bones.leftLeg.rotation.x = 0;
      this.player.userData.bones.rightLeg.rotation.x = 0;
      this.player.userData.bones.leftArm.rotation.x = 0;
      this.player.userData.bones.rightArm.rotation.x = 0;
    }

    // Jump
    if (this.keys.Space && this.playerOnGround) {
      this.playerVelocity.y = jumpForce;
      this.playerOnGround = false;
    }

    // Apply gravity
    if (!this.playerOnGround) {
      this.playerVelocity.y -= 20 * deltaTime; // Gravity
      this.player.position.y += this.playerVelocity.y * deltaTime;

      // Ground check
      if (this.player.position.y <= 0.5) {
        this.player.position.y = 0.5;
        this.playerVelocity.y = 0;
        this.playerOnGround = true;
      }
    }

    // Shoot ball (basic implementation)
    if (this.keys.b) {
      // Calculate distance to ball
      const distance = this.player.position.distanceTo(this.ball.position);

      // If close enough to ball, kick it
      if (distance < 2) {
        const direction = new THREE.Vector3();
        direction.subVectors(this.ball.position, this.player.position);
        direction.y = 0;
        direction.normalize();

        // Apply force to ball in player's facing direction
        const kickDirection = new THREE.Vector3(
          -Math.sin(this.player.rotation.y),
          0.3,
          -Math.cos(this.player.rotation.y)
        );

        this.ball.position.add(kickDirection.multiplyScalar(moveSpeed * 2));
      }
    }

    // Team switching
    if (this.keys.t && !this.lastKeys.t) {
      // Toggle team
      this.currentTeam =
        this.currentTeam === TeamType.SPORTING
          ? TeamType.BENFICA
          : TeamType.SPORTING;

      // Save current position and rotation
      const currentPos = this.player.position.clone();
      const currentRot = this.player.rotation.clone();

      // Remove old player
      this.scene.remove(this.player);

      // Create new player with different team
      this.player = this.createPlayer(this.currentTeam);
      this.player.position.copy(currentPos);
      this.player.rotation.copy(currentRot);
    }

    // Keep ball on ground (simple physics)
    if (this.ball.position.y > 0.5) {
      this.ball.position.y -= 10 * deltaTime;
    } else {
      this.ball.position.y = 0.5;
    }

    // Camera follow player
    this.camera.position.x = this.player.position.x;
    this.camera.position.z = this.player.position.z + 20;
    this.camera.lookAt(this.player.position);

    // Update lastKeys for next frame
    Object.assign(this.lastKeys, this.keys);
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const deltaTime = 0.016; // Assuming 60 FPS

    this.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
  };
}

// Start the game when the page loads
window.addEventListener("DOMContentLoaded", () => {
  new SoccerGame();
});
