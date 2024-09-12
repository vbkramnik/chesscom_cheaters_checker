let storedLanguage = 'ru';

const i18n = {
    'ru': {
        'title': 'контора пидорасов',
        'instruction': 'Введи ник в поле ниже и нажми кнопку "проверить".',
        'username': 'Ник игрока на chess.com',
        'check': 'Проверить',
        'question_1': 'Как это работает?',
        'answer_1': 'Мы с моей командой математиков и парикмахеров долго разрабатывали эту статистическую модель, она основана на множестве факторов, нет никаких оснований ей не доверять. Сейчас подсчет ведется только для титулованных игроков, но в будущем обязательно распространим на всех, раз chess.com не хочет шевелиться.',
        'question_2': 'Результаты точны?',
        'answer_2': 'Не спрашивайте глупости, точнее вы не найдете нигде. Не забывайте, что я целый год собирал статистику, лучше меня и моей команды в этой теме не разбирается никто. Выводы делайте сами, но здравомыслящим людям все очевидно.',
        'question_3': 'Как убедиться в правильности проверки?',
        'answer_3': 'Снова глупости спрашиваете, введите ник любого игрока и сами все увидите, не скрою, некоторые результаты меня тоже шокировали, но потом начал разбираться и понял, что модель не может ошибаться. Если вам кажется, что наша модель ошибается, значит у вас не очень много мозгов :) Здравомыслящим людям все понятно и так, можете сами взять статистику и проверить, я все много раз объяснял у себя на канале, в сотый раз повторяться не хочу.',
        'question_4': 'Готовы ли вы подтвердить ваши обвинения под присягой?',
        'answer_4': 'Никого не обвиняю.',
        'question_5': 'И напоследок анекдот',
        'answer_5': 'Сидят вороны на дереве и смотрят вниз, как мужик машину чистит.<br><br> — Ты только глянь — он трет наши комменты!',
        'fair_player': 'Кристально честный игрок, вне всяких подозрений, побольше бы таких, но к сожалению таких очень мало.',
        'suspicious_player': 'Наверняка сказать сложно, но я думаю, что хотя бы разок он точно читернул, на пустом месте вероятность бы не показало.',
        'very_suspicious_player': 'Здравомыслящим людям все понятно, я лично такому "игроку" руки не подам, почти уверен, что пока мы тут занимаемся проверками, он сидит и прямо сейчас читерит.',
        'cheater_player': 'Очевидный читер, сомнений просто ноль, черную метку такому и не пускать в приличное общество без намордника.',
        'cheating_probability': 'вероятность читерства',
    },
    'en': {
        'title': 'office of scoundrels',
        'instruction': 'Enter a nickname in the field below and click the "check" button.',
        'username': 'Player nickname on chess.com',
        'check': 'Check',
        'question_1': 'How does it work?',
        'answer_1': 'My team of mathematicians and hairdressers spent a long time developing this statistical model. It’s based on many factors, and there’s no reason not to trust it. Currently, calculations are only done for titled players, but in the future, we will definitely expand it to everyone, since chess.com doesn’t seem to want to act.',
        'question_2': 'Are the results accurate?',
        'answer_2': 'Don’t ask silly questions, you won’t find anything more accurate anywhere. Don’t forget that I collected statistics for a whole year, and no one knows more about this topic than me and my team. Draw your own conclusions, but it’s obvious to any reasonable person.',
        'question_3': 'How can you be sure the check is correct?',
        'answer_3': 'Again, silly questions. Enter any player’s nickname and you’ll see for yourself. I won’t lie, some results shocked me too, but after digging deeper, I realized the model can’t be wrong. If you think our model is wrong, maybe you’re not very smart :) Reasonable people understand everything as it is. You can check the stats yourself, I’ve explained it many times on my channel, and I’m not repeating it for the hundredth time.',
        'question_4': 'Are you willing to confirm your accusations under oath?',
        'answer_4': 'I’m not accusing anyone.',
        'question_5': 'And finally, a joke',
        'answer_5': 'Two crows are sitting in a tree, watching a guy clean his car.<br><br> — Look at that — he’s wiping off our comments!',
        'fair_player': 'A crystal-clear player, beyond any suspicion. We need more players like this, but unfortunately, there are very few.',
        'suspicious_player': 'It’s hard to say for sure, but I think he’s probably cheated at least once. The probability wouldn’t show up for nothing.',
        'very_suspicious_player': 'It’s obvious to any reasonable person. Personally, I wouldn’t shake hands with such a "player." I’m almost certain he’s cheating as we speak, while we’re checking.',
        'cheater_player': 'An obvious cheater. Zero doubt about it. This person deserves a black mark and should not be allowed in decent society without a muzzle.',
        'cheating_probability': 'cheating probability'
    }
}

