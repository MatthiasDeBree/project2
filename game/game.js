

//constant
var maxDeckMonsters = 4;
var monsters = ['Finlix', 'Meleon', 'Purrlit', 'Paracaw', 'Cuburn'];
var levels = [
    { 'level': '0', 'top': '745px', 'left': '628px', 'gym': 'false' },
    { 'level': '1', 'top': '655px', 'left': '630px', 'gym': 'false' }, //trainlevel
    { 'level': '2', 'top': '522px', 'left': '607px', 'gym': 'true' },
    { 'level': '3', 'top': '400px', 'left': '645px', 'gym': 'false' }, //trainlevel
    { 'level': '4', 'top': '228px', 'left': '655px', 'gym': 'true' },
    { 'level': '5', 'top': '300px', 'left': '1155px', 'gym': 'true' },
    { 'level': '6', 'top': '476px', 'left': '1147px', 'gym': 'true' }
];


$(window).load(function () {

    $('body').css({
        'height' : $(window).height()
    });

    $('#wrapper').css({
        'height' : $(window).height()
    });
    
    $('#newGame').on('click', function(e) {
        window.location.href = "newgame.html";
    });

    $('#loadGame').on('click', function(e) {
        $.ajax({
            type: "GET",
            url: "http://mattweb.be/ProjectGame/api/players",
            dataType: "JSON",
            success: function (data) {

                $.each(data.content, function (i, player) {

                    $('#myAccounts').append('<li class="player" ><a href="map.html?level=' + player.level + '&player=' + player.id + '&maxlevel='+player.level+'" id="' + player.id + '">' + player.name + '<span>level: ' + player.level + '</span></a></li>');

                });
            }
        });
    });

    /* 
     * NEWGAME.HTML
     *
     */
    if (document.location.href.indexOf('newgame.html') > 0) {
        var name, baseHp, baseStr, baseXp, multiplier, skills;

        $('#purrlit img').css({
            'height': ($(window).height() / 3.2),
            'width': ($(window).width() / 5.5)
        });
        $('#meleon img').css({
            'height': ($(window).height() / 3.2),
            'width': ($(window).width() / 5.5)
        });
        $('#finlix img').css({
            'height': ($(window).height() / 3.2),
            'width': ($(window).width() / 5.5)
        });
        $('#startMonsters').css({
            'width': (($(window).width() / 5.5) * 3) + 20
        });

        $('#startMonsters li a').on('click', function () {
            $('#startMonsters li a.selected').removeClass('selected');
            $('#' + this.id).addClass('selected');

            $.ajax({
                type: 'GET',
                url: 'http://mattweb.be/ProjectGame/api/monsters/' + this.id,
                dataType: 'JSONP',
                success: function (data) {
                    var creatureObject = data.content[0];

                    name = creatureObject.name;
                    baseHp = creatureObject.baseHp;
                    baseStr = creatureObject.baseStr;
                    baseXp = creatureObject.baseXp;
                    multiplier = creatureObject.multiplier;
                    skills = JSON.parse(creatureObject.skills);

                    alert('name= ' + name + ", hp= " + baseHp + ", str= " + baseStr);
                }
            });
        });

        $('#createPlayer').on('click', function (e) {
            var creature = $('.selected').attr('id');
            var error = false;

            $.ajax({
                type: 'GET',
                url: 'http://mattweb.be/ProjectGame/api/players/',
                dataType: 'JSONP',
                success: function (data) {
                    $.each(data.content, function (i, player) {
                        if ($('#playerName').val() == player.name) {
                            error = true;
                            console.log(error);
                        }
                    });

                    if (($('#playerName').val() == '') || error == true) {
                        $('#playerName').addClass('error');
                    }
                    else {

                        $.ajax({
                            type: "POST",
                            url: "http://mattweb.be/ProjectGame/api/players",
                            data: { name: $('#playerName').val(), level: 0, coins: 0, pokeballs: 0 },
                            dataType: "JSON",
                            success: function () {

                                $.ajax({
                                    type: 'GET',
                                    url: 'http://mattweb.be/ProjectGame/api/players/' + $('#playerName').val(),
                                    dataType: 'JSONP',
                                    success: function (data) {

                                        $.ajax({
                                            type: "POST",
                                            url: "http://mattweb.be/ProjectGame/api/deckMonsters",
                                            data: { name: name, level: 0, hp: baseHp, str: baseStr, xp: baseXp, current_xp: 0, multiplier: multiplier, player_id: data.content[0].id, skill1: skills[0].skill1, skill2: skills[0].skill2, skill3: skills[0].skill3 },
                                            dataType: "JSON",
                                            success: function () {
                                                window.location.href = "map.html?player=" + data.content[0].id + "&level=" + data.content[0].level + "&maxlevel=" + data.content[0].level;
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    }
                }
            });
            
        });
    }




    /* 
     * MAP.HTML
     *
     */
    else if (document.location.href.indexOf('map.html') > 0) {
        var left = $(window).width() / 2;
        var top = ($(window).height() - 80) / 2;
        var params = getUrlParameters();
        var player = params.player;
        var won = params.won;
        var level = params.level;
        var maxlevel = params.maxlevel;
        var coins;
        var pokeballs;

        $('body').css({
            'overflow': 'scroll'
        });

        $.ajax({
            type: "GET",
            url: "http://mattweb.be/ProjectGame/api/players/" + player,
            dataType: "JSON",
            success: function (data) {
                coins = data.content[0].coins;
                pokeballs = parseInt(data.content[0].pokeballs);
                $('#total').text(coins);
                $('#balls').text(pokeballs);
            }
        });

        $('input').change(function () {
            $('#price').text(100 * parseInt($(this).val()));
        });

        // Draw level markers on the map
        for (var i = 0; i <= maxlevel; i++) {
            var levelObject = levels[i];
            drawMarker(levelObject);

            $('#level' + levelObject.level).on('click', function () {

                //Start battle
                var left = $(window).width() / 2;
                var top = ($(window).height() - 80) / 2;
                var levelID = parseInt(this.id.match(/\d+$/)[0]) + 1;
                var levelObject = levels[levelID];

                window.location.href = "battle.html?level="+levelID+"&player="+player+"&maxlevel="+maxlevel;

            });
        }

        // Open map where user left off. If user completes a level, slow animation timing down.
        $.scrollTo($('#level' + maxlevel), 5, { offset: { left: -left, top: -top } });

        // If user completes battle!
        if (won == 'true') {
            var levelObject = levels[parseInt(level) + 1];
            drawMarker(levelObject);
            $.scrollTo($('#level' + (parseInt(level) + 1).toString()), 1000, { offset: { left: -left, top: -top } });

            $('#level' + levelObject.level).on('click', function () {

                //Start battle
                var left = $(window).width() / 2;
                var top = ($(window).height() - 80) / 2;
                var levelID = parseInt(this.id.match(/\d+$/)[0]) + 1;
                var levelObject = levels[levelID];

                window.location.href = "battle.html?level=" + levelID + "&player=" + player + "&maxlevel=" + maxlevel;

            });
        }
        
        $('#openShop').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            $('#shop').toggle();
        });

        $('#buy').on('click', function () {
            if ((100 * parseInt($('input').val())) <= coins) {
                $('input').removeClass('error');
                pokeballs += parseInt($('input').val());
                coins = coins - (100 * parseInt($('input').val()));

                $.ajax({
                    type: "POST",
                    url: "http://mattweb.be/ProjectGame/api/players/" + player,
                    data: { coins: coins, pokeballs: pokeballs },
                    dataType: "JSON",
                    success: function () {
                        $('#total').text(coins);
                        $('#balls').text(pokeballs);
                    }
                });
            }
            else {
                $('input').addClass('error');
            }
        });
    }
    



    /* 
     * BATTLE.HTML
     *
     */
    else if (document.location.href.indexOf('battle.html') > 0) {
        var myMonsters, monsterName;
        var chosenPlayerMonster, chosenOpponentMonster;
        var params = getUrlParameters();
        var player = params.player;
        var level = params.level;
        var maxlevel = params.maxlevel;

        // Get all monsters in players deck
        $.ajax({
            type: 'GET',
            url: 'http://mattweb.be/ProjectGame/api/players/'+player+'/deckMonsters',
            dataType: 'JSONP',
            success: function (data) {
                myMonsters = data;

                $('#optionWindow').css({
                    'display': 'block'
                });

                $.each(data.content, function (i, deckMonster) {
                    $('#pickMonsters').append('<a href="#" id="' + deckMonster.name + '" class="' + ((i == 0) ? 'selected' : '') + '"><img src="../img/monsters/' + deckMonster.name + '.png" /></a>');
                    monsterName = $('.selected').attr('id');

                    $('#pickMonsters a').on('click', function () {
                        $('#optionWindow a.selected').removeClass('selected');
                        $('#' + this.id).addClass('selected');
                        monsterName = this.id;
                    });

                });

            }
        });
 
        $('#startBattle').on('click', function () {
            $('#optionWindow').css({
                'display': 'none'
            });
            $('#startBattle').toggle();
            $('#pickNew').css({
                'display': 'block'
            });

            // Get my monster and store in chosenPlayerMonster
            $.each(myMonsters.content, function (i, deckMonster) {
                if (deckMonster.name == monsterName) {
                    chosenPlayerMonster = deckMonster;

                    $('#playerPic').attr('src', '../img/monsters/' + deckMonster.name + '.png');
                    $('#experience').css({
                        width: ((deckMonster.current_xp / deckMonster.xp) * 100) + '%'
                    }, 1000, function () {
                    });

                    // Get opponent random monster and store in chosenOpponentMonster
                    if ((levels[level - 1].gym != 'true') || (levels[level - 1].level == 0)) {
                        $.ajax({
                            type: 'GET',
                            url: 'http://mattweb.be/ProjectGame/api/monsters/' + monsters[Math.floor((Math.random() * 2) + 3)],
                            dataType: 'JSONP',
                            success: function (data) {
                                chosenOpponentMonster = data.content[0];

                                $('#opponentPic').attr('src', '../img/monsters/' + chosenOpponentMonster.name + '.png');

                                //Start battle
                                beginBattle(chosenPlayerMonster, myMonsters, chosenOpponentMonster, player, levels[level - 1], maxlevel);
                            }
                        });
                    }
                    else {
                        $.ajax({
                            type: 'GET',
                            url: 'http://mattweb.be/ProjectGame/api/monsters/' + monsters[Math.floor((Math.random() * 3))],
                            dataType: 'JSONP',
                            success: function (data) {
                                chosenOpponentMonster = data.content[0];

                                $('#opponentPic').attr('src', '../img/monsters/' + chosenOpponentMonster.name + '.png');

                                //Start battle
                                beginBattle(chosenPlayerMonster, myMonsters, chosenOpponentMonster, player, levels[level - 1], maxlevel);
                            }
                        });
                    }
                }
            });
        });
    }
});

var beginBattle = function (chosenPlayerMonster, myMonsters, chosenOpponentMonster, player, levels, maxlevel) {

    $('#wrapper #opponent .ground').css({
        'top' : $('#opponentPic').height() + 40 - ((2/3)*$('#wrapper #opponent .ground').height()) + 'px'
    });

    var gym = levels.gym;
    var opponentLevel = 0;
    var monsterName = '';

    // Opponent
    if (gym == 'true') {
        opponentLevel = (levels.level * 3);
        $('.event').css('display', 'none');
    }
    else {
        if (levels.level != 0) {
            $('#events').css('display', 'block');
        }  

        if (levels.level == 0) {
            $('.event').css('display', 'none');
            opponentLevel = 0;
        }
        else if (levels.level == 1) {
            opponentLevel = 1;
        }
        else if (levels.level == 3) {
            opponentLevel = 5;
        }
    }
    var opponentMultiplier = chosenOpponentMonster.multiplier;
    var opponentTotalHp = Math.round(chosenOpponentMonster.baseHp * Math.pow(opponentMultiplier, opponentLevel)); // total health points
    var opponentCurrentHp = opponentTotalHp; // current health points
    var opponentStr = Math.round(chosenOpponentMonster.baseStr * Math.pow(opponentMultiplier, opponentLevel));
    var opponentExp = Math.round(chosenOpponentMonster.baseXp * Math.pow(opponentMultiplier, opponentLevel));
    var opponentSkills = JSON.parse(chosenOpponentMonster.skills);

    console.log('hp: ' + opponentTotalHp + 'str: ' + opponentStr);

    // Player
    var playerLevel = chosenPlayerMonster.level;
    var playerTotalHp = chosenPlayerMonster.hp; // total health points
    var playerCurrentHp = playerTotalHp; // current health points
    var playerStr = chosenPlayerMonster.str;
    var playerMultiplier = chosenPlayerMonster.multiplier;
    var playerExp = chosenPlayerMonster.xp;
    var playerCurrentExp = chosenPlayerMonster.current_xp;
    var playerSkills = [chosenPlayerMonster.skill1, chosenPlayerMonster.skill2, chosenPlayerMonster.skill3];

    console.log('hp: ' + playerTotalHp + 'str: ' + playerStr);

    $('#opponentName').text('Lv.' + opponentLevel + ' ' + chosenOpponentMonster.name);
    $('#playerName').text('Lv.' + playerLevel + ' ' + chosenPlayerMonster.name);
    $('#skill1').text(playerSkills[0]);
    $('#skill2').text(playerSkills[1]);
    $('#skill3').text(playerSkills[2]);

    // Game variables
    var percentageLeft;
    var damage;
    var disable;
    var onTheMove = Math.floor((Math.random() * 2));
    var monstersLeft = myMonsters.content.length;
    var deadMonsters = new Array();
    var pokeballs;

    $.ajax({
        type: "GET",
        url: "http://mattweb.be/ProjectGame/api/players/" + player,
        dataType: "JSON",
        success: function (data) {
            pokeballs = parseInt(data.content[0].pokeballs);
            $('#balls').text(pokeballs);
        }
    });

    if (onTheMove == 1) {
        $('#skillsAndEvents').css({
            'background-color' : 'Grey'
        });
        $('#skills').toggle();
        $('#events').toggle();
    }

    function loopMoves() {
        var refreshIntervalId = setInterval(function () {

            if ((opponentCurrentHp > 0) && (playerCurrentHp > 0)) {  

                //playerMove
                if (onTheMove == 0) {

                    // attack skill
                    $('.skill a').on('click', function (event) {
                        $('#skillsAndEvents').css({
                            'background-color' : 'Grey'
                        });
                        $('#skills').toggle();
                        $('#events').toggle();
                        //$('.event').toggle();
                        var skill = $(this).text();
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        damage = Math.floor((Math.random() * ((playerStr / 2 + 1) - (playerStr / 2 - 1) + 1) + (playerStr / 2 - 1)));
                        $('#battleLog').val('\n' + chosenPlayerMonster.name+' used '+skill+' and dealt ' + damage + ' damage.');
                        opponentCurrentHp = opponentCurrentHp - damage;
                        percentageLeft = 100 - (((opponentTotalHp - opponentCurrentHp) / opponentTotalHp) * 100);

                        $('#opponentHealth .color').animate({
                            width: percentageLeft + '%'
                        }, 1000, function() {
                            onTheMove++;
                        });
                    });

                    // run event
                    $('.event #run').on('click', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        $('#skillsAndEvents').css({
                            'background-color': 'Grey'
                        });
                        $('#skills').toggle();
                        $('#events').toggle();
                        if (gym == 'false') {
                            $('#battleLog').val('\n' + 'Running from battle...');

                            endScreen('lost', levels.level, player, maxlevel, pokeballs);
                        }
                    });

                    // catch event
                    $('.event #catch').on('click', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        $('#skillsAndEvents').css({
                            'background-color': 'Grey'
                        });
                        $('#skills').toggle();
                        $('#events').toggle();

                        if ((gym == 'false') && (myMonsters.content.length < maxDeckMonsters)) {
                            var ball = 60; // normal = 100, ultra = 150, ...
                            var catchRate = ball * (1 - (opponentLevel / 100));
                            var hpRate = (opponentCurrentHp / opponentTotalHp) * 100;
                            var random = Math.ceil(Math.random() * catchRate);

                            if ((random >= hpRate) && (pokeballs > 0)) { // if caught
                                $('#battleLog').val('\n Succes! Monster is now captured!');
                                pokeballs--;
                                $('#balls').text(pokeballs);
                                $.ajax({
                                    type: "POST",
                                    url: "http://mattweb.be/ProjectGame/api/deckMonsters",
                                    data: { name: chosenOpponentMonster.name, level: opponentLevel, hp: opponentTotalHp, str: opponentStr, xp: opponentExp, current_xp: 0, multiplier: opponentMultiplier, player_id: player, skill1: opponentSkills[0].skill1, skill2: opponentSkills[0].skill2, skill3: opponentSkills[0].skill3 },
                                    dataType: "JSON",
                                    success: function () {
                                        setTimeout(function () {
                                            endScreen('won', levels.level, player, maxlevel, pokeballs);
                                        }, 1000);
                                    }
                                });
                            }
                            else if (pokeballs == 0) {
                                $('#battleLog').val('\n' + 'Out of pokeballs!');
                                $('#balls').text(pokeballs);
                                setTimeout(function () {
                                    onTheMove++;
                                }, 1000);
                            }
                            else {
                                $('#battleLog').val('\n' + 'Capture failed!');
                                pokeballs--;
                                $('#balls').text(pokeballs);
                                setTimeout(function () {
                                    onTheMove++;
                                }, 1000);
                            }
                        }
                        else {
                            $('#battleLog').val('\n' + 'Max number of monsters reached. This is for future updates.');
                            setTimeout(function () {
                                onTheMove++;
                            }, 1000);
                        }
                        
                    });

                }

                //opponentMove
                else {
                    onTheMove--;

                    setTimeout(function () {
                        damage = Math.floor((Math.random() * ((opponentStr / 2 + 1) - (opponentStr / 2 - 1) + 1) + (opponentStr / 2 - 1)));
                        $('#battleLog').val('\n' + chosenOpponentMonster.name + ' used SKILL and dealt ' + damage + ' damage.');
                        playerCurrentHp = playerCurrentHp - damage;
                        percentageLeft = 100 - (((playerTotalHp - playerCurrentHp) / playerTotalHp) * 100);

                        $('#playerHealth .color').animate({
                            width: percentageLeft + '%'
                        }, 1000, function () {
                            if (playerCurrentHp > 0) {
                                $('#skillsAndEvents').css({
                                    'background-color': 'White'
                                });
                                $('#skills').toggle();
                                $('#events').toggle();
                            }
                        });
                    }, 1500);
                }

            }
            else if ((playerCurrentHp <= 0) && (monstersLeft > 1)) { // Died but there are more in the deck

                clearInterval(refreshIntervalId); // Stop the loop
                deadMonsters[monstersLeft] = chosenPlayerMonster.name;
                monstersLeft--;

                setTimeout(function () {
                    $('#pickMonsters').empty();
                    $('#pickNew').css({
                        'display': 'block'
                    });

                    $('#optionWindow').css({
                        'display': 'block'
                    });

                    $.each(myMonsters.content, function (i, deckMonster) {
                        if (jQuery.inArray(deckMonster.name, deadMonsters) > -1) {
                            console.log('dead: ' + deckMonster.name);
                        }
                        else {
                            $('#pickMonsters').append('<a href="#" id="' + deckMonster.name + '" class="' + ((i == 0) ? 'selected' : '') + '"><img src="../img/monsters/' + deckMonster.name + '.png" /></a>');
                            monsterName = $('.selected').attr('id');
                        }
                        
                        $('#pickMonsters a').on('click', function () {
                            if (this.id != 'startBattle') {
                                $('#optionWindow a.selected').removeClass('selected');
                                $('#' + this.id).addClass('selected');
                                monsterName = this.id;
                            }
                        });

                    });

                    $('#pickNew').on('click', function () {
                        $('#optionWindow').css({
                            'display': 'none'
                        });

                        $.each(myMonsters.content, function (i, deckMonster) {

                            if (deckMonster.name == monsterName) {
                                chosenPlayerMonster = deckMonster;

                                $('#playerPic').attr('src', '../img/monsters/' + deckMonster.name + '.png');

                                playerLevel = chosenPlayerMonster.level;
                                playerTotalHp = chosenPlayerMonster.hp; // total health points
                                playerCurrentHp = playerTotalHp; // current health points
                                playerStr = chosenPlayerMonster.str;
                                playerMultiplier = chosenPlayerMonster.multiplier;
                                playerExp = chosenPlayerMonster.xp;
                                playerCurrentExp = chosenPlayerMonster.current_xp;
                                playerSkills = [chosenPlayerMonster.skill1, chosenPlayerMonster.skill2, chosenPlayerMonster.skill3];

                                $('#playerName').text('Lv.' + playerLevel + ' ' + chosenPlayerMonster.name);
                                $('#skill1').text(playerSkills[0]);
                                $('#skill2').text(playerSkills[1]);
                                $('#skill3').text(playerSkills[2]);

                                $('#experience').css({
                                    width: ((deckMonster.current_xp / deckMonster.xp) * 100) + '%'
                                });

                                $('#playerHealth .color').animate({
                                    width: '100%'
                                }, function () {
                                    $('#skillsAndEvents').css({
                                        'background-color': 'White'
                                    });
                                    $('#skills').css({
                                        'display': 'block'
                                    });
                                    $('#events').css({
                                        'display': 'block'
                                    });

                                    onTheMove = 0;
                                    loopMoves();
                                });
                            }
                        });
                        
                    });

                }, 2000);
            }
            else {
                clearInterval(refreshIntervalId); // Stop the loop

                setTimeout(function () {
                    console.log('battle has ended');

                    if (opponentCurrentHp <= 0) {
                        playerCurrentExp = parseInt(playerCurrentExp) + (opponentExp * (opponentMultiplier * 2));
                        
                        if (playerCurrentExp >= playerExp) {
                            console.log('level up!');

                            $('#experience').animate({
                                width: 100 + '%'
                            }, 1000, function () {
                                $('#levelWindow').css({
                                    'display': 'block'
                                });

                                $('#myMonster').attr('src', '../img/monsters/' + chosenPlayerMonster.name + '.png');
                                $('#information').text(chosenPlayerMonster.name + ' is now level ' + (parseInt(chosenPlayerMonster.level) + 1));
                                $('#oldHp').text(playerTotalHp);
                                $('#oldStr').text(playerStr);
                                $('#extraHp').text(' +' + (Math.round(playerTotalHp * playerMultiplier) - playerTotalHp));
                                $('#extraStr').text(' +' + (Math.round(playerStr * playerMultiplier) - playerStr));
                                $('#exp').text('Experience for next level up = ' + Math.round(playerExp * 2 * playerMultiplier));

                                $('#continueBattle').on('click', function (event) {
                                    $('#playerName').text('Lv.' + (parseInt(playerLevel) + 1) + ' ' + chosenPlayerMonster.name);
                                    $('#experience').css({
                                        width: 0 + '%'
                                    });
                                    $('#levelWindow').css({
                                        'display': 'none'
                                    });
                                    $('#experience').animate({
                                        width: (((playerCurrentExp - playerExp) / Math.round(playerExp * 2 * playerMultiplier)) * 100) + '%'
                                    }, 1000, function () {
                                        endScreen('won', levels.level, player, maxlevel, pokeballs);
                                    });
                                });
                            });

                            $.ajax({
                                type: "POST",
                                url: "http://mattweb.be/ProjectGame/api/deckMonsters/" + chosenPlayerMonster.id,
                                data: { level: parseInt(chosenPlayerMonster.level) + 1, hp: Math.round(playerTotalHp * playerMultiplier), str: Math.round(playerStr * playerMultiplier), xp: Math.round(playerExp * 2 * playerMultiplier), current_xp: playerCurrentExp - playerExp },
                                dataType: "JSON",
                                success: function () {
                                    console.log('success');
                                }
                            });
                        }
                        else if (playerCurrentExp < playerExp) {
                            $('#experience').animate({
                                width: ((playerCurrentExp / playerExp) * 100) + '%'
                            }, 1000, function () {
                            });

                            $.ajax({
                                type: "POST",
                                url: "http://mattweb.be/ProjectGame/api/deckMonsters/" + chosenPlayerMonster.id,
                                data: { current_xp: playerCurrentExp },
                                dataType: "JSON",
                                success: function () {
                                    console.log('success');

                                    endScreen('won', levels.level, player, maxlevel, pokeballs);
                                }
                            });
                        }
                    }
                    else {
                        endScreen('lost', levels.level, player, maxlevel, pokeballs);
                    }
                }, 1500);
            }
            

        }, 500);
    }

    loopMoves();

}

var endScreen = function (ending, level, player, maxlevel, pokeballs) {
    var levelID = parseInt(level);
    var max = parseInt(maxlevel);

    $('#battleLog').val('\n' + 'Player ' + ending + ' the battle, returning to map.');

    setTimeout(function () {
        if (ending == 'won') {

            $.ajax({
                type: "GET",
                url: "http://mattweb.be/ProjectGame/api/players/" + player,
                dataType: "JSON",
                success: function (data) {
                    $.ajax({
                        type: "POST",
                        url: "http://mattweb.be/ProjectGame/api/players/" + player,
                        data: { coins: (parseInt(data.content[0].coins) + 25), pokeballs: pokeballs },
                        dataType: "JSON",
                        success: function () {
                            if (max == level) {
                                max++;
                                $.ajax({
                                    type: "POST",
                                    url: "http://mattweb.be/ProjectGame/api/players/" + player,
                                    data: { level: max },
                                    dataType: "JSON",
                                    success: function () {
                                        console.log('added maxlevel= ' + max);
                                        window.location.href = 'map.html?&player=' + player + '&level=' + levelID + '&won=true' + '&maxlevel=' + max;
                                    }
                                });
                            }
                            else {
                                window.location.href = 'map.html?&player=' + player + '&level=' + levelID + '&won=true' + '&maxlevel=' + max;
                            }
                        }
                    });
                }
            });

        }
        else {
            window.location.href = 'map.html?&player=' + player + '&level=' + levelID + '&maxlevel=' + max;
        }
    }, 1000);
}

var drawMarker = function (levelObject) {

    if (levelObject.gym == 'true') {
        $('#levelMarkers').append('<div id="level' + levelObject.level + '" class="marker"></div>');
        $('#level' + levelObject.level).css({
            'top': levelObject.top,
            'left': levelObject.left
        });
    }
    else {
        $('#levelMarkers').append('<div id="level' + levelObject.level + '" class="marker training"></div>');
        $('#level' + levelObject.level).css({
            'top': levelObject.top,
            'left': levelObject.left
        });
    }
}

var getUrlParameters = function () {

    var prmstr = window.location.search.substr(1);
    var prmarr = prmstr.split("&");
    var params = {};

    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }

    return params;
}
