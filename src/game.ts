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
  private goals: THREE.Mesh[] = [];
  private confettiParticles: THREE.Points[] = [];

  // Movement state
  private keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    t: false,
  };

  private lastKeys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    t: false,
  };

  // Player physics
  private playerVelocity = new THREE.Vector3();
  private playerOnGround = true;

  // Ball physics
  private ballVelocity = new THREE.Vector3();

  // Animation
  private animationTime = 0;

  // Current team
  private currentTeam = TeamType.SPORTING;

  // Scoring system
  private scores = {
    home: 0, // Left side (player starts here)
    away: 0, // Right side
  };
  private scoreboard: THREE.Group | null = null;

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
    this.camera.position.set(0, 25, 50);
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
    this.createScoreboard();
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
    directionalLight.position.set(20, 40, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -60;
    directionalLight.shadow.camera.right = 60;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 150;
    this.scene.add(directionalLight);
  }

  /**
   * Create the soccer field
   */
  private createField(): void {
    // Standard field dimensions: 115 yards (105m) x 75 yards (68.5m)
    // Using 1 unit = 1 yard for simplicity
    const fieldLength = 115; // yards (x-axis)
    const fieldWidth = 75; // yards (z-axis)

    // Create grass field
    const fieldGeometry = new THREE.BoxGeometry(fieldLength, 0.1, fieldWidth);
    const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.receiveShadow = true;
    this.scene.add(field);

    // Add white lines (simplified)
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Center line (along z-axis)
    const centerLineGeometry = new THREE.BoxGeometry(0.3, 0.11, fieldWidth);
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.position.y = 0.05;
    this.scene.add(centerLine);

    // Center circle (10 yard radius)
    const centerCircleGeometry = new THREE.RingGeometry(10, 10.3, 32);
    const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.06;
    this.scene.add(centerCircle);

    // Field boundary lines
    // Side lines (along x-axis)
    const sideLineGeometry = new THREE.BoxGeometry(fieldLength, 0.11, 0.3);
    const topSideLine = new THREE.Mesh(sideLineGeometry, lineMaterial);
    topSideLine.position.set(0, 0.05, -fieldWidth / 2);
    this.scene.add(topSideLine);

    const bottomSideLine = new THREE.Mesh(sideLineGeometry, lineMaterial);
    bottomSideLine.position.set(0, 0.05, fieldWidth / 2);
    this.scene.add(bottomSideLine);

    // Goal lines (along z-axis)
    const goalLineGeometry = new THREE.BoxGeometry(0.3, 0.11, fieldWidth);
    const leftGoalLine = new THREE.Mesh(goalLineGeometry, lineMaterial);
    leftGoalLine.position.set(-fieldLength / 2, 0.05, 0);
    this.scene.add(leftGoalLine);

    const rightGoalLine = new THREE.Mesh(goalLineGeometry, lineMaterial);
    rightGoalLine.position.set(fieldLength / 2, 0.05, 0);
    this.scene.add(rightGoalLine);

    // Penalty areas (18 yard box)
    const penaltyAreaWidth = 44; // yards
    const penaltyAreaDepth = 18; // yards

    // Left penalty area
    const penaltyBoxGeometry = new THREE.BoxGeometry(
      0.3,
      0.11,
      penaltyAreaWidth
    );
    const leftPenaltyFront = new THREE.Mesh(penaltyBoxGeometry, lineMaterial);
    leftPenaltyFront.position.set(-fieldLength / 2 + penaltyAreaDepth, 0.05, 0);
    this.scene.add(leftPenaltyFront);

    const penaltySideGeometry = new THREE.BoxGeometry(
      penaltyAreaDepth,
      0.11,
      0.3
    );
    const leftPenaltyTop = new THREE.Mesh(penaltySideGeometry, lineMaterial);
    leftPenaltyTop.position.set(
      -fieldLength / 2 + penaltyAreaDepth / 2,
      0.05,
      -penaltyAreaWidth / 2
    );
    this.scene.add(leftPenaltyTop);

    const leftPenaltyBottom = new THREE.Mesh(penaltySideGeometry, lineMaterial);
    leftPenaltyBottom.position.set(
      -fieldLength / 2 + penaltyAreaDepth / 2,
      0.05,
      penaltyAreaWidth / 2
    );
    this.scene.add(leftPenaltyBottom);

    // Right penalty area
    const rightPenaltyFront = new THREE.Mesh(penaltyBoxGeometry, lineMaterial);
    rightPenaltyFront.position.set(fieldLength / 2 - penaltyAreaDepth, 0.05, 0);
    this.scene.add(rightPenaltyFront);

    const rightPenaltyTop = new THREE.Mesh(penaltySideGeometry, lineMaterial);
    rightPenaltyTop.position.set(
      fieldLength / 2 - penaltyAreaDepth / 2,
      0.05,
      -penaltyAreaWidth / 2
    );
    this.scene.add(rightPenaltyTop);

    const rightPenaltyBottom = new THREE.Mesh(
      penaltySideGeometry,
      lineMaterial
    );
    rightPenaltyBottom.position.set(
      fieldLength / 2 - penaltyAreaDepth / 2,
      0.05,
      penaltyAreaWidth / 2
    );
    this.scene.add(rightPenaltyBottom);

    // Create goals
    this.createGoals(fieldLength);
  }

  /**
   * Create goal posts at each end of the field
   */
  private createGoals(fieldLength: number): void {
    const goalWidth = 16; // yards (doubled from 8)
    const goalHeight = 5.34; // yards (doubled from 2.67)
    const postRadius = 0.15;
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // Create goals for both sides
    [-1, 1].forEach((side) => {
      const goalGroup = new THREE.Group();

      // Goal posts (cylinders)
      const postGeometry = new THREE.CylinderGeometry(
        postRadius,
        postRadius,
        goalHeight
      );

      // Left post
      const leftPost = new THREE.Mesh(postGeometry, postMaterial);
      leftPost.position.set(
        (side * fieldLength) / 2,
        goalHeight / 2,
        -goalWidth / 2
      );
      leftPost.castShadow = true;
      goalGroup.add(leftPost);

      // Right post
      const rightPost = new THREE.Mesh(postGeometry, postMaterial);
      rightPost.position.set(
        (side * fieldLength) / 2,
        goalHeight / 2,
        goalWidth / 2
      );
      rightPost.castShadow = true;
      goalGroup.add(rightPost);

      // Crossbar
      const crossbarGeometry = new THREE.BoxGeometry(0.3, 0.3, goalWidth);
      const crossbar = new THREE.Mesh(crossbarGeometry, postMaterial);
      crossbar.position.set((side * fieldLength) / 2, goalHeight, 0);
      crossbar.castShadow = true;
      goalGroup.add(crossbar);

      // Goal net (simplified as a semi-transparent box)
      const netGeometry = new THREE.BoxGeometry(2, goalHeight, goalWidth);
      const netMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const net = new THREE.Mesh(netGeometry, netMaterial);
      net.position.set(side * (fieldLength / 2 + 1), goalHeight / 2, 0);
      goalGroup.add(net);

      this.scene.add(goalGroup);

      // Store goal for collision detection
      const goalMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, goalHeight, goalWidth),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      goalMesh.position.set((side * fieldLength) / 2, goalHeight / 2, 0);
      goalMesh.userData = { side: side };
      this.goals.push(goalMesh);
      this.scene.add(goalMesh);
    });
  }

  /**
   * Create scoreboard at center of field
   */
  private createScoreboard(): void {
    this.scoreboard = new THREE.Group();

    // Scoreboard base (elevated platform)
    const baseGeometry = new THREE.BoxGeometry(12, 0.5, 4);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 8, 0);
    base.castShadow = true;
    if (this.scoreboard) this.scoreboard.add(base);

    // Support poles
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
    const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });

    [-4, 4].forEach((x) => {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(x, 4, 0);
      pole.castShadow = true;
      if (this.scoreboard) this.scoreboard.add(pole);
    });

    // Score display background
    const displayGeometry = new THREE.BoxGeometry(10, 3, 0.2);
    const displayMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 8, 2);
    if (this.scoreboard) this.scoreboard.add(display);

    this.scene.add(this.scoreboard);
    this.updateScoreboard();
  }

  /**
   * Update scoreboard display with current scores
   */
  private updateScoreboard(): void {
    if (!this.scoreboard) return;

    // Remove existing score displays
    const existingScores = this.scoreboard.children.filter(
      (child) => child.userData && child.userData.isScore
    );
    existingScores.forEach((score) => {
      if (this.scoreboard) {
        this.scoreboard.remove(score);
      }
    });

    // Create digit geometries for scores
    this.createScoreDigits(this.scores.home, -3, 8, 2.1);
    this.createScoreDigits(this.scores.away, 3, 8, 2.1);

    // Add separator (colon)
    const separatorGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const separatorMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });

    const dot1 = new THREE.Mesh(separatorGeometry, separatorMaterial);
    dot1.position.set(0, 8.5, 2.1);
    dot1.userData = { isScore: true };
    if (this.scoreboard) this.scoreboard.add(dot1);

    const dot2 = new THREE.Mesh(separatorGeometry, separatorMaterial);
    dot2.position.set(0, 7.5, 2.1);
    dot2.userData = { isScore: true };
    if (this.scoreboard) this.scoreboard.add(dot2);
  }

  /**
   * Create 7-segment style digits for score display
   */
  private createScoreDigits(
    score: number,
    x: number,
    y: number,
    z: number
  ): void {
    const digitString = score.toString().padStart(2, "0");

    digitString.split("").forEach((digit, index) => {
      this.create7SegmentDigit(parseInt(digit), x + index * 1.5, y, z);
    });
  }

  /**
   * Create a 7-segment display digit
   */
  private create7SegmentDigit(
    digit: number,
    x: number,
    y: number,
    z: number
  ): void {
    const segmentMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const offMaterial = new THREE.MeshLambertMaterial({ color: 0x003300 });

    // Define which segments are on for each digit (top, topRight, bottomRight, bottom, bottomLeft, topLeft, middle)
    const digitPatterns: boolean[][] = [
      [true, true, true, true, true, true, false], // 0
      [false, true, true, false, false, false, false], // 1
      [true, true, false, true, true, false, true], // 2
      [true, true, true, true, false, false, true], // 3
      [false, true, true, false, false, true, true], // 4
      [true, false, true, true, false, true, true], // 5
      [true, false, true, true, true, true, true], // 6
      [true, true, true, false, false, false, false], // 7
      [true, true, true, true, true, true, true], // 8
      [true, true, true, true, false, true, true], // 9
    ];

    const pattern = digitPatterns[digit];
    const segmentSize = 0.15;
    const segmentLength = 0.8;

    // Segment positions and orientations
    const segments = [
      { pos: [0, 0.9, 0], size: [segmentLength, segmentSize, segmentSize] }, // top
      { pos: [0.45, 0.45, 0], size: [segmentSize, segmentLength, segmentSize] }, // topRight
      {
        pos: [0.45, -0.45, 0],
        size: [segmentSize, segmentLength, segmentSize],
      }, // bottomRight
      { pos: [0, -0.9, 0], size: [segmentLength, segmentSize, segmentSize] }, // bottom
      {
        pos: [-0.45, -0.45, 0],
        size: [segmentSize, segmentLength, segmentSize],
      }, // bottomLeft
      {
        pos: [-0.45, 0.45, 0],
        size: [segmentSize, segmentLength, segmentSize],
      }, // topLeft
      { pos: [0, 0, 0], size: [segmentLength, segmentSize, segmentSize] }, // middle
    ];

    segments.forEach((segment, index) => {
      const geometry = new THREE.BoxGeometry(
        segment.size[0],
        segment.size[1],
        segment.size[2]
      );
      const material = pattern[index] ? segmentMaterial : offMaterial;
      const segmentMesh = new THREE.Mesh(geometry, material);
      segmentMesh.position.set(
        x + segment.pos[0],
        y + segment.pos[1],
        z + segment.pos[2]
      );
      segmentMesh.userData = { isScore: true };
      if (this.scoreboard) this.scoreboard.add(segmentMesh);
    });
  }

  /**
   * Create confetti particle system
   */
  private createConfetti(position: THREE.Vector3): void {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Create random confetti particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Start position at goal
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z + (Math.random() - 0.5) * 8;

      // Random bright colors
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1.0, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 20;
      velocities[i3 + 1] = Math.random() * 20 + 10;
      velocities[i3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      velocities: velocities,
      lifetime: 0,
      maxLifetime: 3, // seconds
    };

    this.confettiParticles.push(particles);
    this.scene.add(particles);
  }

  /**
   * Create the player model (low-poly style)
   */
  private createPlayer(teamType: TeamType): THREE.Mesh {
    const playerGroup = new THREE.Group();

    // Field dimensions for positioning
    const fieldLength = 115;

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
    playerMesh.position.set(-fieldLength / 4, 0.5, 0);

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
      const key = e.key === " " ? "Space" : e.key;
      if (key in this.keys) {
        this.keys[key as keyof typeof this.keys] = true;
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      const key = e.key === " " ? "Space" : e.key;
      if (key in this.keys) {
        this.keys[key as keyof typeof this.keys] = false;
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
      this.player.rotation.y = -Math.PI / 2;
    }
    if (this.keys.ArrowDown && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
      this.player.rotation.y = Math.PI / 2;
    }

    // Keep player within field bounds
    const fieldWidth = 75;
    const fieldLength = 115;
    this.player.position.x = Math.max(
      -fieldLength / 2 + 1,
      Math.min(fieldLength / 2 - 1, this.player.position.x)
    );
    this.player.position.z = Math.max(
      -fieldWidth / 2 + 1,
      Math.min(fieldWidth / 2 - 1, this.player.position.z)
    );

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

    // Shoot ball with Space
    if (this.keys.Space) {
      // Calculate distance to ball
      const distance = this.player.position.distanceTo(this.ball.position);

      // If close enough to ball, kick it
      if (distance < 2) {
        // Apply force to ball in player's facing direction
        const kickPower = 30;
        this.ballVelocity.x = -Math.sin(this.player.rotation.y) * kickPower;
        this.ballVelocity.z = -Math.cos(this.player.rotation.y) * kickPower;
        this.ballVelocity.y = 5; // Small upward kick
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

    // Update ball physics
    // Apply velocity
    this.ball.position.add(this.ballVelocity.clone().multiplyScalar(deltaTime));

    // Apply gravity to ball
    if (this.ball.position.y > 0.5) {
      this.ballVelocity.y -= 30 * deltaTime;
    } else {
      // Ball on ground
      this.ball.position.y = 0.5;
      if (this.ballVelocity.y < 0) {
        this.ballVelocity.y = -this.ballVelocity.y * 0.7; // Bounce with energy loss
        if (Math.abs(this.ballVelocity.y) < 1) {
          this.ballVelocity.y = 0;
        }
      }

      // Apply ground friction
      this.ballVelocity.x *= 0.98;
      this.ballVelocity.z *= 0.98;
    }

    // Keep ball within field bounds (but allow entry into goal areas)
    if (Math.abs(this.ball.position.x) > fieldLength / 2 - 1) {
      // Check if ball is in goal area (within goal width)
      const isInGoalArea = Math.abs(this.ball.position.z) <= 8; // Half of goal width (16/2 = 8)

      if (!isInGoalArea) {
        // Only bounce if not in goal area
        this.ball.position.x =
          Math.sign(this.ball.position.x) * (fieldLength / 2 - 1);
        this.ballVelocity.x *= -0.8; // Bounce off side
      }
    }
    if (Math.abs(this.ball.position.z) > fieldWidth / 2 - 1) {
      this.ball.position.z =
        Math.sign(this.ball.position.z) * (fieldWidth / 2 - 1);
      this.ballVelocity.z *= -0.8; // Bounce off end
    }

    // Check for goals
    this.goals.forEach((goal) => {
      const goalBounds = {
        minX: goal.position.x - 1,
        maxX: goal.position.x + 1,
        minY: 0,
        maxY: 5.34, // Updated to match doubled goal height
        minZ: goal.position.z - 8,
        maxZ: goal.position.z + 8,
      };

      if (
        this.ball.position.x > goalBounds.minX &&
        this.ball.position.x < goalBounds.maxX &&
        this.ball.position.y > goalBounds.minY &&
        this.ball.position.y < goalBounds.maxY &&
        this.ball.position.z > goalBounds.minZ &&
        this.ball.position.z < goalBounds.maxZ
      ) {
        // Determine which team scored based on goal side
        if (goal.userData.side === -1) {
          // Ball went into left goal, away team scores
          this.scores.away++;
        } else {
          // Ball went into right goal, home team scores
          this.scores.home++;
        }

        // Update scoreboard display
        this.updateScoreboard();

        // Goal scored! Create confetti
        this.createConfetti(new THREE.Vector3(goal.position.x, 4, 0));

        // Reset ball to center
        this.ball.position.set(0, 0.5, 0);
        this.ballVelocity.set(0, 0, 0);

        // Reset player position
        this.player.position.set(-fieldLength / 4, 0.5, 0);
      }
    });

    // Reset ball if it goes too far behind the goal
    if (Math.abs(this.ball.position.x) > fieldLength / 2 + 5) {
      this.ball.position.set(0, 0.5, 0);
      this.ballVelocity.set(0, 0, 0);
    }

    // Update confetti particles
    this.confettiParticles = this.confettiParticles.filter((particles) => {
      const positions = particles.geometry.attributes.position
        .array as Float32Array;
      const velocities = particles.userData.velocities;
      particles.userData.lifetime += deltaTime;

      // Update particle positions
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * deltaTime;
        positions[i + 1] += velocities[i + 1] * deltaTime;
        positions[i + 2] += velocities[i + 2] * deltaTime;

        // Apply gravity
        velocities[i + 1] -= 20 * deltaTime;
      }

      // Update opacity based on lifetime
      const material = particles.material as THREE.PointsMaterial;
      material.opacity = Math.max(
        0,
        1 - particles.userData.lifetime / particles.userData.maxLifetime
      );

      particles.geometry.attributes.position.needsUpdate = true;

      // Remove old particles
      if (particles.userData.lifetime > particles.userData.maxLifetime) {
        this.scene.remove(particles);
        particles.geometry.dispose();
        material.dispose();
        return false;
      }

      return true;
    });

    // Camera follow player from sideline (FIFA-style)
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = 25;
    this.camera.position.z = 50;
    this.camera.lookAt(this.player.position.x, 0, this.player.position.z);

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
