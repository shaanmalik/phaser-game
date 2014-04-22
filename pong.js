var game = new Phaser.Game(
    480,
    640,
    Phaser.AUTO,
    '',
    {preload: preload, create: create, update: update}
);

var playerBat;
var computerBat;
var ball;
var computerBatSpeed = 190;
var ballSpeed = 300;
var ballReleased = false;

function preload() {
    game.load.image('bat', 'assets/bat.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('background', 'assets/background.jpg');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, 480, 640, 'background');
    playerBat = createBat(game.world.centerX, 600);
    computerBat = createBat(game.world.centerX, 20);
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    game.physics.arcade.enable(ball);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    game.input.onDown.add(releaseBall, this);
}

function update () {
    //Control the player's racket
    playerBat.x = game.input.x;
    var playerBatHalfWidth = playerBat.width / 2;
    if (playerBat.x < playerBatHalfWidth) {
        playerBat.x = playerBatHalfWidth;
    } else if (playerBat.x > game.width - playerBatHalfWidth) {
        playerBat.x = game.width - playerBatHalfWidth;
    }

    //Control the computer's racket
    if(computerBat.x - ball.x < -15) {
        computerBat.body.velocity.x = computerBatSpeed;
    } else if(computerBat.x - ball.x > 15) {
        computerBat.body.velocity.x = -computerBatSpeed;
    } else {
        computerBat.body.velocity.x = 0;
    }

    //Check and process the collision ball and racket
    game.physics.arcade.collide(ball, playerBat, ballHitsBat, null, this);
    game.physics.arcade.collide(ball, computerBat, ballHitsBat, null, this);

    //Check to see if someone has scored a goal
    checkGoal();
}

function createBat(x, y) {
    var bat = game.add.sprite(x, y, 'bat');
    bat.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(bat);
    bat.body.collideWorldBounds = true;
    bat.body.bounce.setTo(1, 1);
    bat.body.immovable = true;

    return bat;
}

function releaseBall() {
    if (!ballReleased) {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballReleased = true;
    }
}

function ballHitsBat (_ball, _bat) {
    var diff = 0;

    if (_ball.x < _bat.x) {
        //If ball is in the left hand side on the racket
        diff = _bat.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _bat.x) {
        //If ball is in the right hand side on the racket
        diff = _ball.x -_bat.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        //The ball hit the center of the racket, let's add a little bit of a tragic accident (random) of his movement
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function checkGoal() {
    if (ball.y < 15) {
        setBall();
    } else if (ball.y > 625) {
        setBall();
    }
}

function setBall() {
    if (ballReleased) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ballReleased = false;
    }
}
