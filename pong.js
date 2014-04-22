var game = new Phaser.Game(
    480,
    640,
    Phaser.AUTO,
    '',
    {preload: preload, create: create, update: update}
);

var playerBet;
var computerBet;
var ball;
var computerBetSpeed = 190;
var ballSpeed = 300;
var ballReleased = false;

function preload() {
    game.load.image('bet', 'assets/bet.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('background', 'assets/background.jpg');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, 480, 640, 'background');
    playerBet = createBet(game.world.centerX, 600);
    computerBet = createBet(game.world.centerX, 20);
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    game.physics.arcade.enable(ball);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    game.input.onDown.add(releaseBall, this);
}

function update () {
    //Control the player's racket
    playerBet.x = game.input.x;
    var playerBetHalfWidth = playerBet.width / 2;
    if (playerBet.x < playerBetHalfWidth) {
        playerBet.x = playerBetHalfWidth;
    } else if (playerBet.x > game.width - playerBetHalfWidth) {
        playerBet.x = game.width - playerBetHalfWidth;
    }

    //Control the computer's racket
    if(computerBet.x - ball.x < -15) {
        computerBet.body.velocity.x = computerBetSpeed;
    } else if(computerBet.x - ball.x > 15) {
        computerBet.body.velocity.x = -computerBetSpeed;
    } else {
        computerBet.body.velocity.x = 0;
    }

    //Check and process the collision ball and racket
    game.physics.arcade.collide(ball, playerBet, ballHitsBet, null, this);
    game.physics.arcade.collide(ball, computerBet, ballHitsBet, null, this);

    //Check to see if someone has scored a goal
    checkGoal();
}

function createBet(x, y) {
    var bet = game.add.sprite(x, y, 'bet');
    bet.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(bet);
    bet.body.collideWorldBounds = true;
    bet.body.bounce.setTo(1, 1);
    bet.body.immovable = true;

    return bet;
}

function releaseBall() {
    if (!ballReleased) {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballReleased = true;
    }
}

function ballHitsBet (_ball, _bet) {
    var diff = 0;

    if (_ball.x < _bet.x) {
        //If ball is in the left hand side on the racket
        diff = _bet.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _bet.x) {
        //If ball is in the right hand side on the racket
        diff = _ball.x -_bet.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        //The ball hit the center of the racket, let's add a little bit of a tragic accident(random) of his movement
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
