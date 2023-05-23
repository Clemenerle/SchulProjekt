class Game {
  gameobjects = []; // Array zur Speicherung aller Gameobjekte
  deltaTime = 0; // Zeitdifferenz zwischen zwei Frames
  isRunning = true; // Flag, das angibt, ob das Spiel läuft oder nicht

  constructor(ctx, width, height) {
    this.ctx = ctx; // Canvas-Kontext
    this.width = width; // Breite des Spielfensters
    this.height = height; // Höhe des Spielfensters

    this.frameStart = performance.now(); // Zeitpunkt des aktuellen Frames
    this.frameEnd = performance.now(); // Zeitpunkt des nächsten Frames
  }

  updateAndDraw() {
    if (this.isRunning) {
      this.deltaTime = (this.frameEnd - this.frameStart) / 100; // Berechnung der Zeitdifferenz in Sekunden
      if (this.deltaTime == 0) {
        this.deltaTime = 0.001; // Falls deltaTime 0 ist, wird es auf einen kleinen Wert gesetzt, um Division durch 0 zu vermeiden
      }
      this.frameStart = performance.now(); // Aktualisierung des Zeitpunkts des aktuellen Frames

      this.ctx.clearRect(0, 0, this.width, this.height); // Leeren des Canvas

      // Aktualisierung und Zeichnung aller Gameobjekte
      for (var i = 0; i < this.gameobjects.length; i++) {
        this.gameobjects[i].update();
        this.gameobjects[i].draw();
      }

      this.frameEnd = performance.now(); // Aktualisierung des Zeitpunkts des nächsten Frames
    }
  }

  addGameobject(obj) {
    this.gameobjects.push(obj); // Hinzufügen eines Gameobjekts zum Array
    obj.onInit(); // Aufruf der Initialisierungsmethode des Gameobjekts
  }

  findGameobject(name) {
    return this.gameobjects.find((obj) => obj.name == name); // Suchen und Rückgabe eines Gameobjekts mit einem bestimmten Namen
  }

  showGameOverMenu() {
    // Methode zum Anzeigen des Benutzermenüs nach dem Spielende
    this.isRunning = false;

    // Erstellen des Menü-Elements
    var gameOverMenu = document.createElement("div");
    gameOverMenu.id = "game-over-menu"; // Hinzufügen der ID zum Menü
    gameOverMenu.style.position = "absolute";
    gameOverMenu.style.top = "50%";
    gameOverMenu.style.left = "50%";
    gameOverMenu.style.transform = "translate(-50%, -50%)";
    gameOverMenu.style.textAlign = "center";

    // Erstellen der Nachricht im Menü
    var gameOverMessage = document.createElement("h2");
    gameOverMessage.textContent = "Game Over";
    gameOverMenu.appendChild(gameOverMessage);

    // Erstellen der Schaltfläche "Nochmal spielen"
    var playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Nochmal spielen";
    playAgainButton.addEventListener("click", () => {
      this.restartGame();
    });
    gameOverMenu.appendChild(playAgainButton);

    // Hinzufügen des Menü-Elements zum Dokument
    document.body.appendChild(gameOverMenu);
  }

  restartGame() {
    // Methode zum Neustarten des Spiels
    // Entfernen des Benutzermenüs
    var gameOverMenu = document.getElementById("game-over-menu");
    gameOverMenu.remove();

    // Zurücksetzen des Spielzustands
    this.isRunning = true;
    this.gameobjects = [];
    this.frameStart = performance.now();
    this.frameEnd = performance.now();
    this.deltaTime = 0;

    // Erneutes Hinzufügen der Spielobjekte
    var worldGen = new WorldGenerator(
      this,
      new Vector2D(0, 0),
      new Vector2D(0, 0),
      "worldGenerator"
    );
    var player = new Player(
      this,
      new Vector2D(3 * Metric.m, Metric.m * 5),
      new Vector2D(50, 180 * Metric.cm),
      "player"
    );
    player.texture = document.getElementById("bild1");
    this.addGameobject(player);
    this.addGameobject(worldGen);
  }
}

class Vector2D {
  constructor(x, y) {
    this.x = x; // x-Komponente des Vektors
    this.y = y; // y-Komponente des Vektors
  }

  static distance(vec1, vec2) {
    // Statische Methode zur Berechnung des Abstands zwischen zwei Vektoren
    return Math.sqrt(
      Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2)
    );
  }
}

class Gameobject {
  constructor(engine, pos, size, name) {
    this.engine = engine; // Referenz auf das Game-Objekt
    this.pos = pos; // Position des Gameobjekts
    this.size = size; // Größe des Gameobjekts
    this.name = name; // Name des Gameobjekts
  }

  onInit() {
    // Leere Initialisierungsmethode, die von abgeleiteten Klassen überschrieben werden kann
  }

  update() {
    // Leere Update-Methode, die von abgeleiteten Klassen überschrieben werden kann
  }

  draw() {
    // Leere Zeichenmethode, die von abgeleiteten Klassen überschrieben werden kann
  }
}

class Metric {
  static km = 5000; // Faktor für Kilometer
  static m = 50; // Faktor für Meter
  static dm = 5; // Faktor für Dezimeter
  static cm = 0.5; // Faktor für Zentimeter
  static mm = 0.05; // Faktor für Millimeter
  static g = 9.807; // Erdbeschleunigung in m/s^2
}

class Player extends Gameobject {
  mass = 80; // Masse des Spielers in kg
  vel = new Vector2D(0, 0); // Geschwindigkeit des Spielers

