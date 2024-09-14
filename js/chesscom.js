let averageCharCodesSum = 0;
const minPercent = 1;
const maxPercent = 100;
let players = {};
const modifiers = {
    'GM': 1,
    'WGM': 1,
    'IM': 1.1,
    'WIM': 1.1,
    'FM': 1.2,
    'WFM': 1.2,
    'NM': 1.3,
    'WNM': 1.3,
    'CM': 1.4,
    'WCM': 1.4,
}

const knownPlayers = {
    'bauman_guy': 0,
    'vladimirkramnik': 0,
    'matthewg-p4p': 100,
    'rud_makarian': 100,
    'tigrvshlyape': 100,
}

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
        'probability_0': 'Кристально честный игрок, вне всяких подозрений, побольше бы таких, но к сожалению таких очень мало.',
        'probability_10': 'Вероятность небольшая, но все-таки есть, нужно дополнительно проверять, но пока что выглядит не очень подозрительно, но проверять нужно всех',
        'probability_30': 'Наверняка сказать сложно, но я думаю, что хотя бы разок он точно читернул, на пустом месте такую вероятность бы не показало.',
        'probability_50': 'Судите сами, но мне кажется, что тут примерно 50 на 50, либо читерил, либо не читерил',
        'probability_80': 'Здравомыслящим людям все понятно, я лично такому "игроку" руки не подам, почти уверен, что пока мы тут занимаемся проверками, он сидит и прямо сейчас читерит.',
        'probability_99': 'Даже не знаю, что тут добавить, вы все видите сами, почти наверняка читерит на регулярной основе',
        'probability_100': 'Очевидный читер, сомнений просто ноль, черную метку такому и не пускать в приличное общество без намордника.',
        'cheating_probability': 'вероятность читерства',
        'custom_messages': {
            'vladimirkramnik': 'Ребята, не стоит вскрывать эту тему. Вы молодые, шутливые, вам все легко. Это не то. Это не Чикатило и даже не архивы спецслужб. Сюда лучше не лезть. Серьезно, любой из вас будет жалеть. Лучше закройте тему и забудьте, что тут писалось. Я вполне понимаю, что данным сообщением вызову дополнительный интерес, но хочу сразу предостеречь пытливых – стоп. Остальных просто не найдут.',
            'bauman_guy': 'Друзья, знакомьтесь, это Костик Мостик, за него я ручаюсь, как за самого себя, играет точно честно',
            'tigrvshlyape': 'Легенда борьбы с нечестной игрой, ТИГР В ШЛЯПЕ, настоящий хищник, охотник, и не смотрите на его проценты, он просто играет с одними читерами и иногда выигрывает, поэтому получается так много.',
            'rud_makarian': 'Это Рудик Макарон, про него здравомыслящим людям давно все понятно, вопросов к нему у меня нет',
            'matthewg-p4p': 'О, да это же тот самый мурманский самородок, который в онлайне уверенно идет к турниру претендентов, а на опене недавно набрал перформанс 2000 в партиях с очень сильными второразрядниками :))',
            'zhigalko_sergei': 'Известный подглядывающий, очень подозрительный игрок, не стесняется даже своего друга и модератора Серегу Ворон Чесса и Михаила из города Химки, кстати, самого Сергея в Химках недавно видел: деревянными членами торгует. В вашу честь!',
            'shimastream': 'Печальное на самом деле зрелище, тоска стримера, даже комментировать нет смысла, этот точно играет сам, хотя проценты и вызывают некоторые опасения'
        }
    },
    'en': {
        'title': 'office of scoundrels ',
        'instruction': 'Enter the username in the field below and click the "check" button.',
        'username': 'Player’s username on chess.com',
        'check': 'Check',
        'question_1': 'How does it work?',
        'answer_1': 'My team of mathematicians and barbers spent a long time developing this statistical model. It’s based on a multitude of factors, and there’s no reason not to trust it. Currently, it’s only calculating for titled players, but we’ll definitely expand it to everyone in the future, since chess.com doesn’t seem to want to do anything.',
        'question_2': 'Are the results accurate?',
        'answer_2': 'Don’t ask silly questions, you won’t find anything more accurate anywhere else. Keep in mind, I spent a whole year gathering statistics. No one knows more about this topic than my team and me. Draw your own conclusions, but it’s obvious to any reasonable person.',
        'question_3': 'How can I verify the check’s accuracy?',
        'answer_3': 'Another silly question. Enter any player’s username, and you’ll see for yourself. I won’t lie, some results shocked me too, but then I looked deeper and realized the model couldn’t be wrong. If you think our model is mistaken, it probably means you’re not very bright :) Any reasonable person would understand. You can grab the stats yourself and check it; I’ve explained this many times on my channel. I won’t repeat it for the hundredth time.',
        'question_4': 'Are you ready to confirm your accusations under oath?',
        'answer_4': 'I’m not accusing anyone.',
        'question_5': 'And lastly, a joke',
        'answer_5': 'Two crows are sitting in a tree, watching a guy clean his car.<br><br> — Look at that, he’s wiping off our comments!',
        'probability_0': 'A crystal-clear honest player, beyond suspicion. We need more like them, but unfortunately, there aren’t many.',
        'probability_10': 'There’s a small chance, but it’s still there. Needs additional checking, but for now, it doesn’t look very suspicious. However, everyone needs to be checked.',
        'probability_30': 'It’s hard to say for sure, but I think he’s cheated at least once. This kind of probability wouldn’t show up for no reason.',
        'probability_50': 'Judge for yourself, but to me, it looks about 50/50 — either he cheated, or he didn’t.',
        'probability_80': 'Any reasonable person can see it clearly. Personally, I wouldn’t shake hands with such a "player." I’m almost sure that while we’re checking, he’s cheating right now.',
        'probability_99': 'I don’t even know what to add here. You can see it all yourself. He’s almost certainly cheating on a regular basis.',
        'probability_100': 'An obvious cheater, no doubt whatsoever. Give him a black mark and don’t let him into decent society without a muzzle.',
        'cheating_probability': 'cheating probability',
        'custom_messages': {
            'vladimirkramnik': 'Guys, don’t dig into this. You’re young, playful, everything seems easy for you. But this is not it. This isn’t Chikatilo or even intelligence agency archives. Better stay away. Seriously, any one of you will regret it. Close this topic and forget about it. I know that by writing this, I’ll spark more interest, but I want to warn the curious — stop. The rest just won’t be found.',
            'bauman_guy': 'Friends, meet Kostik Mostik, I vouch for him like I would for myself, he plays completely honestly.',
            'tigrvshlyape': 'A legend in the fight against unfair play, TIGER IN A HAT, a true predator, a hunter. Don’t pay attention to his percentages, he just plays against cheaters all the time and occasionally wins, which is why the numbers are so high',
            'rud_makarian': 'This is Rudik Macaroni, any reasonable person has already figured him out long ago. I have no questions for him.',
            'matthewg-p4p': 'Oh, this is the Murmansk prodigy who’s confidently heading for the Candidates Tournament online, and recently scored a 2000 performance in an open tournament against some very strong second-category players :))',
            'zhigalko_sergei': 'A well-known peeker, very suspicious player, not even embarrassed in front of his friend and moderator Sergey Voron Chess and Mikhail from Khimki. By the way, I saw him in Khimki recently — selling wooden dicks. Just for you!',
            'shimastream': 'A truly sad sight, the streamer’s despair, there’s no point in even commenting. This one is definitely playing on his own, although the percentages do raise some concerns.',
        }
    }
}

