const serverURL = 'https://exxo.chestercore.com/app.php'; //default server Url
localStorage.removeItem('winStatus')
// toast alert class
class toast {
    constructor(type, msg, timeOut) {
        let alertId = 'alert' + Math.floor(Math.random() * 100000000000000);
        $('body').append('<div id="' + alertId + '" class="alert animated jello ' + type + '">' + msg + '</div>')
        if (timeOut != 'x') {
            setTimeout(function () {
                $('#' + alertId).fadeOut();
            }, timeOut * 1000)
        }
    }
}


//play on click
$('.app').click(function () {
    if ($(this).attr('data-val') === '') {
        $(this).html(getFromStorage('form'))
        $(this).attr('data-val', getFromStorage('form'))
        $(this).addClass('tick active')
        playgame($(this).attr('id'), getFromStorage('form'))
    } else {
        let msg = new toast('red', 'you know you cant make that move', 1);
    }
})



//get item value
function val(id) {
    return $('#' + id).attr('data-val');
}

// check if all boxes have been ticked
function allBoxesAreChecked() {
    sessionStorage.setItem('axl', 0);
    for (i = 1; i <= 9; i++) {
        if (val(i) === '') {
            let inc = sessionStorage.getItem('axl')
            sessionStorage.setItem('axl', Number(inc + 1));
        }

    }
    return sessionStorage.getItem('axl')
}

//possible winning outcomes
const permutations = [
    [
        [1, 2, 3],
        [1, 4, 7],
        [1, 5, 9]
    ], // 1
    [
        [1, 2, 3],
        [2, 5, 8]
    ], //2
    [
        [1, 2, 3],
        [3, 6, 9],
        [3, 5, 7]
    ], //3
    [
        [1, 4, 7],
        [4, 5, 6]
    ], //4,
    [
        [1, 5, 9],
        [2, 5, 8],
        [3, 5, 7],
        [4, 5, 6]
    ], //5
    [
        [3, 6, 9],
        [6, 5, 4]
    ], //6
    [
        [7, 8, 9],
        [7, 5, 3],
        [1, 4, 7]
    ], //7
    [
        [8, 5, 2],
        [7, 8, 9]
    ], //8
    [
        [9, 5, 1],
        [9, 6, 3],
        [7, 8, 9]
    ] //9
]

function checkWinStatus(data, player) {
 
    localStorage.removeItem('checkIfGameIsaTie')

    // loop through permutations to check if any condition is met for a wining outcome
    for (i = 0; i < permutations.length; i++) {
        for (x = 0; x < permutations[i].length; x++) {
            if (val(permutations[i][x][0]) == val(permutations[i][x][1]) && val(permutations[i][x][1]) == val(permutations[i][x][2]) && val(permutations[i][x][0]) != '' && getFromStorage('winStatus') != 'true') {
                win(val(permutations[i][x][0]), permutations[i][x])

                console.log('won')
                localStorage.setItem('checkIfGameIsaTie', 'true');
                localStorage.setItem('winStatus', 'true');
                break;
            } else {
                localStorage.setItem('winStat', 'false');
            }
        }
    }

    if (allBoxesAreChecked() == '0' && getFromStorage('checkIfGameIsaTie') != 'true') {
        win('is-A-Tie', 'is-A-Tie')
    }

    console.log(allBoxesAreChecked() + " " + getFromStorage('checkIfGameIsaTie'))
}



function playgame(data, player) {

   

    // computer's retaliation
    if (player != getFromStorage('oppform') && getFromStorage('gameMode') != 'multi') {
        computerResponse(data)
        checkWinStatus(data, player);
    }

    // multi-player actions
    if (getFromStorage('gameMode') == 'multi') {
        let newtone = Math.floor(Math.random() * 10000000000) // create a new tone for opponent to listen
        $.ajax({
                url: serverURL,
                type: 'POST',
                dataType: "jsonp",
                data: 'play=' + player + '&app=' + data + '&gameID=' + getFromStorage('gameID') + '&newtone=' + newtone
            })
            .done(function (res) {
                data = JSON.parse(res);
                if (data.stat == 1) {
                    new toast('', getFromStorage('opp-name') + '\'s turn', 'x');
                    $('body').append('<div id=pause class=lay></div>');
                    localStorage.setItem('tone', data.newtone)
                } else {

                }
            })
            .fail(function () {
                new toast('red', 'an error occured', 2)
            })
        checkWinStatus(data, player);
    }

    //CHECK IF ALL BOXES ARE PLAYED
    sessionStorage.setItem('itemPlay', sessionStorage.getItem('itemPlay') + '1')




}