  jumpForce = 200; // Sprungkraft des Spielers
  jumpTime = 5000; // Sprungzeit des Spielers
  isOnGround = false; // Flag, das angibt, ob der Spieler den Boden berührt
  tiles = [[]]; // Array zur Speicherung der Spielkacheln
  texture = undefined; // Textur des Spielers
  dDown = false; // Flag, das angibt, ob die "d"-Taste gedrückt ist
  aDown = false; // Flag, das angibt, ob die "a"-Taste gedrückt ist

  onInit() {
    // Event-Handler für die Tastaturereignisse
    document.onkeydown = (event) => {
      if (event.key == " " && this.isOnGround) {
        this.isOnGround = false;
        let acc = this.jumpForce / this.mass;
        this.vel.y += acc * this.engine.deltaTime * this.jumpTime;
      }
    };

    document.onkeyup = (event) => {
      if (event.key == "d") this.dDown = false;
      if (event.key == "a") this.aDown = false;
    };
  }

  update() {
    // Aktualisierung der Position des Spielers basierend auf seiner Geschwindigkeit und der Gravitation
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.checkGround(); // Überprüfung, ob der Spieler den Boden berührt
    this.colisionHandler(); // Behandlung von Kollisionen mit Hindernissen
    this.addGravity(); // Hinzufügen der Gravitationskraft zum Spieler
  }

  draw() {
    // Zeichnung des Spielers auf dem Canvas
    ctx.fillStyle = "black";
    ctx.drawImage(
      this.texture,
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  }

  addGravity() {
    // Hinzufügen der Gravitationskraft zum Spieler
    this.vel.y += -Metric.g * Metric.m * engine.deltaTime;
  }

  colisionHandler() {
    // Behandlung von Kollisionen mit Hindernissen
    if (this.pos.y <= 0) {
      this.vel.y = 0;
      this.pos.y = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }

    for (let i = 0; i < this.tiles.length; i++) {
      let obstacle = this.tiles[i];
      if (obstacle == undefined) continue;
      if (
        this.pos.x + this.size.x >= obstacle.pos.x &&
        this.pos.x <= obstacle.pos.x + obstacle.size.x
      ) {
        if (this.pos.y <= obstacle.pos.y + obstacle.size.y) {
          this.vel.x = 0;
          this.engine.isRunning = false;
        }
      }
    }
  }

  checkGround() {
    // Überprüfung, ob der Spieler den Boden berührt
    if (this.pos.y <= 0) {
      this.pos.y = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }
  }
}

class Tile extends Gameobject {
  type = 0; // Typ der Spielkachel

  onInit() {
    console.log(this.pos); // Ausgabe der Position der Spielkachel
  }

  draw() {
    // Zeichnung der Spielkachel auf dem Canvas
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.pos.x,
      this.engine.height - this.pos.y - this.size.y,
      this.size.x,
      this.size.y
    );
  }
}

class WorldGenerator extends Gameobject {
  obstacles = []; // Array zur Speicherung von Hindernissen
  obstacleInterval = 3; // Intervall zwischen der Erzeugung von Hindernissen
  obstacleSpeed = 10; // Geschwindigkeit der Hindernisse
  timer = 0; // Timer zur Verfolgung des Intervalls
  score = 0; // Punktzahl des Spielers

  onInit() {
    this.generateObstacles(); // Erzeugung von Hindernissen
    let playerInstance = this.engine.findGameobject("player");
    playerInstance.tiles = this.obstacles; // Übergabe der Hindernisse an den Spieler
  }

  update() {
    this.timer += this.engine.deltaTime * 10;
    if (this.timer >= this.obstacleInterval) {
      this.obstacleInterval = Math.random() * 1 + 0.4; // Zufällige Bestimmung des Intervalls
      this.obstacleSpeed += 0.2; // Erhöhung der Hindernisgeschwindigkeit
      this.timer = 0;
      this.generateObstacles(); // Erzeugung von neuen Hindernissen
    }
    if (this.obstacles.some((obstacle) => this.checkCollision(obstacle))) {
      this.engine.showGameOverMenu(); // Anzeigen des Benutzermenüs
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].pos.x -=
        this.obstacleSpeed * Metric.m * this.engine.deltaTime * 10; // Aktualisierung der Position der Hindernisse basierend auf ihrer Geschwindigkeit
      if (this.obstacles[i].pos.x < 0 - this.obstacles[i].size.x) {
        // Überprüfung, ob Hindernis den Bildschirm verlassen hat
        this.obstacles.splice(i, 1); // Entfernen des Hindernisses aus dem Array
        this.score++; // Erhöhung der Punktzahl
      }
    }
  }

  generateObstacles() {
    // Erzeugung von Hindernissen
    this.obstacles.push(
      new Tile(
        this.engine,
        new Vector2D(this.engine.width, 0),
        new Vector2D(50 * Metric.cm, 1.5 * Metric.m),
        "tile"
      )
    );
  }

  draw() {
    // Zeichnung der Hindernisse und der Punktzahl auf dem Canvas
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].draw();
    }
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + this.score, this.engine.width - 150, 30);
  }
  checkCollision(obstacle) {
    // Methode zur Überprüfung von Kollisionen zwischen dem Spieler und einem Hindernis
    return (
      this.engine.findGameobject("player").pos.x +
        this.engine.findGameobject("player").size.x >=
        obstacle.pos.x &&
      this.engine.findGameobject("player").pos.x <=
        obstacle.pos.x + obstacle.size.x &&
      this.engine.findGameobject("player").pos.y <=
        obstacle.pos.y + obstacle.size.y
    );
  }
}
