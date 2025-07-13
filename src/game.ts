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

  // Dribbling state
  private isDribbling = false;
  private dribbleOffset = new THREE.Vector3();

  // Animation
  private animationTime = 0;
  private lastTime = 0;

  // Celebration state
  private celebrationTime = 0;
  private isCelebrating = false;
  private celebrationEffects: THREE.Mesh[] = [];

  // Audio
  private audioContext: AudioContext | null = null;
  private hornSounds: OscillatorNode[] = [];

  // Current team
  private currentTeam = TeamType.SPORTING;

  // Scoring system
  private scores = {
    home: 0, // Left side (player starts here)
    away: 0, // Right side
  };
  private scoreboard: THREE.Group | null = null;

  // Game timing
  private gameTime = 0;
  private readonly halfDuration = 60; // seconds
  private currentHalf = 1;
  private timerElement: HTMLElement | null = null;
  private gameEnded = false;

  constructor() {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e); // Dark evening sky

    // Add fog for atmosphere
    this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 250);

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

    // Timer element for displaying game time
    this.timerElement = document.getElementById("timer");

    // Initialize game objects
    this.setupLighting();
    this.createField();
    this.createStadium();
    this.player = this.createPlayer(TeamType.SPORTING);
    this.ball = this.createBall();

    // Set up controls
    this.setupControls();
    this.setupTouchControls(); // Add this line

    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Initialize audio on first user interaction
    window.addEventListener("click", () => this.initAudio(), { once: true });
    window.addEventListener("keydown", () => this.initAudio(), { once: true });
    window.addEventListener("touchstart", () => this.initAudio(), {
      once: true,
    });

    if (this.timerElement) {
      this.timerElement.textContent = "Half 1 1:00";
    }

    // Start game loop
    this.animate();
  }

  /**
   * Set up lighting for the scene
   */
  private setupLighting(): void {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Directional light for shadows (simulating stadium lights)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(30, 50, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.mapSize.width = 1024; // Reduced from 2048
    directionalLight.shadow.mapSize.height = 1024; // Reduced from 2048
    this.scene.add(directionalLight);

    // Add stadium floodlights
    const floodlightPositions = [
      [-80, 30, -50], // Back left
      [80, 30, -50], // Back right
      [0, 30, -50], // Back center
    ];

    floodlightPositions.forEach((pos) => {
      const spotLight = new THREE.SpotLight(0xffffff, 0.6); // Increased intensity slightly
      spotLight.position.set(pos[0], pos[1], pos[2]);
      spotLight.target.position.set(0, 0, 0);
      spotLight.angle = Math.PI / 3;
      spotLight.penumbra = 0.3;
      spotLight.castShadow = true;
      this.scene.add(spotLight);
      this.scene.add(spotLight.target);
    });
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
   * Create stadium with seats and crowd
   */
  private createStadium(): void {
    const fieldLength = 115;
    const fieldWidth = 75;

    // Stadium dimensions
    const stadiumLength = fieldLength + 40;
    const stadiumWidth = fieldWidth + 40;
    const seatRows = 20;
    const seatHeight = 0.8;

    // Create stadium structure with tiered seating
    this.createStadiumSeats(stadiumLength, stadiumWidth, seatRows, seatHeight);

    // Add crowd
    this.createCrowd();

    // Create corner display screen
    this.createCornerDisplay();
  }

  /**
   * Create tiered stadium seating
   */
  private createStadiumSeats(
    length: number,
    width: number,
    rows: number,
    rowHeight: number
  ): void {
    const seatMaterial = new THREE.MeshLambertMaterial({ color: 0x006633 }); // Sporting green seats
    const structureMaterial = new THREE.MeshLambertMaterial({
      color: 0x444444,
    }); // Gray structure

    // Create three stands (excluding front/near side for better visibility)
    const stands = [
      { pos: [0, 0, -width / 2 - 10], rot: [0, 0, 0], len: length }, // Back stand
      { pos: [-length / 2 - 10, 0, 0], rot: [0, Math.PI / 2, 0], len: width }, // Left stand
      { pos: [length / 2 + 10, 0, 0], rot: [0, -Math.PI / 2, 0], len: width }, // Right stand
    ];

    stands.forEach((stand) => {
      const standGroup = new THREE.Group();

      // Create tiered rows
      for (let row = 0; row < rows; row++) {
        const tierY = row * rowHeight + 2;
        const tierZ = -row * 1.5;

        // Seat row geometry
        const seatGeometry = new THREE.BoxGeometry(stand.len, 0.5, 1.2);
        const seats = new THREE.Mesh(seatGeometry, seatMaterial);
        seats.position.set(0, tierY, tierZ);
        seats.castShadow = true;
        seats.receiveShadow = true;
        standGroup.add(seats);

        // Support structure
        if (row % 5 === 0) {
          const supportGeometry = new THREE.BoxGeometry(stand.len, tierY, 0.5);
          const support = new THREE.Mesh(supportGeometry, structureMaterial);
          support.position.set(0, tierY / 2, tierZ - 1);
          standGroup.add(support);
        }
      }

      // Roof overhang
      const roofGeometry = new THREE.BoxGeometry(stand.len + 10, 2, 25);
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(0, rows * rowHeight + 5, -10);
      roof.castShadow = true;
      standGroup.add(roof);

      // Position and rotate the stand
      standGroup.position.set(stand.pos[0], stand.pos[1], stand.pos[2]);
      standGroup.rotation.set(stand.rot[0], stand.rot[1], stand.rot[2]);

      this.scene.add(standGroup);
    });
  }

  /**
   * Create animated crowd in the stands
   */
  private createCrowd(): void {
    const crowdGroup = new THREE.Group();
    const fanColors = [0xff0000, 0x00ff00, 0xffffff, 0x000000, 0xffff00]; // Sporting colors plus variety

    // Add fans in three sections (excluding front)
    const sections = [
      { x: 0, z: -55, width: 100, rows: 15, standFacing: 0 }, // Back stand
      { x: -77.5, z: 0, width: 60, rows: 15, standFacing: Math.PI / 2 }, // Left stand
      { x: 77.5, z: 0, width: 60, rows: 15, standFacing: -Math.PI / 2 }, // Right stand
    ];

    sections.forEach((section) => {
      for (let i = 0; i < 150; i++) {
        // Reduced from 200 to 150 per section
        const fanGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 6);
        const fanColor =
          fanColors[Math.floor(Math.random() * fanColors.length)];
        const fanMaterial = new THREE.MeshLambertMaterial({ color: fanColor });
        const fan = new THREE.Mesh(fanGeometry, fanMaterial);

        // Position fan in a specific row and seat
        const row = Math.floor(Math.random() * section.rows);
        const seatPosition = (Math.random() - 0.5) * section.width;

        // Calculate position based on stand
        let x, z;
        if (section.standFacing === 0) {
          // Back stand
          x = seatPosition;
          z = section.z - row * 1.5; // Move back into the tiered seating
        } else if (section.standFacing === Math.PI / 2) {
          // Left stand
          x = section.x - row * 1.5; // Move into the tiered seating
          z = seatPosition;
        } else {
          // Right stand
          x = section.x + row * 1.5; // Move into the tiered seating
          z = seatPosition;
        }

        const y = row * 0.8 + 2.5; // Positioned on seats

        fan.position.set(x, y, z);
        fan.rotation.y = section.standFacing + (Math.random() - 0.5) * 0.3;
        fan.castShadow = false; // Disable shadows for performance
        fan.receiveShadow = false;

        // Store animation data
        fan.userData = {
          baseY: y,
          animOffset: Math.random() * Math.PI * 2,
          animSpeed: 0.5 + Math.random() * 0.5,
        };

        crowdGroup.add(fan);
      }
    });

    crowdGroup.userData = { isCrowd: true };
    this.scene.add(crowdGroup);
  }

  /**
   * Create corner display screen
   */
  private createCornerDisplay(): void {
    // Display screen in far left corner
    const screenGroup = new THREE.Group();

    // Screen frame
    const frameGeometry = new THREE.BoxGeometry(20, 12, 1);
    const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.castShadow = true;
    screenGroup.add(frame);

    // Screen display
    const screenGeometry = new THREE.BoxGeometry(18, 10, 0.1);
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.5;
    screenGroup.add(screen);

    // Position in far left corner
    screenGroup.position.set(-75, 15, -45);
    screenGroup.rotation.y = Math.PI / 4; // Angle toward field

    this.scene.add(screenGroup);
    this.scoreboard = screenGroup;

    // Update display
    this.updateCornerDisplay();
  }

  /**
   * Update corner display screen with current scores
   */
  private updateCornerDisplay(): void {
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

    // Create larger score display for corner screen
    const scoreText = `${this.scores.home
      .toString()
      .padStart(2, "0")} - ${this.scores.away.toString().padStart(2, "0")}`;

    // Create score digits on the screen
    this.createScoreDigits(this.scores.home, -4, 0, 0.6);

    // Add separator dash
    const separatorGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.1);
    const separatorMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const separator = new THREE.Mesh(separatorGeometry, separatorMaterial);
    separator.position.set(0, 0, 0.6);
    separator.userData = { isScore: true };
    if (this.scoreboard) this.scoreboard.add(separator);

    this.createScoreDigits(this.scores.away, 4, 0, 0.6);
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
      this.create7SegmentDigit(parseInt(digit), x + index * 2.5, y, z);
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
    const segmentSize = 0.3; // Doubled from 0.15
    const segmentLength = 1.6; // Doubled from 0.8

    // Segment positions and orientations
    const segments = [
      { pos: [0, 1.8, 0], size: [segmentLength, segmentSize, segmentSize] }, // top
      { pos: [0.9, 0.9, 0], size: [segmentSize, segmentLength, segmentSize] }, // topRight
      { pos: [0.9, -0.9, 0], size: [segmentSize, segmentLength, segmentSize] }, // bottomRight
      { pos: [0, -1.8, 0], size: [segmentLength, segmentSize, segmentSize] }, // bottom
      { pos: [-0.9, -0.9, 0], size: [segmentSize, segmentLength, segmentSize] }, // bottomLeft
      { pos: [-0.9, 0.9, 0], size: [segmentSize, segmentLength, segmentSize] }, // topLeft
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
   * Start fan celebration when goal is scored
   */
  private startCelebration(): void {
    this.isCelebrating = true;
    this.celebrationTime = 0;

    // Play goal sound immediately
    this.playGoalSound();

    // Create visual effects for celebration
    this.createCelebrationEffects();

    // Play horn sounds (slightly delayed)
    setTimeout(() => {
      this.playHornSounds();
    }, 200);
  }

  /**
   * Create celebration effects (horns, flags, etc.)
   */
  private createCelebrationEffects(): void {
    // Clear any existing effects
    this.celebrationEffects.forEach((effect) => {
      this.scene.remove(effect);
      if (effect.geometry) effect.geometry.dispose();
      if (effect.material) (effect.material as THREE.Material).dispose();
    });
    this.celebrationEffects = [];

    // Create horn/vuvuzela effects from random fans
    for (let i = 0; i < 20; i++) {
      // Horn geometry (simple cone)
      const hornGeometry = new THREE.ConeGeometry(0.3, 2, 6);
      const hornMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() > 0.5 ? 0xff0000 : 0x00ff00, // Red or green
      });
      const horn = new THREE.Mesh(hornGeometry, hornMaterial);

      // Random position in stands
      const angle = Math.random() * Math.PI * 2;
      const radius = 65 + Math.random() * 15;
      const height = 5 + Math.random() * 10;

      horn.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      // Point horn toward field
      horn.lookAt(0, height, 0);
      horn.rotateX(-Math.PI / 4);

      horn.userData = {
        isEffect: true,
        baseY: height,
        animOffset: Math.random() * Math.PI * 2,
      };

      this.celebrationEffects.push(horn);
      this.scene.add(horn);
    }

    // Create flag effects
    for (let i = 0; i < 15; i++) {
      const flagPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
      const flagPoleMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
      });
      const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);

      const flagGeometry = new THREE.PlaneGeometry(1.5, 1);
      const flagMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() > 0.5 ? 0x007a33 : 0xffffff, // Sporting colors
        side: THREE.DoubleSide,
      });
      const flag = new THREE.Mesh(flagGeometry, flagMaterial);
      flag.position.set(0, 1, 0.5);
      flagPole.add(flag);

      // Random position
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 20;
      const height = 6 + Math.random() * 12;

      flagPole.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      flagPole.userData = {
        isEffect: true,
        flag: flag,
        waveSpeed: 2 + Math.random() * 2,
        waveAmount: 0.5 + Math.random() * 0.5,
      };

      this.celebrationEffects.push(flagPole);
      this.scene.add(flagPole);
    }

    // Create colored smoke/streamer particles from the stands
    for (let i = 0; i < 30; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.5, 4, 4);
      const particleColor = Math.random() > 0.5 ? 0x007a33 : 0xff0000;
      const particleMaterial = new THREE.MeshLambertMaterial({
        color: particleColor,
        transparent: true,
        opacity: 0.8,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      // Start from stands
      const angle = Math.random() * Math.PI * 2;
      const radius = 65 + Math.random() * 15;
      const height = 5 + Math.random() * 15;

      particle.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      // Give it velocity toward the field
      particle.userData = {
        isEffect: true,
        velocity: new THREE.Vector3(
          -Math.cos(angle) * 10,
          5 + Math.random() * 10,
          -Math.sin(angle) * 10
        ),
        lifetime: 0,
      };

      this.celebrationEffects.push(particle);
      this.scene.add(particle);
    }
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
   * Set up touch controls for mobile devices
   */
  private setupTouchControls(): void {
    // Check if device supports touch
    if (!("ontouchstart" in window) && !navigator.maxTouchPoints) {
      return;
    }

    // Create controls container
    const controlsContainer = document.createElement("div");
    controlsContainer.style.position = "fixed";
    controlsContainer.style.bottom = "0";
    controlsContainer.style.left = "0";
    controlsContainer.style.width = "100%";
    controlsContainer.style.height = "auto";
    controlsContainer.style.pointerEvents = "none";
    controlsContainer.style.zIndex = "1000";
    document.body.appendChild(controlsContainer);

    // Create d-pad container
    const dpadContainer = document.createElement("div");
    dpadContainer.style.position = "absolute";
    dpadContainer.style.bottom = "20px";
    dpadContainer.style.left = "20px";
    dpadContainer.style.width = "150px";
    dpadContainer.style.height = "150px";
    dpadContainer.style.pointerEvents = "auto";
    controlsContainer.appendChild(dpadContainer);

    // Create arrow buttons
    const createArrowButton = (
      direction: "up" | "down" | "left" | "right",
      x: string,
      y: string,
      rotation: number
    ) => {
      const button = document.createElement("button");
      button.style.position = "absolute";
      button.style.left = x;
      button.style.top = y;
      button.style.width = "50px";
      button.style.height = "50px";
      button.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      button.style.border = "2px solid rgba(255, 255, 255, 0.5)";
      button.style.borderRadius = "8px";
      button.style.cursor = "pointer";
      button.style.transform = `rotate(${rotation}deg)`;
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.fontSize = "24px";
      button.style.color = "rgba(255, 255, 255, 0.8)";
      button.style.userSelect = "none";
      button.style.webkitUserSelect = "none";
      button.style.touchAction = "none";
      button.innerHTML = "▲";

      // Map direction to key
      const keyMap = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
      };

      const key = keyMap[direction] as keyof typeof this.keys;

      // Touch events
      button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.keys[key] = true;
        button.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      });

      button.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.keys[key] = false;
        button.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      });

      button.addEventListener("touchcancel", (e) => {
        e.preventDefault();
        this.keys[key] = false;
        button.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      });

      return button;
    };

    // Add arrow buttons
    dpadContainer.appendChild(createArrowButton("up", "50px", "0px", 0));
    dpadContainer.appendChild(createArrowButton("down", "50px", "100px", 180));
    dpadContainer.appendChild(createArrowButton("left", "0px", "50px", -90));
    dpadContainer.appendChild(createArrowButton("right", "100px", "50px", 90));

    // Create shoot button
    const shootButton = document.createElement("button");
    shootButton.style.position = "absolute";
    shootButton.style.bottom = "40px";
    shootButton.style.right = "40px";
    shootButton.style.width = "80px";
    shootButton.style.height = "80px";
    shootButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    shootButton.style.border = "2px solid rgba(255, 255, 255, 0.5)";
    shootButton.style.borderRadius = "50%";
    shootButton.style.cursor = "pointer";
    shootButton.style.display = "flex";
    shootButton.style.alignItems = "center";
    shootButton.style.justifyContent = "center";
    shootButton.style.fontSize = "18px";
    shootButton.style.fontWeight = "bold";
    shootButton.style.color = "rgba(255, 255, 255, 0.8)";
    shootButton.style.userSelect = "none";
    shootButton.style.webkitUserSelect = "none";
    shootButton.style.touchAction = "none";
    shootButton.style.pointerEvents = "auto";
    shootButton.textContent = "SHOOT";

    // Shoot button events
    shootButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.keys.Space = true;
      shootButton.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      shootButton.style.transform = "scale(0.95)";
    });

    shootButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.keys.Space = false;
      shootButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      shootButton.style.transform = "scale(1)";
    });

    shootButton.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.keys.Space = false;
      shootButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      shootButton.style.transform = "scale(1)";
    });

    controlsContainer.appendChild(shootButton);
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
   * Initialize audio context
   */
  private initAudio(): void {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Update UI to show audio is enabled
      const audioStatus = document.querySelector("#controls p:last-child");
      if (audioStatus) {
        audioStatus.textContent = "🔊 Sound enabled";
      }
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  /**
   * Create and play horn/vuvuzela sounds
   */
  private playHornSounds(): void {
    if (!this.audioContext) return;

    // Stop any existing horn sounds
    this.hornSounds.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.hornSounds = [];

    // Create multiple horn sounds with different pitches
    const hornCount = 5;
    for (let i = 0; i < hornCount; i++) {
      setTimeout(() => {
        if (!this.audioContext) return;

        // Create oscillator for horn sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Configure horn sound (low frequency buzz like vuvuzela)
        const baseFrequency = 200 + Math.random() * 50; // 200-250 Hz
        oscillator.frequency.setValueAtTime(
          baseFrequency,
          this.audioContext.currentTime
        );
        oscillator.type = "sawtooth";

        // Add filter for more realistic horn sound
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        filter.Q.setValueAtTime(10, this.audioContext.currentTime);

        // Volume envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.15,
          this.audioContext.currentTime + 0.1
        );
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          this.audioContext.currentTime + 1.0
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + 3.0
        );

        // Connect nodes
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Start and schedule stop
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 3.0);

        this.hornSounds.push(oscillator);

        // Add some modulation for realism
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.setValueAtTime(
          5 + Math.random() * 3,
          this.audioContext.currentTime
        );
        lfoGain.gain.setValueAtTime(10, this.audioContext.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
        lfo.stop(this.audioContext.currentTime + 3.0);
      }, i * 200); // Stagger the horn sounds
    }

    // Add crowd cheer sound
    this.playCheerSound();
  }

  /**
   * Create crowd cheer sound effect
   */
  private playCheerSound(): void {
    if (!this.audioContext) return;

    // Create white noise for crowd sound
    const bufferSize = this.audioContext.sampleRate * 4; // 4 seconds
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    // Fill with noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.5;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it sound like distant crowd
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

    // Volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.05,
      this.audioContext.currentTime + 0.5
    );
    gainNode.gain.linearRampToValueAtTime(
      0.03,
      this.audioContext.currentTime + 2.0
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 4.0
    );

    // Connect and play
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    noise.start();
    noise.stop(this.audioContext.currentTime + 4.0);
  }

  /**
   * Play goal sound effect
   */
  private playGoalSound(): void {
    if (!this.audioContext) return;

    // Create a quick "GOAL!" sound using oscillators
    const duration = 0.5;
    const currentTime = this.audioContext.currentTime;

    // Create ascending tone for goal
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();

    osc1.frequency.setValueAtTime(400, currentTime);
    osc1.frequency.exponentialRampToValueAtTime(800, currentTime + duration);

    gain1.gain.setValueAtTime(0.3, currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

    osc1.connect(gain1);
    gain1.connect(this.audioContext.destination);

    osc1.start();
    osc1.stop(currentTime + duration);

    // Add a second harmonic
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();

    osc2.frequency.setValueAtTime(600, currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1200, currentTime + duration);

    gain2.gain.setValueAtTime(0.2, currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

    osc2.connect(gain2);
    gain2.connect(this.audioContext.destination);

    osc2.start();
    osc2.stop(currentTime + duration);
  }

  /**
   * Play kick sound effect
   */
  private playKickSound(): void {
    if (!this.audioContext) return;

    // Create a short percussive sound for kick
    const currentTime = this.audioContext.currentTime;

    // White noise burst
    const bufferSize = this.audioContext.sampleRate * 0.05; // 50ms
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    // Fill with noise that decays
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * Math.exp((-i / bufferSize) * 5);
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    // Filter for "thump" sound
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, currentTime);

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.5, currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    noise.start();

    // Add a low frequency thump
    const osc = this.audioContext.createOscillator();
    const oscGain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(60, currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, currentTime + 0.1);

    oscGain.gain.setValueAtTime(0.3, currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(currentTime + 0.1);
  }

  /**
   * End the game and display the final score
   */
  private endGame(): void {
    if (this.timerElement) {
      const winner =
        this.scores.home > this.scores.away ? "Home" : "Away";
      this.timerElement.textContent = `Final: ${this.scores.home}-${this.scores.away} ${winner} wins`;
    }
  }

  /**
   * Simulate a penalty shootout if the match is tied
   */
  private startPenalties(): void {
    const successRate = 0.7;
    let home = 0;
    let away = 0;
    for (let i = 0; i < 5; i++) {
      if (Math.random() < successRate) home++;
      if (Math.random() < successRate) away++;
    }
    while (home === away) {
      if (Math.random() < successRate) home++;
      if (Math.random() < successRate) away++;
    }
    this.scores.home = home;
    this.scores.away = away;
    this.updateCornerDisplay();
    if (this.timerElement) {
      const winner = home > away ? "Home" : "Away";
      this.timerElement.textContent = `Penalties: ${home}-${away} ${winner} wins`;
    }
  }

  /**
   * Update game logic
   */
  private update(deltaTime: number): void {
    if (this.gameEnded) return;

    // Update game timer
    this.gameTime += deltaTime;
    if (this.timerElement) {
      const remaining = Math.max(0, this.halfDuration - this.gameTime);
      const minutes = Math.floor(remaining / 60)
        .toString()
        .padStart(1, "0");
      const seconds = Math.floor(remaining % 60)
        .toString()
        .padStart(2, "0");
      this.timerElement.textContent = `Half ${this.currentHalf} ${minutes}:${seconds}`;
    }

    if (this.gameTime >= this.halfDuration) {
      if (this.currentHalf === 1) {
        this.currentHalf = 2;
        this.gameTime = 0;
        if (this.timerElement) {
          this.timerElement.textContent = "Half 2 1:00";
        }
        // Reset positions for second half
        const fieldLength = 115;
        this.ball.position.set(0, 0.5, 0);
        this.ballVelocity.set(0, 0, 0);
        this.isDribbling = false;
        this.player.position.set(-fieldLength / 4, 0.5, 0);
      } else {
        if (this.scores.home === this.scores.away) {
          this.startPenalties();
        } else {
          this.endGame();
        }
        this.gameEnded = true;
        return;
      }
    }

    const moveSpeed = 15 * deltaTime; // Increased from 10 to 15

    // Update animation time
    this.animationTime += deltaTime;

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
      const swingAmount = Math.sin(this.animationTime * 10) * 0.3;

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
      if (distance < 2.5) {
        // Apply force to ball in player's facing direction
        const kickPower = 25; // Reduced from 40 to 25
        this.ballVelocity.x = -Math.sin(this.player.rotation.y) * kickPower;
        this.ballVelocity.z = -Math.cos(this.player.rotation.y) * kickPower;
        this.ballVelocity.y = 5; // Small upward kick

        // Stop dribbling when kicking
        this.isDribbling = false;
        this.playKickSound(); // Play kick sound
      }
    }

    // Dribbling mechanics
    const ballDistance = this.player.position.distanceTo(this.ball.position);

    // Start dribbling if we run into the ball
    if (!this.isDribbling && ballDistance < 1.5 && this.ball.position.y < 1) {
      this.isDribbling = true;
      // Calculate initial offset from player
      this.dribbleOffset.subVectors(this.ball.position, this.player.position);
      this.dribbleOffset.y = 0; // Keep it on the ground
    }

    // Continue dribbling
    if (this.isDribbling) {
      // Stop dribbling if ball gets too far (kicked or separated)
      if (
        ballDistance > 3 ||
        Math.abs(this.ballVelocity.x) > 5 ||
        Math.abs(this.ballVelocity.z) > 5
      ) {
        this.isDribbling = false;
      } else {
        // Keep ball in front of player based on facing direction
        const dribbleDistance = 1.2;
        const targetX =
          this.player.position.x -
          Math.sin(this.player.rotation.y) * dribbleDistance;
        const targetZ =
          this.player.position.z -
          Math.cos(this.player.rotation.y) * dribbleDistance;

        // Smoothly move ball to target position
        const lerpFactor = 0.2;
        this.ball.position.x += (targetX - this.ball.position.x) * lerpFactor;
        this.ball.position.z += (targetZ - this.ball.position.z) * lerpFactor;

        // Add bounce effect when moving
        if (isMoving) {
          const bounceHeight =
            0.5 + Math.abs(Math.sin(this.animationTime * 8)) * 0.15;
          this.ball.position.y = bounceHeight;
        } else {
          this.ball.position.y = 0.5; // Keep at ground level when stationary
        }

        // Reduce ball velocity when dribbling
        this.ballVelocity.multiplyScalar(0.8);

        // Add slight random movement for realistic dribbling
        if (isMoving) {
          this.ball.position.x += (Math.random() - 0.5) * 0.05;
          this.ball.position.z += (Math.random() - 0.5) * 0.05;

          // Rotate ball based on movement direction
          const moveDir = new THREE.Vector3(
            -Math.sin(this.player.rotation.y),
            0,
            -Math.cos(this.player.rotation.y)
          );
          this.ball.rotation.x -= moveDir.z * 0.2;
          this.ball.rotation.z += moveDir.x * 0.2;
        }
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

    // Update ball physics (skip if dribbling)
    if (!this.isDribbling) {
      // Apply velocity
      this.ball.position.add(
        this.ballVelocity.clone().multiplyScalar(deltaTime)
      );

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
        this.updateCornerDisplay();

        // Trigger fan celebration
        this.startCelebration();

        // Goal scored! Create confetti
        this.createConfetti(new THREE.Vector3(goal.position.x, 4, 0));

        // Reset ball to center
        this.ball.position.set(0, 0.5, 0);
        this.ballVelocity.set(0, 0, 0);
        this.isDribbling = false;

        // Reset player position
        this.player.position.set(-fieldLength / 4, 0.5, 0);
      }
    });

    // Reset ball if it goes too far behind the goal
    if (Math.abs(this.ball.position.x) > fieldLength / 2 + 5) {
      this.ball.position.set(0, 0.5, 0);
      this.ballVelocity.set(0, 0, 0);
      this.isDribbling = false;
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

    // Animate crowd
    this.scene.traverse((child) => {
      if (
        child.parent &&
        child.parent.userData &&
        child.parent.userData.isCrowd
      ) {
        const mesh = child as THREE.Mesh;
        if (mesh.userData.baseY) {
          // Enhanced jumping during celebration
          const time = this.animationTime + mesh.userData.animOffset;
          const celebrationMultiplier = this.isCelebrating ? 3 : 1;
          const jumpSpeed = mesh.userData.animSpeed * celebrationMultiplier;
          const jumpHeight =
            Math.sin(time * jumpSpeed) * 0.3 * celebrationMultiplier;
          mesh.position.y = mesh.userData.baseY + Math.max(0, jumpHeight);

          // Random rotation during celebration
          if (this.isCelebrating) {
            mesh.rotation.y += Math.sin(time * 2) * 0.05;
          }
        }
      }
    });

    // Update celebration effects
    if (this.isCelebrating) {
      this.celebrationTime += deltaTime;

      // Animate horns and flags
      this.celebrationEffects.forEach((effect) => {
        if (effect.userData.isEffect) {
          // Animate horns (bobbing motion)
          if (effect.userData.baseY) {
            const time = this.animationTime + effect.userData.animOffset;
            effect.position.y =
              effect.userData.baseY + Math.sin(time * 3) * 0.5;
            effect.rotation.z = Math.sin(time * 2) * 0.1;
          }

          // Animate flags (waving motion)
          if (effect.userData.flag) {
            const flag = effect.userData.flag as THREE.Mesh;
            const time = this.animationTime * effect.userData.waveSpeed;
            flag.rotation.y = Math.sin(time) * effect.userData.waveAmount;
            effect.rotation.y += deltaTime * 0.5; // Rotate flag pole
          }

          // Animate smoke/streamer particles
          if (effect.userData.velocity) {
            // Update position
            effect.position.add(
              effect.userData.velocity.clone().multiplyScalar(deltaTime)
            );

            // Apply gravity
            effect.userData.velocity.y -= 15 * deltaTime;

            // Update lifetime and opacity
            effect.userData.lifetime += deltaTime;
            const material = effect.material as THREE.MeshLambertMaterial;
            material.opacity = Math.max(
              0,
              0.8 - effect.userData.lifetime * 0.2
            );

            // Rotate particle
            effect.rotation.x += deltaTime * 2;
            effect.rotation.z += deltaTime * 3;
          }
        }
      });

      // End celebration after 5 seconds
      if (this.celebrationTime > 5) {
        this.isCelebrating = false;

        // Remove celebration effects
        this.celebrationEffects.forEach((effect) => {
          this.scene.remove(effect);
          if (effect.geometry) effect.geometry.dispose();
          if (effect.material) (effect.material as THREE.Material).dispose();
        });
        this.celebrationEffects = [];
      }
    }

    // Update lastKeys for next frame
    Object.assign(this.lastKeys, this.keys);
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const currentTime = performance.now();
    const deltaTime =
      this.lastTime === 0
        ? 0.016
        : Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
  };
}

// Start the game when the page loads
window.addEventListener("DOMContentLoaded", () => {
  new SoccerGame();
});