initI18n();

const fetchPlayerTitles = () => {
    let players = {};

    const fetchPromises = ['GM', 'WGM', 'IM', 'WIM', 'FM', 'WFM', 'NM', 'WNM', 'CM', 'WCM'].map((title) => {
        return fetch('https://api.chess.com/pub/titled/' + title)
            .then(response => response.json())
            .then(data => {
                for (const username of data.players) {
                    players[username] = title;
                }
            });
    });

    return Promise.all(fetchPromises).then(() => players);
};

fetchPlayerTitles().then(players => {
    $('#username').autocomplete({
        source: function(request, response) {
            const matches = Object.keys(players).filter(item => item.toLowerCase().startsWith(request.term.toLowerCase()));
            const limitedMatches = matches.slice(0, 5); // Показываем только первые 5 элементов
            response(limitedMatches);
        },
        minLength: 3
    });

    const language = getLanguage();

    $('#check').click(() => {
        const username = $('#username').val().toLowerCase();

        if (username in players) {
            const resultElement = $('#result');
            const cheatingProbability = getCheatingProbability(username);
            let backgroundClass = '';
            let summaryText = '';
            resultElement.empty();

            if (cheatingProbability <= 0) {
                backgroundClass = 'bg-success';
                summaryText = i18n[language]['fair_player'];
            } else if (cheatingProbability > 0 && cheatingProbability < 50) {
                backgroundClass = 'bg-warning';
                summaryText = i18n[language]['suspicious_player'];
            } else if (cheatingProbability > 50 && cheatingProbability < 100) {
                backgroundClass = 'bg-danger';
                summaryText = i18n[language]['very_suspicious_player'];
            } else {
                backgroundClass = 'bg-danger';
                summaryText = i18n[language]['cheater_player'];
            }

            summaryText = `${username}: ${cheatingProbability}% ${i18n[language]['cheating_probability']}. ${summaryText}`;

            resultElement.addClass(backgroundClass);
            resultElement.text(summaryText);
        }
    });

    $('#language_switch').click(() => {
        let src = $('#language').attr('src');

        if (src === 'images/en.png') {
            $('#language').attr({'src': 'images/ru.png'})
            storedLanguage = 'en';
        } else {
            $('#language').attr({'src': 'images/en.png'});
            storedLanguage = 'ru';
        }

        initI18n();

        return false;
    })
});

function getCheatingProbability(username) {
    const knownPlayers = {
        '1181089710010510910511410711497109110105107': 0,
        '98971171099711095103117121': 0,
        '109971161161041011191034511252112': 100,
    }

    let result = 0;
    let divider = 3.14;
    let multiplier = 1;
    let playerCharCodes = [];

    for (const char of username) {
        let charCode = char.charCodeAt(0);
        multiplier++;
        result += charCode / (divider * multiplier);
        playerCharCodes.push(charCode);
    }

    let playerCode = playerCharCodes.join('');

    if (playerCode in knownPlayers) {
        result = knownPlayers[playerCode];
    }

    return result.toFixed(2);
}

function initI18n() {
    const language = getLanguage();

    $('#title').text(i18n[language]['title']);
    $('#instruction').text(i18n[language]['instruction']);
    $('#username').attr({
        'placeholder': i18n[language]['username'],
        'aria-label': i18n[language]['username'],
    });
    $('#check').text(i18n[language]['check']);

    $('#question_1').text(i18n[language]['question_1']);
    $('#answer_1').text(i18n[language]['answer_1']);

    $('#question_2').text(i18n[language]['question_2']);
    $('#answer_2').text(i18n[language]['answer_2']);

    $('#question_3').text(i18n[language]['question_3']);
    $('#answer_3').text(i18n[language]['answer_3']);

    $('#question_4').text(i18n[language]['question_4']);
    $('#answer_4').text(i18n[language]['answer_4']);

    $('#question_5').text(i18n[language]['question_5']);
    $('#answer_5').html(i18n[language]['answer_5']);
    $('#language').attr('src', language === 'ru' ? 'images/en.png' : 'images/ru.png');
}

function getLanguage() {
    return storedLanguage;
}



