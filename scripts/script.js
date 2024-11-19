function setupCanvas() {     //Metoda za crtanje pocetnog izgleda canvas elementa - crna boja i zeleni rub
    
    canvasElement = document.getElementById("canvasElement")
    canvasElement.height = window.innerHeight
    canvasElement.width = window.innerWidth
    canvasContext = canvasElement.getContext("2d")
    
    canvasContext.fillStyle = "black"
   
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
    
    
}

function drawBricks(brickWidth, brickHeight, numberOfBricks) {        //Crtanje cigli uz poznatu sirinu i visinu cigle, kao i njihov broj
    var currentStartingX = 0
    var currentStartingY = 100
    for (var i = 0; i < numberOfBricks; i++) {               
        brick = {}                                               //kreiranje objekta cigle i njegovo spremanje na globalnu listu cigli
        brick.X = currentStartingX                               //atributi su koordinate gornje lijeve tocke te cigle
        brick.Y = currentStartingY
        bricksArray.push(brick)

        canvasContext.fillStyle = 'red';                       //Crtanje cigle crvene boje s crnim obrubom
        canvasContext.strokeStyle = 'black';
        canvasContext.rect(currentStartingX, currentStartingY, brickWidth, brickHeight);
        canvasContext.fill()
        canvasContext.stroke();
        if (currentStartingX + brickWidth >= canvasElement.width) {
            currentStartingX = 0
            currentStartingY += brickHeight
        } else {
            currentStartingX += brickWidth
        }
    }
}

function drawBricksAlligned(bricksPerRow, bricksPerColumn, numberOfBricks) {          //Funkcija koja osigurava da velicina prozora bude visekratnik velicine cigle
    var brickWidth = canvasElement.width / bricksPerRow
    var brickHeight = canvasElement.height / bricksPerColumn
    drawBricks(brickWidth, brickHeight, numberOfBricks)                       //poziv funkcije za direktno crtanje
}

function drawBatAndBall(batWidth, batHeight, ballRadius) {                //Metoda za pocetni prikaz palice i loptice
    var startingX = canvasElement.width / 2 - batWidth / 2
    var startingY = canvasElement.height - batHeight                         //Palica se nalazi na sredini horizontalno, a a dnu vertikalno
    canvasContext.fillStyle = 'red';
    canvasContext.strokeStyle = 'black';
    canvasContext.rect(startingX, startingY, batWidth, batHeight);
    canvasContext.fill()
    canvasContext.stroke();
    canvasContext.beginPath();
    canvasContext.fillStyle = 'green'
    canvasContext.strokeStyle = 'black'
    canvasContext.arc(canvasElement.width / 2, startingY - ballRadius, ballRadius, 0, 2 * Math.PI)           //Loptica se nalazi na sredini palice
    canvasContext.fill()
    canvasContext.stroke()
    canvasContext.closePath()
    
}

function drawBat(batWidth, batHeight, startingX) {              //Crtanje palice kasnije u toku izvodenja programa, kako bi se azurirala njezina lokacija
    var startingY = canvasElement.height - batHeight
    canvasContext.fillStyle = 'red';
    canvasContext.strokeStyle = 'black';
    canvasContext.rect(startingX, startingY, batWidth, batHeight);
    canvasContext.fill()
    canvasContext.stroke();
}

function drawBall(ballRadius, startingX, startingY) {      //Crtanje loptice kasnije u toku izvodenja programa, kako bi se azurirala njezina lokacija
    canvasContext.beginPath();
    canvasContext.fillStyle = 'green'
    canvasContext.strokeStyle = 'black'
    canvasContext.arc(startingX, startingY, ballRadius, 0, 2 * Math.PI)
    canvasContext.fill()
    canvasContext.stroke()
    canvasContext.closePath()
}

function deleteBat(batWidth, batHeight, startingX) {           //Metoda za brisanje palice (i zamjenu tog prostora crnom bojom), koristi se kod azuriranja lokacije palice
    var startingY = canvasElement.height - batHeight
    canvasContext.beginPath()
    canvasContext.clearRect(startingX, startingY, batWidth, batHeight);
    canvasContext.closePath()
    canvasContext.beginPath()
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(startingX, startingY, batWidth, batHeight);
}

function deleteBall(ballRadius, startingX, startingY) {        //Metoda za brisanje loptice (i zamjenu tog prostora crnom bojom), koristi se kod azuriranja lokacije loptice
    canvasContext.beginPath();
    canvasContext.fillStyle = 'black'
    canvasContext.strokeStyle = 'black'
    canvasContext.arc(startingX, startingY, ballRadius, 0, 2 * Math.PI)
    canvasContext.fill()
    canvasContext.stroke()
    canvasContext.closePath()
}

function moveBat(direction) {                                     //Metoda za pomicanje palice, Brise postojecu, a zatim crta novu palicu
    deleteBat(batWidth, batHeight, batCurrentX)
    if (direction == "right" && batCurrentX + batWidth < canvasElement.width) {
        batCurrentX += batSpeed
    } else if (direction == "left" && batCurrentX  > 0) {
        batCurrentX -= batSpeed
    } else {
        
    }
    
    drawBat(batWidth, batHeight, batCurrentX)
    
}