initI18n();

const fetchPlayerTitles = () => {
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
    averageCharCodesSum = getAverageCharCodesSum();

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
                summaryText = i18n[getLanguage()]['fair_player'];
            } else if (cheatingProbability > 0 && cheatingProbability <= 10) {
                backgroundClass = 'bg-warning';
                summaryText = i18n[getLanguage()]['probability_10'];
            } else if (cheatingProbability > 10 && cheatingProbability <= 30) {
                backgroundClass = 'bg-warning';
                summaryText = i18n[getLanguage()]['probability_30'];
            } else if (cheatingProbability > 30 && cheatingProbability <= 50) {
                backgroundClass = 'bg-warning';
                summaryText = i18n[getLanguage()]['probability_50'];
            } else if (cheatingProbability > 50 && cheatingProbability <= 80) {
                backgroundClass = 'bg-danger';
                summaryText = i18n[getLanguage()]['probability_80'];
            } else if (cheatingProbability > 80 && cheatingProbability < 99) {
                backgroundClass = 'bg-danger';
                summaryText = i18n[getLanguage()]['probability_99'];
            } else {
                backgroundClass = 'bg-danger';
                summaryText = i18n[getLanguage()]['cheater_player'];
            }

            if (username in i18n[getLanguage()]['custom_messages']) {
                console.log(language);
                summaryText = i18n[getLanguage()]['custom_messages'][username];
                console.log(i18n[getLanguage()]['custom_messages'][username])
            }

            summaryText = `${username}: ${cheatingProbability}% ${i18n[getLanguage()]['cheating_probability']}. ${summaryText}`;

            resultElement.addClass(backgroundClass);
            resultElement.text(summaryText);
        }
    });

    $('#language_switch').click(() => {
        let src = $('#language').attr('src');

        if (src === 'images/en.png') {
            $('#language').attr({'src': 'images/ru.png'})
            setLanguage('en');
        } else {
            $('#language').attr({'src': 'images/en.png'});
            setLanguage('ru');
        }

        initI18n();

        return false;
    })
});

