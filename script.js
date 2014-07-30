$(document).ready(function() {
    var $body = $('body');
    var $result = $('.result h1');
    var $attackers_result = $('.attackers-result');
    var $defenders_result = $('.defenders-result');

    $body.on('focus', '.dice', function() {
        $result.text('No one');
        $attackers_result.empty();
        $defenders_result.empty();
    });

    $body.on('focusout', '.dice', function() {
        var attacker_troops = $('#attacker-dice').val();
        var defender_troops = $('#defender-dice').val();

        if (defender_troops == '' || attacker_troops == '') {
            return;
        }

        var attackers = {
            total: attacker_troops,
            lost: 0
        };
        var defenders = {
            total: defender_troops,
            lost: 0
        };

        attackers.remaining = attackers.total;
        defenders.remaining = defenders.total;

        var attack_dices = [0, 0, 0];
        var defense_dices = [0, 0];

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function rollDices(dices, container, css_class) {
            for (var i = 0; i < dices.length; i++) {
                dices[i] = getRandomInt(1, 6);
            }
            dices.sort().reverse();
            //displayDices(dices, container, css_class);
        }

        function displayDices(dices, container, css_class) {
            for (var i = 0; i < dices.length; i++) {
                $(container).append("<span class='dice " + css_class + "'>" + dices[i] + "</span>");
            }
        }

        function compareRolls() {
            if (defense_dices.length > attack_dices.length) {
                defense_dices.length = attack_dices.length;
            }

            for (var i = 0; i < defense_dices.length; i++) {
                if (attack_dices[i] <= defense_dices[i]) {
                    attackers.lost++;
                } else {
                    defenders.lost++;
                }
            }
        }

        console.log('---EMPIEZA EL JUEGO--- ' + attackers.total + ' vs. ' + defenders.total);

        var loop = 0;
        while (attackers.remaining > 0 && defenders.remaining > 0) {
            attackers.lost = 0;
            defenders.lost = 0;

            if (attackers.remaining < 3) {
                attack_dices.length = attackers.remaining;
            }

            if (defenders.remaining < 2) {
                defense_dices.length = defenders.remaining;
            }

            rollDices(attack_dices, '.attackers', 'attack');
            rollDices(defense_dices, '.defenders', '');
            compareRolls();

            attackers.remaining = attackers.remaining - attackers.lost;
            defenders.remaining = defenders.remaining - defenders.lost;

            attackers.total_lost = attackers.total - attackers.remaining;
            defenders.total_lost = defenders.total - defenders.remaining;

            console.log('### TIRADA NUM ' + loop);

            console.log(attack_dices);
            console.log(defense_dices);
            console.log('defenders lost: ' + defenders.lost);
            console.log('defenders remaining: ' + defenders.remaining);
            console.log('attackers lost: ' + attackers.lost);
            console.log('attackers  remaining: ' + attackers.remaining);

            loop++;
        }

        console.log('---RESULTADO FINAL DE---' + attackers.total + ' vs. ' + defenders.total);
        console.log('defenders lost: ' + attackers.total_lost);
        console.log('attackers lost: ' + defenders.total_lost);

        if (attackers.remaining > 0) {
            $('.result h1').html('<span class="glyphicon glyphicon-flag"></span> Attack');
            $attackers_result.parent().removeClass('btn-danger').addClass('btn-success');
            $defenders_result.parent().removeClass('btn-success').addClass('btn-danger');
        } else {
            $('.result h1').html('<span class="glyphicon glyphicon-tower"></span> Defense');
            $defenders_result.parent().removeClass('btn-danger').addClass('btn-success');
            $attackers_result.parent().removeClass('btn-success').addClass('btn-danger');
        }

        $attackers_result.html('-' + attackers.total_lost);
        $defenders_result.html('-' + defenders.total_lost);
    });

});