function moveBall(dx, dy) {                                        //Metoda za pomicanje loptice, Brise postojecu, a zatim crta novu lopticu
    deleteBall(ballRadius, ballCurrentX, ballCurrentY)
    ballCurrentX += dx * ballSpeed
    ballCurrentY -= dy * ballSpeed
    drawBall(ballRadius, ballCurrentX, ballCurrentY)
}

function startGame() {                      //Metoda koja zapocinje igru, koja je zapravo vrsta petlje koja se ponavlja.

    function updateState() {                  //Metoda koja se opetovano ponavlja i prikazuje novo stanje svaki put
        dx = Math.cos(ballCurrentAngle)          //Odredivanje intervala pomaka loptice
        dy = Math.sin(ballCurrentAngle)
        var imaKolizije = brickCollision()       //Odredivanje je li se dogodila kolizija s nekom od cigli
        if (ballCurrentX + ballRadius + dx * ballSpeed > canvasElement.width || ballCurrentX - ballRadius + dx * ballSpeed < 0) {   //Slucaj dodira s vertikalnim rubom prozora
            moveBall(-dx, dy)
            ballCurrentAngle = Math.PI - ballCurrentAngle
        } else if (ballCurrentY - ballRadius - dy * ballSpeed < 0 || (ballCurrentY + ballRadius - dy * ballSpeed > canvasElement.height - batHeight && ballCurrentX + ballRadius + dx * ballSpeed > batCurrentX && ballCurrentX - ballRadius + dx * ballSpeed < batCurrentX + batWidth)) {   //Slucaj dodira s vrhom prozora ili s palicom
            moveBall(dx, -dy)
            ballCurrentAngle = -ballCurrentAngle
        } else if (imaKolizije == "goredolje") {            //Slucaj kolizije s gornjom ili donjom stranom cigle
            
            moveBall(dx, -dy)
            ballCurrentAngle = -ballCurrentAngle
        } else if (imaKolizije == "lijevodesno") {           //Slucaj kolizije s lijevom ili desnom stranom cigle
            
            moveBall(-dx, dy)
            ballCurrentAngle = Math.PI - ballCurrentAngle
        } else if (ballCurrentY > canvasElement.height) {             //Slucaj pada loptice na dno prozora - igra zavrsava i tekst se ispisuje
            canvasContext.textAlign = "center"
            canvasContext.textBaseline = "middle"
            canvasContext.fillStyle = "white"
            canvasContext.font = "50px Comic Sans MS"
            canvasContext.fillText("GAME OVER (CLICK ANYWHERE TO PLAY AGAIN)", canvasElement.width / 2, canvasElement.height / 2)
            gameOver = true
            return
        } else if (bricksArray.length <= 0) {                    //Slucaj kad nema vise cigli - sve su unistene, igra zavrsava pobjedom
            canvasContext.textAlign = "center"
            canvasContext.textBaseline = "middle"
            canvasContext.fillStyle = "white"
            canvasContext.font = "50px Comic Sans MS"
            canvasContext.fillText("CONGRATULATIONS (CLICK ANYWHERE TO PLAY AGAIN)", canvasElement.width / 2, canvasElement.height / 2)
            gameOver = true
            return
        }
        
        else {                                    //Pretpostavljeni slucaj - nema nikakve kolizije ni specijalnih dogadaja. Loptica se slobodno krece
            moveBall(dx, dy)
        }
        showPoints()                                //Prikaz bodova u svakoj novoj iteraciji, za slucaj da loptica prebrise tekst s bodovima
        requestAnimationFrame(updateState)          //Poziv metode za prikaz novog stanja igre
    }

    updateState()                                  //Pocetak "petlje" u kojoj se igra izvrsava
    
}

