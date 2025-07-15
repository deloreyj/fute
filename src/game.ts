import * as THREE from "three";
import { TeamType, TEAM_KITS } from "./teamKits";

// Field and penalty constants
const FIELD_LENGTH = 115;
const FIELD_WIDTH = 75;
const PENALTY_AREA_WIDTH = 44;
const PENALTY_AREA_DEPTH = 18;
const PENALTY_SPOT = 12; // Distance from goal line
const GOAL_WIDTH = 16;



/** Player role for kit variations */
enum PlayerRole {
  FIELD = "field",
  GOALKEEPER = "goalkeeper",
}

/**
 * Game states
 */
enum GameState {
  MENU = "menu",
  WALKOUT = "walkout",
  PLAYING = "playing",
}

/**
 * Difficulty levels
 */
enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

/**
 * Player positions
 */
enum Position {
  GK = "GK", // Goalkeeper
  LB = "LB", // Left Back
  CB = "CB", // Center Back
  RB = "RB", // Right Back
  LM = "LM", // Left Midfielder
  CM = "CM", // Center Midfielder
  RM = "RM", // Right Midfielder
  LW = "LW", // Left Winger
  ST = "ST", // Striker
  RW = "RW", // Right Winger
}


/**
 * Referee types
 */
enum RefereeType {
  MAIN = "main",
  ASSISTANT_1 = "assistant1",
  ASSISTANT_2 = "assistant2",
}

/**
 * Player data structure
 */
interface Player {
  mesh: THREE.Mesh;
  team: TeamType;
  position: Position;
  number: number;
  isHuman: boolean;
  velocity: THREE.Vector3;
  targetPosition?: THREE.Vector3;
  hasBall?: boolean;
  
  lastFoulTime?: number;
  isTackling?: boolean;
  tackleTime?: number;
  tackleTouchedBall?: boolean;
  isFalling?: boolean;
  fallTime?: number;
  isOnGround?: boolean;
  // Goalkeeper specific state
  isDiving?: boolean;
  diveTime?: number;
  holdTime?: number;
  /** Prevent immediate recapture after releasing the ball */
  releaseCooldown?: number;

  /** When true the player cannot move */
  isFrozen?: boolean;
}

/**
 * Referee data structure
 */
interface Referee {
  mesh: THREE.Mesh;
  type: RefereeType;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
}

/**
 * Foul data
 */
interface Foul {
  offender: Player;
  victim: Player;
  position: THREE.Vector3;
  severity: number; // 0-1, determines yellow or red
}

/**
 * Main game class for the soccer game
 */
class SoccerGame {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // Game state
  private gameState: GameState = GameState.MENU;
  private difficulty: Difficulty = Difficulty.MEDIUM;

  // Game objects
  private players: Player[] = [];
  private humanPlayer: Player | null = null;
  private ball: THREE.Mesh;
  private goals: THREE.Mesh[] = [];
  private confettiParticles: THREE.Points[] = [];
  private goalkeepers: Player[] = [];

  // Referees
  private referees: Referee[] = [];
  private foulCooldown: number = 0;
  private lastFoul: Foul | null = null;

  // UI elements
  private menuContainer: HTMLDivElement | null = null;
  private touchControlsContainer: HTMLDivElement | null = null;
  private endContainer: HTMLDivElement | null = null;
  private passBubble: HTMLDivElement | null = null;
  private passBubbleTimer = 0;