function getCheatingProbability(username) {
    if (username in knownPlayers) {
        return knownPlayers[username];
    }

    const playerCharCodesSum = getPlayerCharCodesSum(username);
    const playerDiffToAverage = getPlayerDiffToAverage(playerCharCodesSum);
    let result = (playerDiffToAverage / averageCharCodesSum * 100).toFixed();
    result *= modifiers[players[username]];

    return Math.max(Math.min(result, maxPercent), minPercent);
}

function getAverageCharCodesSum() {
    let charCodesSum = 0;

    for (const username of Object.keys(players)) {
        charCodesSum += getPlayerCharCodesSum(username);
    }

    return (charCodesSum / Object.keys(players).length).toFixed();
}

function getPlayerCharCodesSum(username) {
    let result = 0;

    for (const char of username) {
        result += char.charCodeAt(0);
    }

    return result;
}

function getPlayerDiffToAverage(playerCharCodesSum) {
    let result = (averageCharCodesSum - playerCharCodesSum).toFixed(2);

    return result < 0 ? result * -1 : result;
}

function initI18n() {
    $('#title').text(i18n[getLanguage()]['title']);
    $('#instruction').text(i18n[getLanguage()]['instruction']);
    $('#username').attr({
        'placeholder': i18n[getLanguage()]['username'],
        'aria-label': i18n[getLanguage()]['username'],
    });
    $('#check').text(i18n[getLanguage()]['check']);

    $('#question_1').text(i18n[getLanguage()]['question_1']);
    $('#answer_1').text(i18n[getLanguage()]['answer_1']);

    $('#question_2').text(i18n[getLanguage()]['question_2']);
    $('#answer_2').text(i18n[getLanguage()]['answer_2']);

    $('#question_3').text(i18n[getLanguage()]['question_3']);
    $('#answer_3').text(i18n[getLanguage()]['answer_3']);

    $('#question_4').text(i18n[getLanguage()]['question_4']);
    $('#answer_4').text(i18n[getLanguage()]['answer_4']);

    $('#question_5').text(i18n[getLanguage()]['question_5']);
    $('#answer_5').html(i18n[getLanguage()]['answer_5']);
    $('#language').attr('src', getLanguage() === 'ru' ? 'images/en.png' : 'images/ru.png');
}

function getLanguage() {
    const fallbackLanguage = 'ru';
    let result = localStorage.getItem('language');

    if (result === null) {
        result = fallbackLanguage;
        localStorage.setItem('language', result);
    }

    return result;
}

function setLanguage(language) {
    localStorage.setItem('language', language);
}



