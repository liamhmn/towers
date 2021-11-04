let game = {}

function getStartGame() {
    let start = {
        points: EN(0),
        pointsTotal: EN(0),
        loot: EN(0),
        lootTotal: EN(0),

        tipStage: 0,
        tipShown: true,
        level: null,
        levelBase: null,

        upgrades: {}
    }

    for (upg in upgrades) {
        start.upgrades[upg] = EN(0);
    }

    return start;
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (source[item] instanceof EN) target[item] = EN(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}

function load() {
    try {
        game = deepCopy(JSON.parse(atob(localStorage.getItem("tower"))), getStartGame());
        console.log(game);
        game.level = fixLevel(game.level);
        game.levelBase = fixLevel(game.levelBase);
    } catch (e) {
        console.log(e);
        game = getStartGame();
    }
}

function save() {
    localStorage.setItem("tower", btoa(JSON.stringify(game)));
}

function exportSave() {
    navigator.clipboard.writeText(btoa(JSON.stringify(game)));
}

function showResetPopup() {
    if (confirm("Do you want to reset the game? This can not be undone!")) {
        localStorage.removeItem("tower");
        location.reload();
    }
}
function showImportPopup() {
    let data = prompt("Please enter save string:");
    if (!data) return;
    try {
        let sGame = deepCopy(JSON.parse(atob(data)), getStartGame());
        let msg = "Do you want to import this save? This will override your current save!\n\n" +
            "Save Preview - This save has:\n" + format(sGame.points, 0) + " Fame";
        if (sGame.lootTotal.gt(0)) msg += "\n" + format(sGame.loot, 0) + " Loot";
        if (!confirm(msg)) return;
        localStorage.setItem("tower", btoa(JSON.stringify(sGame)));
        location.reload();
    } catch (e) {
        console.error(e);
    }
}