function computerResponse(data) {
    let randbase = Math.floor(Math.random() * permutations[data - 1].length);
    let randpick = Math.floor(Math.random() * permutations[data - 1][randbase].length)
    let play = permutations[data - 1][randbase][randpick]
    // console.log('play ' + play)
    if (sessionStorage.getItem('itemPlay').length < 8) {
        console.log(sessionStorage.getItem('itemPlay').length)
        if ($('#' + play).attr('data-val') === '') {
            $('#' + play).html(getFromStorage('oppform'))
            $('#' + play).attr('data-val', getFromStorage('oppform'))
            $('#' + play).addClass('tick active')
            playgame(play, getFromStorage('oppform'))
        } else {
            computerResponse(data)
        }
    }
}

function win(playerPiece, winingCombination) {

    msgWin = ['WINNER!! ooin... you\'re doing well! ', 'GOOD JOB! who\'s the boss? yes you are!! ', 'AWESOME!!! Einstein has nothing on you. carry go!', 'YOU JUST WON. maybe by luck but thats not the point'];
    msgLos = ['you\'ll need all the help you can get.<br/>coz you kinda suck', ' would yo momma be proud of what u just did?', 'Congrats. you embarassed your hometown', 'yo, <br/>why you put so much effort in being dumb?']
    if (playerPiece === getFromStorage('form')) {
        color = 'suf',
        msg = msgWin[Math.floor(Math.random() * 4)]
        sub = 'you won';
    } else if (playerPiece === 'is-A-Tie') {
        color = 'suf',
        msg = 'great! you met your dumb match'
        sub = 'its a tie';
    } else {
        color = 'dark',
        msg = msgLos[Math.floor(Math.random() * 4)]
        sub = 'you lost. . . woefully'
    }
    let toasty = new toast('', sub, 5);
    $('.lay').hide();
    $('body').append('<div class="lay animated tada fed ' + color + '"><div class=cont><div class="Name txx animated pulse infinite">' + msg + '</div> <div onclick="refreshAllSettingsToDefault()"  class="pills replay">replay</div> <div class="pills" onclick="getPage(0)">leave</div></div></div>')
    
    for (i = 0; i < winingCombination.length; i++) {

        $('#' + winingCombination[i]).addClass('won')
    }
}

function getPage(id) {
    $('overlay,.lay').hide()
    $('.tab').removeClass('activeX');
    $('#tab' + id).addClass('activeX')
}

//page 1 - check if user id exists
if (getFromStorage('userID') === null) {
    getPage(1);
}


//FORMS

$('input').keyup(function () {
    $(this).val($(this).val().replace(' ', '-'))
})

$('#startUP').submit(function (e) {
    e.preventDefault();
    console.log($(this).serialize())
    localStorage.setItem('userID', $('#namer').val());
    localStorage.setItem('userKEY', Math.floor(Math.random() * 900000));
    getPage(0);
})
//get localstorage val
function getFromStorage(data) {
    return localStorage.getItem(data)
}

//start sessions
sessionStorage.setItem('itemPlay', '1');

//page btn controller
$('.to').click(function () {
    getPage($(this).attr('data-to'))
})

$('.vsCom').click(function () {
    refreshAllSettingsToDefault();
    localStorage.setItem('opp-name', 'computer')
    localStorage.setItem('gameMode', 'com')
    $('.opp').html(getFromStorage('opp-name'))
})


// play as function
function setForm(data) {
    if (data === 'x') {
        localStorage.setItem('oppform', 'o')
    } else {
        localStorage.setItem('oppform', 'x')
    }
    localStorage.setItem('form', data)
    new toast('', getFromStorage('userID') + ' is now playing as ' + getFromStorage('form'), 1.5)
}

//plasy as formart
$('.formart').click(function () {
    setForm($(this).attr('data-form'))
    console.log($(this).attr('data-to'))
})


//distributor






//multiplayrer



$('.opp').html(getFromStorage('opp-name'))


// main multiplayer listner function
function listen() {
    mainListener = setInterval(function () {
        $.ajax({
                url: serverURL,
                type: 'POST',
                data: 'listener=true&gameID=' + getFromStorage('gameID') + '&tone=' + getFromStorage('tone')
            })
            .done(function (res) {
                data = JSON.parse(res) //parse sever response
                if (data.recognition != true) {
                    $('.lay,.alert').hide();
                    new toast('', 'your turn', 2)

                    $('#' + data.mG['player']).html(data.mG['action'])
                    $('#' + data.mG['player']).attr('data-val', data.mG['action'])
                    $('#' + data.mG['player']).addClass('tick active')
                    checkWinStatus(Number(data.mG['player']), (data.mG['action']));
                    // console.log(data)
                    localStorage.setItem('tone', data.tone)
                }

            })
            .fail(function () {
                $('body').append('<div class=overlay></div>')
                new toast('red', 'oops!  pls check internet connection', 10)
            })
    }, 1000)
}