function brickCollision() {                      //Metoda za detekciju kolizije loptice s ciglama
    var brickWidth = canvasElement.width / bricksPerRow                   //Dobivanje konkretnih vrijednosti visine i sirine loptice
    var brickHeight = canvasElement.height / bricksPerColumn
    var statusKolizije = "nema"                                 //Pretpostavljena vrijednost statusa kolizije
    bricksArrayNew = []                                 //Novo polje cigli u koje se spremaju cigle koje nisu bile pogodene lopticom
    bricksArray.forEach((brick) => {                    //Filtriranje pocetnog polja
        var closestXcoord;                              //Odredivanje najjblize X koordinate cigle loptici (ili je loptice vec ispod/iznad cigle)
        if (ballCurrentX < brick.X) {
            closestXcoord = brick.X;
        } else if (ballCurrentX > brick.X + brickWidth) {
            closestXcoord = brick.X + brickWidth;
        } else {
            closestXcoord = ballCurrentX;
        }
        
        var closestYcoord;                              //Odredivanje najjblize Y koordinate cigle loptici (ili je loptica vec lijevo/desno od cigle)
        if (ballCurrentY < brick.Y) {
            closestYcoord = brick.Y;
        } else if (ballCurrentY > brick.Y + brickHeight) {
            closestYcoord = brick.Y + brickHeight;
        } else {
            closestYcoord = ballCurrentY;
        }
        
        var xDistance = ballCurrentX - closestXcoord;        //Horizontalna udaljenost loptice od cigle
        var yDistance = ballCurrentY - closestYcoord;        //Vertikalna udaljenost loptice od cigle
        
        if (xDistance * xDistance + yDistance * yDistance < ballRadius * ballRadius) {    //Provjera Pitagorinim pouckom je li doslo do kolizije
            if (Math.abs(xDistance) <= Math.abs(yDistance)) {
                statusKolizije = "goredolje"
            } else {
                statusKolizije = "lijevodesno"
            }
            canvasContext.beginPath();                    //Do kakve god kolizije je doslo, cigla se brise i zamjenjuje crnom bojom
            canvasContext.fillStyle = "black";
            canvasContext.strokeStyle = "black";
            canvasContext.fillRect(brick.X, brick.Y, brickWidth, brickHeight);
            canvasContext.stroke();
            canvasContext.closePath();
        } else {
            bricksArrayNew.push(brick);                //Ako nema kolizije, ta cigla ostaje u polju cigli
        }
        
    })
    bricksArray = bricksArrayNew                     //zamjena globalnog polja cigli filtriranim

    if (statusKolizije == "goredolje" || statusKolizije == "lijevodesno") {      //Azuriranje trenutnih bodova i maksimalnih bodova
        localStorage.setItem("currentPoints", numberOfBricks - bricksArray.length)
        if (parseInt(localStorage.getItem("currentPoints"), 10) > parseInt(localStorage.getItem("maxPoints")) || !localStorage.getItem("maxPoints")) {
            localStorage.setItem("maxPoints", localStorage.getItem("currentPoints"))
        }
        showPoints()         //Prikaz novog stanja bodova
    }

    

    return statusKolizije
}

function showPoints() {                         //Metoda za prikaz novog stanja bodova
    canvasContext.beginPath()
    canvasContext.fillStyle = "black"
    canvasContext.fillRect(canvasElement.width - 400, 0, 400, 80)              //Brisanje starog stanja crtanjem crnog pravokutnika preko starog teksta
    canvasContext.closePath()
    
    canvasContext.beginPath()
    canvasContext.fillStyle = "white"                       //Namjestanje fonta i boje teksta
    canvasContext.font = "20px Comic Cans MS"
    canvasContext.textAlign = "right"
    canvasContext.fillText(`CURRENT SCORE: ${localStorage.getItem("currentPoints") || 0}`, canvasElement.width - 50, 20)  //Ispis novog stanja bodova
    canvasContext.fillText(`MAX SCORE: ${localStorage.getItem("maxPoints") || 0}`, canvasElement.width - 50, 50)
    canvasContext.closePath()
    
}

function initializeGame() {              //Metoda za inicijalizaciju igre
    gameOver = false                     //Vrijednosti postavljene kao primjer, moguce je promijeniti po zelji
    bricksPerRow = 5
    bricksPerColumn = 20
    numberOfBricks = 12
    
    batWidth = 200
    batHeight = 20
    batSpeed = 10
    
    ballRadius = 10
    ballSpeed = 5
    
    bricksArray = []                 //Inicijalizacija praznog globalnog polja cigli
    
    setupCanvas()
    
    drawBricksAlligned(bricksPerRow, bricksPerColumn, numberOfBricks)         //Crtanje odabranog broja cigli
    drawBatAndBall(batWidth, batHeight, ballRadius)                         //Crtanje palice i loptice
    
    batCurrentX = canvasElement.width / 2 - batWidth / 2                     //Postavljanje pocetnih vrijednosti pozicije palice i loptice te kuta pod kojim loptica leti
    
    
    ballCurrentX = canvasElement.width / 2
    ballCurrentY = canvasElement.height - batHeight - ballRadius
    ballCurrentAngle = Math.random() * Math.PI

    localStorage.setItem("currentPoints", 0)                               //Postavljanje trenutnih bodova na 0 za pocetak igre

    showPoints()                     //Prikaz teksta s bodovima
}

document.onkeydown = (e) => {               //Detekcija pritiska tipki sa lijeom i desnom strelicom te poziv metode za pomicanje palice
    if (e.key == "ArrowRight") {
        moveBat("right")
    } else if (e.key == "ArrowLeft") {
        moveBat("left")
    } else {
        return;
    }
}

document.addEventListener("click", (e) => {         //Detekcija klika na mis te, prema potrebi, poziv metode za ponovnu inicijalizaciju igre - nakon zavrsetka igre
    if (gameOver) {
        initializeGame()
        startGame()
    }
})



initializeGame()    //Poziv funkcije za inicijalizaciju potrebnih varijabli i pozivanje funkcija za postavljanje igre

startGame()     //Pocetak igre