  // Movement state
  private keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    t: false,
    z: false,
    d: false,
  };

  private lastKeys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    t: false,
    z: false,
    d: false,
  };

  // Ball physics
  private ballVelocity = new THREE.Vector3();

  // Dribbling state
  private isDribbling = false;
  private dribbleOffset = new THREE.Vector3();
  private dribblingPlayer: Player | null = null;

  // Animation
  private animationTime = 0;
  private lastTime = 0;
  private walkoutTime = 0;

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
    home: 0, // Left side (Sporting)
    away: 0, // Right side (Benfica)
  };
  private scoreboard: THREE.Group | null = null;

  // Match timing
  private halfDuration = 60; // seconds per half
  private currentHalf = 1;
  private gameClock = 0;
  private timeDisplay: HTMLDivElement | null = null;
  private isPaused = false;

  // Extra time flag
  private extraTimeAdded = false;

  // Penalty shootout
  private penaltyShootout = false;
  private penaltyScores = { home: 0, away: 0, shots: 0 };

  // Penalty kick state
  private isPenaltyKick = false;
  private penaltyPlayer: Player | null = null;
  private penaltySide: number = 1;
  private penaltyListener: ((e: MouseEvent | TouchEvent) => void) | null = null;

  // Free kick state
  private isFreeKick = false;
  private freeKickPlayer: Player | null = null;
  private originalHumanPlayer: Player | null = null;

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
      // Create pass speech bubble element
      this.passBubble = document.createElement("div");
      this.passBubble.textContent = "pass!";
      this.passBubble.style.position = "absolute";
      this.passBubble.style.padding = "4px 6px";
      this.passBubble.style.background = "rgba(255,255,255,0.9)";
      this.passBubble.style.color = "#000";
      this.passBubble.style.borderRadius = "4px";
      this.passBubble.style.fontSize = "14px";
      this.passBubble.style.pointerEvents = "none";
      this.passBubble.style.transform = "translate(-50%, -100%)";
      this.passBubble.style.display = "none";
      container.appendChild(this.passBubble);
    }

    // Time display element
    this.timeDisplay = document.getElementById(
      "time-display"
    ) as HTMLDivElement | null;

    // Pause button
    const pauseButton = document.getElementById(
      "pause-button"
    ) as HTMLButtonElement | null;
    if (pauseButton) {
      pauseButton.addEventListener("click", () => {
        this.isPaused = !this.isPaused;
        pauseButton.textContent = this.isPaused ? "Resume" : "Pause";
      });
    }

    // Exit button
    const exitButton = document.getElementById(
      "exit-button"
    ) as HTMLButtonElement | null;
    if (exitButton) {
      exitButton.addEventListener("click", () => {
        const controls = document.getElementById("controls");
        if (controls) {
          controls.style.display = "none";
        }
        this.gameState = GameState.MENU;
        this.showMenu();
      });
    }

    // Initialize scene objects (but don't create players yet)
    this.setupLighting();
    this.createField();
    this.createStadium();
    this.ball = this.createBall();

    // Set up controls
    this.setupControls();
    this.setupTouchControls();

    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Initialize audio on first user interaction
    window.addEventListener("click", () => this.initAudio(), { once: true });
    window.addEventListener("keydown", () => this.initAudio(), { once: true });
    window.addEventListener("touchstart", () => this.initAudio(), {
      once: true,
    });

    // Show menu first
    this.showMenu();

    // Start game loop
    this.animate();
  }

  /**
   * Show the difficulty selection menu
   */
  private showMenu(): void {
    // Hide the game canvas initially
    this.renderer.domElement.style.opacity = "0.3";
    if (this.touchControlsContainer) {
      this.touchControlsContainer.style.display = "none";
    }

    // Create menu container
    this.menuContainer = document.createElement("div");
    this.menuContainer.style.position = "fixed";
    this.menuContainer.style.top = "50%";
    this.menuContainer.style.left = "50%";
    this.menuContainer.style.transform = "translate(-50%, -50%)";
    this.menuContainer.style.textAlign = "center";
    this.menuContainer.style.color = "white";
    this.menuContainer.style.fontFamily = "Arial, sans-serif";
    this.menuContainer.style.zIndex = "1000";

    // Title
    const title = document.createElement("h1");
    title.textContent = "⚽ SPORTING vs BENFICA ⚽";
    title.style.fontSize = "48px";
    title.style.marginBottom = "20px";
    title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.8)";
    this.menuContainer.appendChild(title);

    // Subtitle
    const subtitle = document.createElement("p");
    subtitle.textContent = "Choose Your Difficulty";
    subtitle.style.fontSize = "24px";
    subtitle.style.marginBottom = "40px";
    this.menuContainer.appendChild(subtitle);

    // Difficulty buttons
    const difficulties = [
      {
        level: Difficulty.EASY,
        label: "🟢 EASY",
        desc: "Chill vibes, perfect for beginners",
      },
      {
        level: Difficulty.MEDIUM,
        label: "🟡 MEDIUM",
        desc: "Balanced gameplay for most players",
      },
      {
        level: Difficulty.HARD,
        label: "🔴 HARD",
        desc: "For the real pros only!",
      },
    ];

    difficulties.forEach(({ level, label, desc }) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.display = "block";
      button.style.margin = "10px auto";
      button.style.padding = "15px 40px";
      button.style.fontSize = "20px";
      button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      button.style.color = "white";
      button.style.border = "2px solid white";
      button.style.borderRadius = "10px";
      button.style.cursor = "pointer";
      button.style.transition = "all 0.3s";
      button.style.width = "300px";

      const description = document.createElement("div");
      description.textContent = desc;
      description.style.fontSize = "14px";
      description.style.marginTop = "5px";
      description.style.opacity = "0.8";
      button.appendChild(description);

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        button.style.transform = "scale(1.05)";
      });

      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        button.style.transform = "scale(1)";
      });

      button.addEventListener("click", () => {
        this.difficulty = level;
        this.startMatch();
      });

      this.menuContainer!.appendChild(button);
    });

    document.body.appendChild(this.menuContainer);
  }

  /**
   * Start the match after difficulty selection
   */
  private startMatch(): void {
    // Remove menu
    if (this.menuContainer) {
      this.menuContainer.remove();
      this.menuContainer = null;
    }
    if (this.endContainer) {
      this.endContainer.remove();
      this.endContainer = null;
    }

    // Show game canvas
    this.renderer.domElement.style.opacity = "1";
    if (this.touchControlsContainer) {
      this.touchControlsContainer.style.display = "block";
    }

    // Create teams
    this.createTeams();

    // Create referees
    this.createReferees();


    // Reset match timing
    this.currentHalf = 1;
    this.gameClock = 0;
    this.penaltyShootout = false;
    this.penaltyScores = { home: 0, away: 0, shots: 0 };
    this.updateTimeDisplay();

    // Start walkout animation
    this.gameState = GameState.WALKOUT;
    this.walkoutTime = 0;
  }

  /** Show options after the match ends */
  private showEndOptions(): void {
    if (this.endContainer) {
      this.endContainer.remove();
    }

    if (this.touchControlsContainer) {
      this.touchControlsContainer.style.display = "none";
    }
    this.endContainer = document.createElement("div");
    this.endContainer.style.position = "fixed";
    this.endContainer.style.top = "50%";
    this.endContainer.style.left = "50%";
    this.endContainer.style.transform = "translate(-50%, -50%)";
    this.endContainer.style.textAlign = "center";
    this.endContainer.style.color = "white";
    this.endContainer.style.fontFamily = "Arial, sans-serif";
    this.endContainer.style.zIndex = "1000";

    const restart = document.createElement("button");
    restart.textContent = "🔄 Restart";
    const exit = document.createElement("button");
    exit.textContent = "↩️ Exit to Title";

    const styleBtn = (btn: HTMLButtonElement) => {
      btn.style.display = "block";
      btn.style.margin = "10px auto";
      btn.style.padding = "15px 40px";
      btn.style.fontSize = "20px";
      btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      btn.style.color = "white";
      btn.style.border = "2px solid white";
      btn.style.borderRadius = "10px";
      btn.style.cursor = "pointer";
      btn.style.transition = "all 0.3s";
      btn.style.width = "300px";
      btn.addEventListener("mouseover", () => {
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        btn.style.transform = "scale(1.05)";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        btn.style.transform = "scale(1)";
      });
    };

    styleBtn(restart);
    styleBtn(exit);

    restart.addEventListener("click", () => {
      if (this.endContainer) {
        this.endContainer.remove();
        this.endContainer = null;
      }
      this.startMatch();
    });

    exit.addEventListener("click", () => {
      if (this.endContainer) {
        this.endContainer.remove();
        this.endContainer = null;
      }
      this.showMenu();
    });

    this.endContainer.appendChild(restart);
    this.endContainer.appendChild(exit);
    document.body.appendChild(this.endContainer);
  }

  /**
   * Create both teams with 11 players each
   */
  private createTeams(): void {
    // Clear any existing players
    this.players.forEach((player) => {
      this.scene.remove(player.mesh);
    });
    this.players = [];
    this.goalkeepers = [];

    // Formation: 4-3-3
    const formations = {
      [TeamType.SPORTING]: [
        { pos: Position.GK, x: -50, z: 0, num: 1 },
        { pos: Position.LB, x: -35, z: -20, num: 2 },
        { pos: Position.CB, x: -35, z: -7, num: 3 },
        { pos: Position.CB, x: -35, z: 7, num: 4 },
        { pos: Position.RB, x: -35, z: 20, num: 5 },
        { pos: Position.LM, x: -15, z: -15, num: 6 },
        { pos: Position.CM, x: -15, z: 0, num: 8 },
        { pos: Position.RM, x: -15, z: 15, num: 10 },
        { pos: Position.LW, x: 5, z: -20, num: 11 },
        { pos: Position.ST, x: 5, z: 0, num: 9 },
        { pos: Position.RW, x: 5, z: 20, num: 7 },
      ],
      [TeamType.BENFICA]: [
        { pos: Position.GK, x: 50, z: 0, num: 1 },
        { pos: Position.LB, x: 35, z: 20, num: 2 },
        { pos: Position.CB, x: 35, z: 7, num: 3 },
        { pos: Position.CB, x: 35, z: -7, num: 4 },
        { pos: Position.RB, x: 35, z: -20, num: 5 },
        { pos: Position.LM, x: 15, z: 15, num: 6 },
        { pos: Position.CM, x: 15, z: 0, num: 8 },
        { pos: Position.RM, x: 15, z: -15, num: 10 },
        { pos: Position.LW, x: -5, z: 20, num: 11 },
        { pos: Position.ST, x: -5, z: 0, num: 9 },
        { pos: Position.RW, x: -5, z: -20, num: 7 },
      ],
    };

    // Create Sporting team
    formations[TeamType.SPORTING].forEach((info, index) => {
      const role = info.pos === Position.GK ? PlayerRole.GOALKEEPER : PlayerRole.FIELD;
      const player: Player = {
        mesh: this.createPlayer(TeamType.SPORTING, role),
        team: TeamType.SPORTING,
        position: info.pos,
        number: info.num,
        isHuman: index === 9, // Make the striker the human player
        velocity: new THREE.Vector3(),
        isDiving: false,
        diveTime: 0,
        holdTime: 0,
        releaseCooldown: 0,
      };

      // Position for walkout (in tunnel)
      player.mesh.position.set(-80, 0, -30 + index * 3);

      this.players.push(player);
      if (info.pos === Position.GK) {
        this.goalkeepers.push(player);
      }

      if (player.isHuman) {
        this.humanPlayer = player;
        this.currentTeam = TeamType.SPORTING;
      }
    });

    // Create Benfica team
    formations[TeamType.BENFICA].forEach((info, index) => {
      const role = info.pos === Position.GK ? PlayerRole.GOALKEEPER : PlayerRole.FIELD;
      const player: Player = {
        mesh: this.createPlayer(TeamType.BENFICA, role),
        team: TeamType.BENFICA,
        position: info.pos,
        number: info.num,
        isHuman: false,
        velocity: new THREE.Vector3(),
        isDiving: false,
        diveTime: 0,
        holdTime: 0,
        releaseCooldown: 0,
      };

      // Position for walkout (in tunnel)
      player.mesh.position.set(-80, 0, 5 + index * 3);

      this.players.push(player);
      if (info.pos === Position.GK) {
        this.goalkeepers.push(player);
      }
    });
  }

  /**
   * Create referees
   */
  private createReferees(): void {
    // Clear existing referees
    this.referees.forEach((ref) => {
      this.scene.remove(ref.mesh);
    });
    this.referees = [];

    // Create main referee
    const mainRef: Referee = {
      mesh: this.createReferee(RefereeType.MAIN),
      type: RefereeType.MAIN,
      position: new THREE.Vector3(0, 0, 0),
      targetPosition: new THREE.Vector3(0, 0, 0),
    };
    mainRef.mesh.position.set(0, 0, 0);
    this.referees.push(mainRef);

    // Create assistant referees (linesmen)
    const assistant1: Referee = {
      mesh: this.createReferee(RefereeType.ASSISTANT_1),
      type: RefereeType.ASSISTANT_1,
      position: new THREE.Vector3(-50, 0, -40),
      targetPosition: new THREE.Vector3(-50, 0, -40),
    };
    assistant1.mesh.position.set(-50, 0, -40);
    this.referees.push(assistant1);

    const assistant2: Referee = {
      mesh: this.createReferee(RefereeType.ASSISTANT_2),
      type: RefereeType.ASSISTANT_2,
      position: new THREE.Vector3(50, 0, 40),
      targetPosition: new THREE.Vector3(50, 0, 40),
    };
    assistant2.mesh.position.set(50, 0, 40);
    this.referees.push(assistant2);
  }

  /**
   * Create a referee mesh
   */
  private createReferee(type: RefereeType): THREE.Mesh {
    const refGroup = new THREE.Group();

    // Body (black shirt)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5;
    body.castShadow = true;
    refGroup.add(body);

    // Shorts (black)
    const shortsGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);
    const shortsMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.y = 0.8;
    refGroup.add(shorts);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.3;
    head.castShadow = true;
    refGroup.add(head);

    // Legs (black socks)
    const legGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.3, 0);
    refGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.3, 0);
    refGroup.add(rightLeg);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 1.5, 0);
    refGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 1.5, 0);
    refGroup.add(rightArm);

    // Add flag for assistant referees
    if (type === RefereeType.ASSISTANT_1 || type === RefereeType.ASSISTANT_2) {
      const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
      const flagPoleMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
      flagPole.position.set(0.7, 1.8, 0);
      refGroup.add(flagPole);

      const flagGeometry = new THREE.PlaneGeometry(0.5, 0.4);
      const flagMaterial = new THREE.MeshPhongMaterial({
        color: type === RefereeType.ASSISTANT_1 ? 0xff0000 : 0xffff00,
        side: THREE.DoubleSide,
      });
      const flag = new THREE.Mesh(flagGeometry, flagMaterial);
      flag.position.set(0.95, 2.5, 0);
      refGroup.add(flag);
    }

    this.scene.add(refGroup);
    return refGroup as unknown as THREE.Mesh;
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

  /** Update on-screen clock */
  private updateTimeDisplay(): void {
    if (!this.timeDisplay) return;
    if (this.penaltyShootout) {
      this.timeDisplay.textContent = `PENALTIES ${this.penaltyScores.home}-${this.penaltyScores.away}`;
      return;
    }
    const remaining = Math.max(0, Math.floor(this.halfDuration - this.gameClock));
    const minutes = Math.floor(remaining / 60);
    const seconds = (remaining % 60).toString().padStart(2, "0");
    this.timeDisplay.textContent = `H${this.currentHalf} ${minutes}:${seconds}`;
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
  private createPlayer(teamType: TeamType, role: PlayerRole = PlayerRole.FIELD): THREE.Mesh {
    const playerGroup = new THREE.Group();

    // Field dimensions for positioning
    const fieldLength = 115;

    // Common colors
    const skinColor = 0xfad8b0; // Light warm tan
    const hairColor = 0x2a2a2a; // Dark brown/black
    const shoeGray = 0x555555;

    // Load kit colors from constants
    const kit =
      role === PlayerRole.GOALKEEPER
        ? TEAM_KITS[teamType].goalkeeper
        : TEAM_KITS[teamType].field;
    let { shirtColors, shortsColor, sockPrimaryColor, sockSecondaryColor } = kit;

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

    if (teamType === TeamType.SPORTING && role === PlayerRole.FIELD) {
      // Create horizontal stripes for Sporting field players
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
      // Solid color shirt for Benfica players and all goalkeepers
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

      // White collar/trim for Benfica field players
      if (teamType === TeamType.BENFICA && role === PlayerRole.FIELD) {
        const collarGeometry = new THREE.BoxGeometry(1.21, 0.1, 0.61);
        const collarMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          flatShading: true,
        });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.y = 2.0;
        torsoGroup.add(collar);
      }
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
    controlsContainer.style.display = "none"; // Hidden until difficulty is selected
    document.body.appendChild(controlsContainer);
    this.touchControlsContainer = controlsContainer;

    // Create joystick container
    const joystickContainer = document.createElement("div");
    joystickContainer.style.position = "absolute";
    joystickContainer.style.bottom = "20px";
    joystickContainer.style.left = "20px";
    joystickContainer.style.width = "150px";
    joystickContainer.style.height = "150px";
    joystickContainer.style.pointerEvents = "auto";
    controlsContainer.appendChild(joystickContainer);

    // Joystick base
    const joystickBase = document.createElement("div");
    joystickBase.style.position = "absolute";
    joystickBase.style.width = "100%";
    joystickBase.style.height = "100%";
    joystickBase.style.borderRadius = "50%";
    joystickBase.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    joystickContainer.appendChild(joystickBase);

    // Joystick knob
    const joystickKnob = document.createElement("div");
    joystickKnob.style.position = "absolute";
    joystickKnob.style.left = "50%";
    joystickKnob.style.top = "50%";
    joystickKnob.style.width = "60px";
    joystickKnob.style.height = "60px";
    joystickKnob.style.marginLeft = "-30px";
    joystickKnob.style.marginTop = "-30px";
    joystickKnob.style.borderRadius = "50%";
    joystickKnob.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    joystickKnob.style.border = "2px solid rgba(255, 255, 255, 0.5)";
    joystickKnob.style.touchAction = "none";
    joystickKnob.style.pointerEvents = "none";
    joystickContainer.appendChild(joystickKnob);

    let joystickCenter = { x: 0, y: 0 };
    const deadZone = 20;

    const updateMovement = (touch: Touch) => {
      const dx = touch.clientX - joystickCenter.x;
      const dy = touch.clientY - joystickCenter.y;
      const clamp = (v: number) => Math.max(-40, Math.min(40, v));
      joystickKnob.style.transform = `translate(${clamp(dx)}px, ${clamp(dy)}px)`;
      this.keys.ArrowUp = dy < -deadZone;
      this.keys.ArrowDown = dy > deadZone;
      this.keys.ArrowLeft = dx < -deadZone;
      this.keys.ArrowRight = dx > deadZone;
    };

    const endMovement = () => {
      joystickKnob.style.transform = "translate(0px, 0px)";
      this.keys.ArrowUp = this.keys.ArrowDown = this.keys.ArrowLeft = this.keys.ArrowRight = false;
    };

    joystickContainer.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const rect = joystickContainer.getBoundingClientRect();
      joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      updateMovement(e.touches[0]);
    });

    joystickContainer.addEventListener("touchmove", (e) => {
      e.preventDefault();
      updateMovement(e.touches[0]);
    });

    joystickContainer.addEventListener("touchend", (e) => {
      e.preventDefault();
      endMovement();
    });

    joystickContainer.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      endMovement();
    });

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

    // Create pass button (Z)
    const passButton = document.createElement("button");
    passButton.style.position = "absolute";
    passButton.style.bottom = "130px";
    passButton.style.right = "40px";
    passButton.style.width = "70px";
    passButton.style.height = "70px";
    passButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    passButton.style.border = "2px solid rgba(255, 255, 255, 0.5)";
    passButton.style.borderRadius = "50%";
    passButton.style.cursor = "pointer";
    passButton.style.display = "flex";
    passButton.style.alignItems = "center";
    passButton.style.justifyContent = "center";
    passButton.style.fontSize = "16px";
    passButton.style.fontWeight = "bold";
    passButton.style.color = "rgba(255, 255, 255, 0.8)";
    passButton.style.userSelect = "none";
    passButton.style.webkitUserSelect = "none";
    passButton.style.touchAction = "none";
    passButton.style.pointerEvents = "auto";
    passButton.textContent = "PASS";

    // Pass button events
    passButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.keys.z = true;
      passButton.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      passButton.style.transform = "scale(0.95)";
    });

    passButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.keys.z = false;
      passButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      passButton.style.transform = "scale(1)";
    });

    passButton.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.keys.z = false;
      passButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      passButton.style.transform = "scale(1)";
    });

    controlsContainer.appendChild(passButton);

    // Create tackle button (D)
    const tackleButton = document.createElement("button");
    tackleButton.style.position = "absolute";
    tackleButton.style.bottom = "40px";
    tackleButton.style.right = "130px";
    tackleButton.style.width = "70px";
    tackleButton.style.height = "70px";
    tackleButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    tackleButton.style.border = "2px solid rgba(255, 255, 255, 0.5)";
    tackleButton.style.borderRadius = "50%";
    tackleButton.style.cursor = "pointer";
    tackleButton.style.display = "flex";
    tackleButton.style.alignItems = "center";
    tackleButton.style.justifyContent = "center";
    tackleButton.style.fontSize = "16px";
    tackleButton.style.fontWeight = "bold";
    tackleButton.style.color = "rgba(255, 255, 255, 0.8)";
    tackleButton.style.userSelect = "none";
    tackleButton.style.webkitUserSelect = "none";
    tackleButton.style.touchAction = "none";
    tackleButton.style.pointerEvents = "auto";
    tackleButton.textContent = "TACKLE";

    // Tackle button events
    tackleButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.keys.d = true;
      tackleButton.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      tackleButton.style.transform = "scale(0.95)";
    });

    tackleButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.keys.d = false;
      tackleButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      tackleButton.style.transform = "scale(1)";
    });

    tackleButton.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.keys.d = false;
      tackleButton.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      tackleButton.style.transform = "scale(1)";
    });

    controlsContainer.appendChild(tackleButton);
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
   * Display a speech bubble above the human player when passing
   */
  private showPassBubble(): void {
    if (!this.passBubble) return;
    this.passBubbleTimer = 1;
  }

  /**
   * Update walkout animation
   */
  private updateWalkout(deltaTime: number): void {
    this.walkoutTime += deltaTime;

    // Move players out from tunnel
    const walkSpeed = 5 * deltaTime;

    this.players.forEach((player, index) => {
      if (player.team === TeamType.SPORTING) {
        // Sporting walks to the left side
        const targetX =
          -50 + (player.position === Position.GK ? 0 : 15 + index * 2);
        if (player.mesh.position.x < targetX) {
          player.mesh.position.x += walkSpeed;
          // Animate walking
          this.animatePlayerWalking(player, deltaTime);
        }
      } else {
        // Barcelona walks to the right side
        const targetX =
          50 - (player.position === Position.GK ? 0 : 15 + (index - 11) * 2);
        if (player.mesh.position.x < targetX) {
          player.mesh.position.x += walkSpeed;
          // Animate walking
          this.animatePlayerWalking(player, deltaTime);
        }
      }
    });

    // After 5 seconds, position players and start the game
    if (this.walkoutTime > 5) {
      this.positionPlayersForKickoff();
      this.gameState = GameState.PLAYING;
    }
  }

  /**
   * Position players for kickoff
   */
  private positionPlayersForKickoff(): void {
    const formations = {
      [TeamType.SPORTING]: [
        { pos: Position.GK, x: -50, z: 0 },
        { pos: Position.LB, x: -35, z: -20 },
        { pos: Position.CB, x: -35, z: -7 },
        { pos: Position.CB, x: -35, z: 7 },
        { pos: Position.RB, x: -35, z: 20 },
        { pos: Position.LM, x: -15, z: -15 },
        { pos: Position.CM, x: -15, z: 0 },
        { pos: Position.RM, x: -15, z: 15 },
        { pos: Position.LW, x: 5, z: -20 },
        { pos: Position.ST, x: 5, z: 0 },
        { pos: Position.RW, x: 5, z: 20 },
      ],
      [TeamType.BENFICA]: [
        { pos: Position.GK, x: 50, z: 0 },
        { pos: Position.LB, x: 35, z: 20 },
        { pos: Position.CB, x: 35, z: 7 },
        { pos: Position.CB, x: 35, z: -7 },
        { pos: Position.RB, x: 35, z: -20 },
        { pos: Position.LM, x: 15, z: 15 },
        { pos: Position.CM, x: 15, z: 0 },
        { pos: Position.RM, x: 15, z: -15 },
        { pos: Position.LW, x: -5, z: 20 },
        { pos: Position.ST, x: -5, z: 0 },
        { pos: Position.RW, x: -5, z: -20 },
      ],
    };

    this.players.forEach((player) => {
      const formation =
        player.team === TeamType.SPORTING
          ? formations[TeamType.SPORTING]
          : formations[TeamType.BENFICA];
      const pos = formation.find((f) => f.pos === player.position);
      if (pos) {
        player.mesh.position.x = pos.x;
        player.mesh.position.z = pos.z;
        player.targetPosition = new THREE.Vector3(pos.x, 0, pos.z);
      }
    });

    // Position ball at center
    this.ball.position.set(0, 0.5, 0);
    this.ballVelocity.set(0, 0, 0);
  }

  /**
   * Update human player
   */
  private updateHumanPlayer(deltaTime: number, moveSpeed: number): void {
    if (!this.humanPlayer) return;

    if (this.humanPlayer.isFrozen) {
      this.resetPlayerAnimation(this.humanPlayer);
      return;
    }

    let isMoving = false;

    // Player movement
    if (this.keys.ArrowUp) {
      this.humanPlayer.mesh.position.z -= moveSpeed;
      isMoving = true;
    }
    if (this.keys.ArrowDown) {
      this.humanPlayer.mesh.position.z += moveSpeed;
      isMoving = true;
    }
    if (this.keys.ArrowLeft) {
      this.humanPlayer.mesh.position.x -= moveSpeed;
      this.humanPlayer.mesh.rotation.y = Math.PI / 2;
      isMoving = true;
    }
    if (this.keys.ArrowRight) {
      this.humanPlayer.mesh.position.x += moveSpeed;
      this.humanPlayer.mesh.rotation.y = -Math.PI / 2;
      isMoving = true;
    }

    // Update facing direction
    if (this.keys.ArrowUp && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
      this.humanPlayer.mesh.rotation.y = -Math.PI / 2;
    }
    if (this.keys.ArrowDown && !this.keys.ArrowLeft && !this.keys.ArrowRight) {
      this.humanPlayer.mesh.rotation.y = Math.PI / 2;
    }

    // Animate player
    if (isMoving) {
      this.animatePlayerWalking(this.humanPlayer, deltaTime);
    } else {
      this.resetPlayerAnimation(this.humanPlayer);
    }

    // Shooting
    if (this.keys.Space) {
      const distance = this.humanPlayer.mesh.position.distanceTo(
        this.ball.position
      );
      if (distance < 2.5) {
        const kickPower = 25;
        this.ballVelocity.x =
          -Math.sin(this.humanPlayer.mesh.rotation.y) * kickPower;
        this.ballVelocity.z =
          -Math.cos(this.humanPlayer.mesh.rotation.y) * kickPower;
        this.ballVelocity.y = 5;

        this.isDribbling = false;
        this.dribblingPlayer = null;
        this.playKickSound();
        if (this.isFreeKick && this.freeKickPlayer === this.humanPlayer) {
          this.endFreeKick();
        }
      }
    }

    // Passing (Z key)
    if (this.keys.z && !this.lastKeys.z) {
      const distance = this.humanPlayer.mesh.position.distanceTo(
        this.ball.position
      );
      if (distance < 2.5) {
        this.passBall(this.humanPlayer);
        this.playKickSound();
        this.showPassBubble();
        if (this.isFreeKick && this.freeKickPlayer === this.humanPlayer) {
          this.endFreeKick();
        }
      } else if (
        this.dribblingPlayer &&
        !this.dribblingPlayer.isHuman &&
        this.dribblingPlayer.team === this.humanPlayer.team
      ) {
        this.passBallToPlayer(this.dribblingPlayer, this.humanPlayer);
        this.playKickSound();
        this.showPassBubble();
        if (this.isFreeKick && this.freeKickPlayer === this.humanPlayer) {
          this.endFreeKick();
        }
      }
    }

    // Slide tackle (D key)
    if (this.keys.d && !this.lastKeys.d) {
      this.slideTackle(this.humanPlayer);
    }

    // Dribbling
    if (!(this.isFreeKick && this.freeKickPlayer === this.humanPlayer)) {
      this.updateDribbling(this.humanPlayer, deltaTime);
    }
  }

  /**
   * Update AI players
   */
  private updateAIPlayers(deltaTime: number): void {
    if (this.isPenaltyKick) return;
    this.players.forEach((player) => {
      if (player.isHuman || player.position === Position.GK) return;
      if (player.isFrozen) {
        this.resetPlayerAnimation(player);
        return;
      }

      // Basic AI behavior based on difficulty
      const aiSpeed =
        this.difficulty === Difficulty.EASY
          ? 5
          : this.difficulty === Difficulty.MEDIUM
          ? 8
          : 10;

      // Simple AI: move towards ball if close
      const distanceToBall = player.mesh.position.distanceTo(
        this.ball.position
      );

      if (distanceToBall < 30 && !this.dribblingPlayer) {
        // Move towards ball
        const direction = new THREE.Vector3();
        direction.subVectors(this.ball.position, player.mesh.position);
        direction.y = 0;
        direction.normalize();

        player.mesh.position.x += direction.x * aiSpeed * deltaTime;
        player.mesh.position.z += direction.z * aiSpeed * deltaTime;

        // Face the ball
        player.mesh.lookAt(
          this.ball.position.x,
          player.mesh.position.y,
          this.ball.position.z
        );

        // Animate walking
        this.animatePlayerWalking(player, deltaTime);

        // Try to kick if very close
        if (distanceToBall < 2.5 && Math.random() < 0.1) {
          const kickPower = 20;
          this.ballVelocity.x = direction.x * kickPower;
          this.ballVelocity.z = direction.z * kickPower;
          this.ballVelocity.y = 3;
          this.playKickSound();
          if (this.isFreeKick && this.freeKickPlayer === player) {
            this.endFreeKick();
          }
        }

        // Try to tackle if opponent has ball
        if (this.dribblingPlayer && this.dribblingPlayer.team !== player.team) {
          const distanceToDribbler = player.mesh.position.distanceTo(
            this.dribblingPlayer.mesh.position
          );

          // Attempt slide tackle if close enough
          if (distanceToDribbler < 4 && Math.random() < 0.05) {
            this.slideTackle(player);
          }
        }
      } else if (player.targetPosition) {
        // Return to position
        const distanceToTarget = player.mesh.position.distanceTo(
          player.targetPosition
        );
        if (distanceToTarget > 2) {
          const direction = new THREE.Vector3();
          direction.subVectors(player.targetPosition, player.mesh.position);
          direction.y = 0;
          direction.normalize();

          player.mesh.position.x += direction.x * aiSpeed * 0.5 * deltaTime;
          player.mesh.position.z += direction.z * aiSpeed * 0.5 * deltaTime;

          this.animatePlayerWalking(player, deltaTime);
        } else {
          this.resetPlayerAnimation(player);
        }
      }

      // Handle dribbling logic for AI players
      if (!this.isFreeKick) {
        this.updateDribbling(player, deltaTime);
      }
    });
  }

  /**
   * Update goalkeeper behavior
   */
  private updateGoalkeepers(deltaTime: number): void {
    if (this.isPenaltyKick) return;
    const fieldLength = 115;
    this.goalkeepers.forEach((keeper) => {
      if (keeper.isFrozen) {
        this.resetPlayerAnimation(keeper);
        return;
      }
      if (keeper.releaseCooldown && keeper.releaseCooldown > 0) {
        keeper.releaseCooldown -= deltaTime;
      }
      const goalX =
        keeper.team === TeamType.SPORTING
          ? -fieldLength / 2 + 3
          : fieldLength / 2 - 3;

      // Move laterally to track the ball
      const targetZ = THREE.MathUtils.clamp(this.ball.position.z, -7, 7);
      keeper.mesh.position.z += (targetZ - keeper.mesh.position.z) * 5 * deltaTime;

      // Step out slightly when ball is near
      const ballDistX = Math.abs(this.ball.position.x - goalX);
      const outX = keeper.team === TeamType.SPORTING ? goalX + 1 : goalX - 1;
      const targetX = ballDistX < 20 ? outX : goalX;
      keeper.mesh.position.x += (targetX - keeper.mesh.position.x) * 3 * deltaTime;

      // Dive for fast shots
      const approaching =
        (keeper.team === TeamType.SPORTING && this.ballVelocity.x < -8) ||
        (keeper.team === TeamType.BENFICA && this.ballVelocity.x > 8);
      if (!keeper.isDiving && approaching && ballDistX < 10) {
        keeper.isDiving = true;
        keeper.diveTime = 0;
        const dir = this.ball.position.clone().sub(keeper.mesh.position);
        dir.y = 0;
        dir.normalize();
        keeper.velocity.copy(dir.multiplyScalar(20));
      }

      if (keeper.isDiving) {
        keeper.diveTime! += deltaTime;
        keeper.mesh.position.x += keeper.velocity.x * deltaTime;
        keeper.mesh.position.z += keeper.velocity.z * deltaTime;
        keeper.mesh.rotation.z = keeper.team === TeamType.SPORTING ? 0.5 : -0.5;
        if (keeper.diveTime! > 0.4) {
          keeper.isDiving = false;
          keeper.mesh.rotation.z = 0;
        }
      }

      // Catch ball with hands
      if (keeper.hasBall) {
        keeper.holdTime! += deltaTime;
        this.ball.position.set(
          keeper.mesh.position.x,
          keeper.mesh.position.y + 1,
          keeper.mesh.position.z
        );
        this.ballVelocity.set(0, 0, 0);
        if (keeper.holdTime! > 1) {
          keeper.hasBall = false;
          keeper.releaseCooldown = 0.5;
          this.rollBallToTeammate(keeper);
          if (this.isFreeKick && this.freeKickPlayer === keeper) {
            this.endFreeKick();
          }
          this.dribblingPlayer = null;
        }
      } else {
        const dist = keeper.mesh.position.distanceTo(this.ball.position);
        if (
          dist < 1.5 &&
          this.ball.position.y < 2 &&
          (keeper.releaseCooldown ?? 0) <= 0
        ) {
          keeper.hasBall = true;
          keeper.holdTime = 0;
          this.dribblingPlayer = keeper;
          this.isDribbling = false;
        }
      }
    });
  }

  /**
   * Update dribbling for a player
   */
  private updateDribbling(player: Player, deltaTime: number): void {
    const ballDistance = player.mesh.position.distanceTo(this.ball.position);

    // Start dribbling
    if (
      !this.dribblingPlayer &&
      ballDistance < 1.5 &&
      this.ball.position.y < 1
    ) {
      this.dribblingPlayer = player;
      this.dribbleOffset.subVectors(this.ball.position, player.mesh.position);
      this.dribbleOffset.y = 0;

      // Ensure AI players face the opponent goal when gaining control
      if (!player.isHuman) {
        const goalDir =
          player.team === TeamType.SPORTING ? -Math.PI / 2 : Math.PI / 2;
        player.mesh.rotation.y = goalDir;
      }
    }

    // Continue dribbling
    if (this.dribblingPlayer === player) {
      if (
        ballDistance > 3 ||
        Math.abs(this.ballVelocity.x) > 5 ||
        Math.abs(this.ballVelocity.z) > 5
      ) {
        this.dribblingPlayer = null;
      } else {
        const dribbleDistance = 1.2;
        const targetX =
          player.mesh.position.x -
          Math.sin(player.mesh.rotation.y) * dribbleDistance;
        const targetZ =
          player.mesh.position.z -
          Math.cos(player.mesh.rotation.y) * dribbleDistance;

        const lerpFactor = 0.2;
        this.ball.position.x += (targetX - this.ball.position.x) * lerpFactor;
        this.ball.position.z += (targetZ - this.ball.position.z) * lerpFactor;

        const bounceHeight =
          0.5 + Math.abs(Math.sin(this.animationTime * 8)) * 0.15;
        this.ball.position.y = bounceHeight;

        this.ballVelocity.multiplyScalar(0.8);
      }
    }
  }

  /**
   * Animate player walking
   */
  private animatePlayerWalking(player: Player, deltaTime: number): void {
    if (!player.mesh.userData || !player.mesh.userData.bones) return;

    const swingAmount = Math.sin(this.animationTime * 10) * 0.3;
    player.mesh.userData.bones.leftLeg.rotation.x = swingAmount;
    player.mesh.userData.bones.rightLeg.rotation.x = -swingAmount;
    player.mesh.userData.bones.leftArm.rotation.x = -swingAmount * 0.5;
    player.mesh.userData.bones.rightArm.rotation.x = swingAmount * 0.5;
  }

  /**
   * Reset player animation
   */
  private resetPlayerAnimation(player: Player): void {
    if (!player.mesh.userData || !player.mesh.userData.bones) return;

    player.mesh.userData.bones.leftLeg.rotation.x = 0;
    player.mesh.userData.bones.rightLeg.rotation.x = 0;
    player.mesh.userData.bones.leftArm.rotation.x = 0;
    player.mesh.userData.bones.rightArm.rotation.x = 0;
  }

  /**
   * Update game logic
   */
  private update(deltaTime: number): void {
    const moveSpeed = 15 * deltaTime;

    // Update animation time
    this.animationTime += deltaTime;

    // Handle different game states
    if (this.gameState === GameState.WALKOUT) {
      this.updateWalkout(deltaTime);
      return;
    } else if (this.gameState === GameState.MENU) {
      return;
    }

    // Only update game when playing
    if (this.gameState !== GameState.PLAYING) {
      return;
    }

    if (this.isPaused) {
      return;
    }

    if (!this.penaltyShootout) {
      this.gameClock += deltaTime;
      if (this.gameClock >= this.halfDuration) {
        this.endHalf();
      }
      this.updateTimeDisplay();
    }

    // Update human player
    if (this.humanPlayer) {
      this.updateHumanPlayer(deltaTime, moveSpeed);
    }

    // Update AI players
    this.updateAIPlayers(deltaTime);

    // Update goalkeepers
    this.updateGoalkeepers(deltaTime);

    // Update referees
    this.updateReferees(deltaTime);

    // Check for fouls
    this.checkForFouls();

    // Update tackle mechanics
    this.updateTackles(deltaTime);

    // Check for running tackles
    this.checkRunningTackles();

    // Keep players within field bounds
    const fieldWidth = 75;
    const fieldLength = 115;

    this.players.forEach((player) => {
      player.mesh.position.x = Math.max(
        -fieldLength / 2 + 1,
        Math.min(fieldLength / 2 - 1, player.mesh.position.x)
      );
      player.mesh.position.z = Math.max(
        -fieldWidth / 2 + 1,
        Math.min(fieldWidth / 2 - 1, player.mesh.position.z)
      );
    });

    // Team switching for human player
    if (this.keys.t && !this.lastKeys.t && this.humanPlayer) {
      // Toggle team
      this.currentTeam =
        this.currentTeam === TeamType.SPORTING
          ? TeamType.BENFICA
          : TeamType.SPORTING;

      // Save current position and rotation
      const currentPos = this.humanPlayer.mesh.position.clone();
      const currentRot = this.humanPlayer.mesh.rotation.clone();

      // Remove old player mesh
      this.scene.remove(this.humanPlayer.mesh);

      // Create new player mesh with different team
      this.humanPlayer.mesh = this.createPlayer(this.currentTeam);
      this.humanPlayer.mesh.position.copy(currentPos);
      this.humanPlayer.mesh.rotation.copy(currentRot);
      this.humanPlayer.team = this.currentTeam;
    }

    // Update ball physics
    if (!this.dribblingPlayer) {
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

        // Check for win condition
        this.checkGoalLimit();

        // Trigger fan celebration
        this.startCelebration();

        // Goal scored! Create confetti
        this.createConfetti(new THREE.Vector3(goal.position.x, 4, 0));

        // Reset ball to center
        this.ball.position.set(0, 0.5, 0);
        this.ballVelocity.set(0, 0, 0);
        this.isDribbling = false;

        // Reset human player position if exists
        if (this.humanPlayer) {
          this.humanPlayer.mesh.position.set(-fieldLength / 4, 0.5, 0);
        }
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

    // Camera follow human player from sideline (FIFA-style)
    if (this.humanPlayer && !this.isPenaltyKick) {
      this.camera.position.x = this.humanPlayer.mesh.position.x;
      this.camera.position.y = 25;
      this.camera.position.z = 50;
      this.camera.lookAt(
        this.humanPlayer.mesh.position.x,
        0,
        this.humanPlayer.mesh.position.z
      );
    } else if (this.isPenaltyKick && this.penaltyPlayer) {
      const spotX =
        this.penaltySide === -1
          ? -FIELD_LENGTH / 2 + PENALTY_SPOT
          : FIELD_LENGTH / 2 - PENALTY_SPOT;
      this.camera.position.set(spotX - this.penaltySide * 6, 5, 0);
      this.camera.lookAt(spotX, 2, 0);
    }

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

    if (this.passBubbleTimer > 0 && this.humanPlayer && this.passBubble) {
      this.passBubbleTimer -= deltaTime;
      const pos = this.humanPlayer.mesh.position.clone();
      pos.y += 3;
      pos.project(this.camera);
      const x = ((pos.x + 1) / 2) * window.innerWidth;
      const y = ((-pos.y + 1) / 2) * window.innerHeight;
      this.passBubble.style.left = `${x}px`;
      this.passBubble.style.top = `${y}px`;
      this.passBubble.style.display = "block";
      if (this.passBubbleTimer <= 0) {
        this.passBubble.style.display = "none";
      }
    }

    // Update last key states
    this.lastKeys.ArrowUp = this.keys.ArrowUp;
    this.lastKeys.ArrowDown = this.keys.ArrowDown;
    this.lastKeys.ArrowLeft = this.keys.ArrowLeft;
    this.lastKeys.ArrowRight = this.keys.ArrowRight;
    this.lastKeys.Space = this.keys.Space;
    this.lastKeys.t = this.keys.t;
    this.lastKeys.z = this.keys.z;
    this.lastKeys.d = this.keys.d;

    // Celebration animation
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

  /**
   * Update referees
   */
  private updateReferees(deltaTime: number): void {
    if (this.isFreeKick || this.isPenaltyKick) return;
    // Update foul cooldown
    if (this.foulCooldown > 0) {
      this.foulCooldown -= deltaTime;
    }


    // Main referee follows the ball
    const mainRef = this.referees.find((r) => r.type === RefereeType.MAIN);
    if (mainRef) {
      // Stay 10-15 units away from ball
      const idealDistance = 12;
      const direction = new THREE.Vector3();
      direction.subVectors(mainRef.position, this.ball.position);
      direction.y = 0;
      direction.normalize();

      const targetPos = this.ball.position.clone();
      targetPos.add(direction.multiplyScalar(idealDistance));

      // Move towards target
      const refSpeed = 10 * deltaTime;
      const moveDir = new THREE.Vector3();
      moveDir.subVectors(targetPos, mainRef.mesh.position);
      moveDir.y = 0;

      if (moveDir.length() > 0.5) {
        moveDir.normalize();
        mainRef.mesh.position.x += moveDir.x * refSpeed;
        mainRef.mesh.position.z += moveDir.z * refSpeed;

        // Face the ball
        mainRef.mesh.lookAt(
          this.ball.position.x,
          mainRef.mesh.position.y,
          this.ball.position.z
        );
      }
    }

    // Assistant referees stay on sidelines
    const assistant1 = this.referees.find(
      (r) => r.type === RefereeType.ASSISTANT_1
    );
    if (assistant1) {
      assistant1.mesh.position.x = Math.max(
        -50,
        Math.min(0, this.ball.position.x)
      );
      assistant1.mesh.position.z = -40;
    }

    const assistant2 = this.referees.find(
      (r) => r.type === RefereeType.ASSISTANT_2
    );
    if (assistant2) {
      assistant2.mesh.position.x = Math.max(
        0,
        Math.min(50, this.ball.position.x)
      );
      assistant2.mesh.position.z = 40;
    }
  }

  /**
   * Check for fouls
   */
  private checkForFouls(): void {
    if (this.foulCooldown > 0 || this.isPenaltyKick) return;

    this.players.forEach((offender) => {
      if (!offender.isTackling || offender.tackleTouchedBall) return;

      this.players.forEach((victim) => {
        if (victim === offender || victim.team === offender.team) return;

        const distance = offender.mesh.position.distanceTo(victim.mesh.position);
        if (distance < 1.2 && this.dribblingPlayer === victim) {
          this.commitFoul(offender, victim, Math.random());
        }
      });
    });
  }

  /**
   * Handle a foul
   */
  private commitFoul(offender: Player, victim: Player, severity: number): void {
    this.foulCooldown = 5; // 5 second cooldown between fouls

    // Stop the game briefly
    this.ballVelocity.set(0, 0, 0);
    this.ball.position.y = 0.5;

    // Position ball at foul location
    const foulPos = victim.mesh.position.clone();
    this.ball.position.x = foulPos.x;
    this.ball.position.z = foulPos.z;

    // Determine if foul occurred inside the defending team's penalty box
    const inSportingBox =
      foulPos.x < -FIELD_LENGTH / 2 + PENALTY_AREA_DEPTH &&
      Math.abs(foulPos.z) <= PENALTY_AREA_WIDTH / 2;
    const inBenficaBox =
      foulPos.x > FIELD_LENGTH / 2 - PENALTY_AREA_DEPTH &&
      Math.abs(foulPos.z) <= PENALTY_AREA_WIDTH / 2;

    if (
      (inSportingBox && offender.team === TeamType.SPORTING && victim.team !== TeamType.SPORTING) ||
      (inBenficaBox && offender.team === TeamType.BENFICA && victim.team !== TeamType.BENFICA)
    ) {
      const side = offender.team === TeamType.SPORTING ? -1 : 1;
      this.startPenaltyKick(victim, side);
    } else {
      // Start free kick for the fouled team
      this.startFreeKick(victim);
    }

    // Play whistle sound
    this.playWhistleSound();
  }

  /** Begin a free kick for the given player */
  private startFreeKick(player: Player): void {
    this.isFreeKick = true;
    this.freeKickPlayer = player;
    this.originalHumanPlayer = this.humanPlayer;
    if (player.team === this.currentTeam) {
      this.humanPlayer = player;
    }
    this.players.forEach((p) => {
      p.isFrozen = true;
    });
    player.isFrozen = false;
  }

  /** End the current free kick and unfreeze everyone */
  private endFreeKick(): void {
    this.isFreeKick = false;
    this.freeKickPlayer = null;
    this.players.forEach((p) => {
      p.isFrozen = false;
    });
    if (this.originalHumanPlayer) {
      this.humanPlayer = this.originalHumanPlayer;
      this.originalHumanPlayer = null;
    }
  }

  /** Begin a penalty kick for the given player */
  private startPenaltyKick(player: Player, side: number): void {
    this.isPenaltyKick = true;
    this.penaltyPlayer = player;
    this.penaltySide = side;
    this.originalHumanPlayer = this.humanPlayer;
    if (player.team === this.currentTeam) {
      this.humanPlayer = player;
    }
    this.players.forEach((p) => {
      p.isFrozen = p !== player;
    });

    const spotX =
      side === -1
        ? -FIELD_LENGTH / 2 + PENALTY_SPOT
        : FIELD_LENGTH / 2 - PENALTY_SPOT;
    this.ball.position.set(spotX, 0.5, 0);
    this.ballVelocity.set(0, 0, 0);

    player.mesh.position.set(spotX - side * 2, 0.5, 0);
    player.mesh.lookAt(spotX + side, 0.5, 0);

    this.camera.position.set(spotX - side * 6, 5, 0);
    this.camera.lookAt(spotX, 2, 0);

    this.penaltyListener = (e: MouseEvent | TouchEvent) =>
      this.handlePenaltyKick(e);
    window.addEventListener("mousedown", this.penaltyListener);
    window.addEventListener("touchstart", this.penaltyListener);
  }

  /** Handle user input during a penalty kick */
  private handlePenaltyKick(e: MouseEvent | TouchEvent): void {
    if (!this.isPenaltyKick) return;

    e.preventDefault();
    let clientX = 0;
    let clientY = 0;
    if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const fracX = clientX / window.innerWidth;
    const fracY = clientY / window.innerHeight;

    const goalX = this.penaltySide === -1 ? -FIELD_LENGTH / 2 : FIELD_LENGTH / 2;
    const targetZ = (fracX - 0.5) * GOAL_WIDTH;
    const targetY = 2 + (0.5 - fracY) * 4;

    const dir = new THREE.Vector3(
      goalX - this.ball.position.x,
      targetY - this.ball.position.y,
      targetZ - this.ball.position.z
    );
    dir.normalize();
    this.ballVelocity.copy(dir.multiplyScalar(30));
    this.playKickSound();

    this.endPenaltyKick();
  }

  /** End the current penalty kick and unfreeze everyone */
  private endPenaltyKick(): void {
    if (this.penaltyListener) {
      window.removeEventListener("mousedown", this.penaltyListener);
      window.removeEventListener("touchstart", this.penaltyListener);
      this.penaltyListener = null;
    }
    this.isPenaltyKick = false;
    this.penaltyPlayer = null;
    this.players.forEach((p) => {
      p.isFrozen = false;
    });
    if (this.originalHumanPlayer) {
      this.humanPlayer = this.originalHumanPlayer;
      this.originalHumanPlayer = null;
    }
  }



  /**
   * Play whistle sound
   */
  private playWhistleSound(): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      1000,
      this.audioContext.currentTime + 0.1
    );

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    );

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Pass the ball to a player in front
   */
  private passBall(passer: Player): void {
    // Find the closest teammate in front of the player
    let closestTeammate: Player | null = null;
    let closestDistance = Infinity;

    // Get passer's forward direction
    const forwardDir = new THREE.Vector3(
      -Math.sin(passer.mesh.rotation.y),
      0,
      -Math.cos(passer.mesh.rotation.y)
    );

    this.players.forEach((player) => {
      if (player === passer || player.team !== passer.team) return;

      // Get direction to teammate
      const toTeammate = new THREE.Vector3();
      toTeammate.subVectors(player.mesh.position, passer.mesh.position);
      toTeammate.y = 0;

      const distance = toTeammate.length();
      toTeammate.normalize();

      // Check if teammate is in front (dot product > 0.5 means within ~60 degrees)
      const dot = forwardDir.dot(toTeammate);

      if (dot > 0.5 && distance < 30 && distance < closestDistance) {
        closestDistance = distance;
        closestTeammate = player;
      }
    });

    if (closestTeammate) {
      // Pass to the teammate
      const passDirection = new THREE.Vector3();
      passDirection.subVectors(
        closestTeammate!.mesh.position,
        this.ball.position
      );
      passDirection.y = 0;
      passDirection.normalize();

      const passPower = Math.min(closestDistance * 1.5, 20);
      this.ballVelocity.x = passDirection.x * passPower;
      this.ballVelocity.z = passDirection.z * passPower;
      this.ballVelocity.y = 2; // Small lift

      this.isDribbling = false;
      this.dribblingPlayer = null;

      console.log(
        `Pass from ${passer.team} #${passer.number} to #${
          closestTeammate!.number
        }`
      );
    }
  }

  /**
   * Pass the ball from one player directly to a target player
   */
  private passBallToPlayer(passer: Player, receiver: Player): void {
    const passDirection = new THREE.Vector3();
    passDirection.subVectors(receiver.mesh.position, this.ball.position);
    passDirection.y = 0;

    const distance = passDirection.length();
    passDirection.normalize();

    const passPower = Math.min(distance * 1.5, 20);

    this.ballVelocity.x = passDirection.x * passPower;
    this.ballVelocity.z = passDirection.z * passPower;
    this.ballVelocity.y = 2;

    this.isDribbling = false;
    this.dribblingPlayer = null;

    console.log(
      `Pass from ${passer.team} #${passer.number} to human player`
    );
  }

  /**
   * Roll the ball to the nearest teammate
   */
  private rollBallToTeammate(keeper: Player): void {
    let closest: Player | null = null;
    let closestDist = Infinity;

    this.players.forEach((player) => {
      if (
        player === keeper ||
        player.team !== keeper.team ||
        player.position === Position.GK
      )
        return;

      const dist = player.mesh.position.distanceTo(keeper.mesh.position);
      if (dist < 30 && dist < closestDist) {
        closest = player;
        closestDist = dist;
      }
    });

    if (closest) {
      const dir = new THREE.Vector3();
      dir.subVectors(closest.mesh.position, keeper.mesh.position);
      dir.y = 0;
      dir.normalize();

      const power = Math.min(closestDist * 1.2, 12);

      this.ball.position.set(keeper.mesh.position.x, 0.5, keeper.mesh.position.z);
      this.ballVelocity.set(dir.x * power, 0, dir.z * power);

      this.isDribbling = false;
      this.dribblingPlayer = null;
    } else {
      const dir = keeper.team === TeamType.SPORTING ? 1 : -1;
      this.ball.position.set(keeper.mesh.position.x, 0.5, keeper.mesh.position.z);
      this.ballVelocity.set(dir * 10, 0, 0);
    }
  }

  /**
   * Perform a slide tackle
   */
  private slideTackle(tackler: Player): void {
    if (tackler.isTackling || tackler.isFalling) return;

    tackler.isTackling = true;
    tackler.tackleTime = 0;
    tackler.tackleTouchedBall = false;

    // Lunge forward
    const tackleSpeed = 15;
    const tackleDir = new THREE.Vector3(
      -Math.sin(tackler.mesh.rotation.y),
      0,
      -Math.cos(tackler.mesh.rotation.y)
    );

    tackler.velocity.x = tackleDir.x * tackleSpeed;
    tackler.velocity.z = tackleDir.z * tackleSpeed;

    // Rotate player to horizontal position (slide animation)
    if (tackler.mesh.userData && tackler.mesh.userData.bones) {
      // Lean back
      tackler.mesh.rotation.x = -Math.PI / 4;
    }
  }

  /**
   * Update tackle mechanics
   */
  private updateTackles(deltaTime: number): void {
    if (this.isPenaltyKick) return;
    this.players.forEach((player) => {
      // Update sliding tackle
      if (player.isTackling) {
        player.tackleTime = (player.tackleTime || 0) + deltaTime;

        // Slide for 0.5 seconds
        if (player.tackleTime < 0.5) {
          // Apply sliding velocity with friction
          player.mesh.position.x += player.velocity.x * deltaTime;
          player.mesh.position.z += player.velocity.z * deltaTime;
          player.velocity.x *= 0.9;
          player.velocity.z *= 0.9;


          // Check for ball contact during tackle
          const ballDistance = player.mesh.position.distanceTo(
            this.ball.position
          );
          if (
            ballDistance < 2 &&
            this.dribblingPlayer &&
            this.dribblingPlayer.team !== player.team
          ) {
            // Successful tackle - knock the ball away
            const knockDir = new THREE.Vector3();
            knockDir.subVectors(this.ball.position, player.mesh.position);
            knockDir.y = 0;
            knockDir.normalize();

            this.ballVelocity.x = knockDir.x * 15;
            this.ballVelocity.z = knockDir.z * 15;
            this.ballVelocity.y = 5;

            player.tackleTouchedBall = true;

            // Make the victim fall
            if (this.dribblingPlayer) {
              this.dribblingPlayer.isFalling = true;
              this.dribblingPlayer.fallTime = 0;
            }

            this.dribblingPlayer = null;
            this.isDribbling = false;
          }
        } else {
          // End tackle
          player.isTackling = false;
          player.mesh.rotation.x = 0;
          player.velocity.x = 0;
          player.velocity.z = 0;
        }
      }

      // Update falling
      if (player.isFalling) {
        player.fallTime = (player.fallTime || 0) + deltaTime;

        if (player.fallTime < 0.3) {
          // Fall animation
          player.mesh.rotation.x = (-Math.PI / 3) * (player.fallTime / 0.3);
          player.isOnGround = false;
        } else if (player.fallTime < 1.5) {
          // Stay on ground
          player.mesh.rotation.x = -Math.PI / 3;
          player.isOnGround = true;
        } else {
          // Get up
          player.mesh.rotation.x = 0;
          player.isFalling = false;
          player.isOnGround = false;
        }
      }
    });
  }

  /**
   * Check for running tackles (collision-based tackles)
   */
  private checkRunningTackles(): void {
    if (this.isPenaltyKick) return;
    // Check each player against the ball carrier
    if (!this.dribblingPlayer) return;

    const ballCarrier = this.dribblingPlayer; // Store reference to avoid null checks

    this.players.forEach((player) => {
      if (
        player === ballCarrier ||
        player.team === ballCarrier.team ||
        player.isFalling ||
        player.isTackling
      )
        return;

      const distance = player.mesh.position.distanceTo(
        ballCarrier.mesh.position
      );

      // Running tackle distance
      if (distance < 1.8) {
        // Calculate relative speed
        const relativeSpeed = player.velocity
          .clone()
          .sub(ballCarrier.velocity)
          .length();

        // Higher speed = more likely to succeed
        if (relativeSpeed > 2 || Math.random() < 0.3) {
          const playerBallDist = player.mesh.position.distanceTo(
            this.ball.position
          );

          if (playerBallDist > 1.5) {
            // Hit opponent before the ball - foul
            this.commitFoul(player, ballCarrier, Math.random());
          } else {
            // Successful tackle
            const knockDir = new THREE.Vector3();
            knockDir.randomDirection();
            knockDir.y = 0;
            knockDir.normalize();

            this.ballVelocity.x = knockDir.x * 10;
            this.ballVelocity.z = knockDir.z * 10;
            this.ballVelocity.y = 3;

            // Victim falls
            ballCarrier.isFalling = true;
            ballCarrier.fallTime = 0;

            this.dribblingPlayer = null;
            this.isDribbling = false;

            console.log(`Running tackle by ${player.team} #${player.number}`);
          }
        }
      }
    });
  }

  /** End the game if a team scores 12 goals */
  private checkGoalLimit(): void {
    if (this.scores.home >= 12 || this.scores.away >= 12) {
      if (this.timeDisplay) this.timeDisplay.textContent = "YOU WIN!!!!";
      this.gameState = GameState.MENU;
      this.showEndOptions();
    }
  }

  /** End the current half or finish the match */
  private endHalf(): void {
    if (this.currentHalf === 1) {
      this.currentHalf = 2;
      this.gameClock = 0;
      this.updateTimeDisplay();
      // Reset ball to center
      this.ball.position.set(0, 0.5, 0);
      this.ballVelocity.set(0, 0, 0);
    } else {
      this.endMatch();
    }
  }

  /** Determine match result */
  private endMatch(): void {
    if (this.scores.home === this.scores.away) {
      if (!this.extraTimeAdded) {
        // Extend the half by 30 seconds for extra time
        this.halfDuration += 30;
        this.extraTimeAdded = true;
        this.updateTimeDisplay();
        return;
      }
      this.startPenaltyShootout();
    } else {
      const homeWin = this.scores.home > this.scores.away;
      if (this.timeDisplay)
        this.timeDisplay.textContent = homeWin
          ? "YOU WIN!!!!!! :)"
          : "aww you lost :( try again";
      this.gameState = GameState.MENU;
      this.showEndOptions();
    }
  }

  /** Start penalty shootout */
  private startPenaltyShootout(): void {
    this.penaltyShootout = true;
    this.penaltyScores = { home: 0, away: 0, shots: 0 };
    this.updateTimeDisplay();
    this.takePenalty();
  }

  /** Simulate each penalty kick */
  private takePenalty(): void {
    if (!this.penaltyShootout) return;
    const isHomeTurn = this.penaltyScores.shots % 2 === 0;
    const scored = Math.random() < 0.7;
    if (isHomeTurn && scored) this.penaltyScores.home++;
    if (!isHomeTurn && scored) this.penaltyScores.away++;
    this.penaltyScores.shots++;
    this.updateTimeDisplay();

    const shotsTakenEach = Math.ceil(this.penaltyScores.shots / 2);
    if (
      shotsTakenEach >= 5 &&
      this.penaltyScores.home !== this.penaltyScores.away &&
      this.penaltyScores.shots % 2 === 0
    ) {
      this.finishShootout();
      return;
    }

    setTimeout(() => this.takePenalty(), 1000);
  }

  /** Finish penalty shootout */
  private finishShootout(): void {
    this.penaltyShootout = false;
    const homeWin = this.penaltyScores.home > this.penaltyScores.away;
    if (this.timeDisplay)
      this.timeDisplay.textContent = homeWin
        ? "YOU WIN!!!!!! :)"
        : "aww you lost :( try again";
    this.gameState = GameState.MENU;
    this.showEndOptions();
  }
}

// Start the game when the page loads
window.addEventListener("DOMContentLoaded", () => {
  new SoccerGame();
});