// create challenge
$('.startGame').click(function () {
    refreshAllSettingsToDefault()
    console.log('gamestart')
    let gameId = getFromStorage('userID') + '-' + Math.floor(Math.random() * 5000)
    let startTone = Math.floor(Math.random() * 99999999999)
    localStorage.setItem('tone', startTone);
    localStorage.setItem('gameMode', 'multi');
    localStorage.setItem('gameID', gameId);
    $('body').append('<div class="overlay animated fadeIn"><div class=cont><p>game id:</p><p class="Name tw">' + gameId + '<div id=qt class="pills animated pulse infinite"><i class="feather  icon-radio"> </i><span id=ft> setting stuff up. . </span></div></p></div></div>')
    $.ajax({
            url: serverURL,
            type: 'POST',
            data: 'newGame=1&gameID=' + gameId + '&gameHost=' + getFromStorage('userID') + '&gameForm=' + getFromStorage('form') + '&startTone=' + startTone
        })
        .done(function (res) {
            data = JSON.parse(res)
            console.log(data)
            if (data.action[0] === 'fail') {
                $('#qt').addClass('red');
            } else {
                $('#qt').addClass('sux');
            }

            $('#ft').html(data.msg)
        })
        .fail(function () {
            $('body').append('<div class=overlay></div>')
            new toast('red', 'failed to Host game- pls check internet connection', 10)
        })

    listen('host')


    let waitingForOpponent = setInterval(function () {


        $.ajax({
                url: serverURL,
                type: 'POST',
                data: 'startx=1&gameID=' + gameId
            })
            .done(function (res) {
                data = JSON.parse(res)
                // console.log(data.tone+" tun "+getFromStorage('tone'))
                if (data.stat == 'start') {
                    $('.overlay').fadeOut();
                    getPage(3);
                    console.log('started')
                    localStorage.setItem('form', data.blob.form)
                    localStorage.setItem('opp-name', data.blob.opp);

                    new toast('', 'your turn', 1);
                    $('.opp').html(getFromStorage('opp-name'))
                    clearInterval(waitingForOpponent)
                }

            })
            .fail(function () {
                $('body').append('<div class=overlay></div>')
                new toast('red', 'oops!  pls check internet connection', 10)
            })
    }, 1500)

})

// join challenge
$('.joinGame').click(function () {
    // console.log('gamestart')
    // let gameId=getFromStorage('userID')+'-'+Math.floor(Math.random()*5000)
    $('body').append('<div class="overlay animated fadeIn"><span class="feather icon-arrow-left to bcktn" onclick="$(\'.overlay\').hide()"></span><div class=cont><form class=joiner><pre>   </pre><input id=jt required name=joinId  placeholder="enter game ID" classs="Name jt"><div><button type=submit class=pill>join</button></div></form></div></div>')
    $('.joiner').submit(function (e) {
        e.preventDefault();
        $.ajax({
                url: serverURL,
                type: 'POST',
                data: 'joinGame=1&gameID=' + $('#jt').val() + '&gamePlayer=' + getFromStorage('userID')
            })
            .done(function (res) {
                data = JSON.parse(res)
                console.log(data)
                if (data.action[0] == 'invalid') {
                    new toast('red', data.msg, 2);
                }
                if (data.action[0] == 'startGame') {
                    refreshAllSettingsToDefault()
                    new toast('sux', data.msg, 2);
                    $('.overlay').fadeOut();
                    getPage(3);
                    localStorage.setItem('form', data.blob.form)
                    localStorage.setItem('opp-name', data.blob.opp);
                    $('body').append('<div class=lay></div>')
                    new toast('', 'waiting for ' + getFromStorage('opp-name'), 'x');
                    $('.opp').html(getFromStorage('opp-name'))
                    localStorage.setItem('gameMode', 'multi');
                    localStorage.setItem('gameID', $('#jt').val());
                    localStorage.setItem('tone', data.tone);
                    //game starts

                    listen('player')

                }
            })
            .fail(function () {
                $('body').append('<div class=overlay></div>')
                new toast('red', 'failed to connect pls check internet connection', 10)
            })
    })

})



function refreshAllSettingsToDefault() {
    $('.app').html('');
    $('.app').removeClass('tick active won');
    $('.app').attr('data-val', '')
    $('.lay,.overlay').hide();
    localStorage.removeItem('winStatus')
    sessionStorage.setItem('itemPlay', '1');
}

$('.replay').on('click', function () {
    refreshAllSettingsToDefault()
})

$('.tab').addClass('animated zoomInRight page')
