function replaceAll(str, find, replace){
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function lowLevelFirst(a,b){
    if(a.lvl > b.lvl) return 1;
    if(a.lvl < b.lvl) return -1;
    return 0;
}

function setPokemonData(pokemon){
    var text = `#-------------------------------</br>[${pokemon.name.toUpperCase()}]</br>Name = ${pokemon.name}</br>Types = ${pokemon.primaryType.toUpperCase()}`;
    if(pokemon.secondaryType){
        text += `,${pokemon.secondaryType.toUpperCase()}`;
    }
    text += `</br>BaseStats = ${pokemon.stats.hp},${pokemon.stats.atk},${pokemon.stats.def},${pokemon.stats.spd},${pokemon.stats.spatk},${pokemon.stats.spdef}</br>`;
    if(pokemon.genderRatio){
        text += `GenderRatio = ${pokemon.genderRatio}</br>`;
    }else{
        text += `GenderRatio = Female50Percent</br>`;
    }
    if(pokemon.growthRate){
        text += `GrowthRate = ${pokemon.growthRate}</br>`;
    }else{
        text += `GrowthRate = Medium</br>`;
    }
    text += `EVs =</br>CatchRate = ${pokemon.catchRate}</br>Happiness = ${pokemon.baseFriendship}</br>BaseExp = ${pokemon.baseExp}</br>Abilities = ${replaceAll(pokemon.abilities.toUpperCase(), " ", "")}</br>Moves = `;

    pokemon.moves.sort(lowLevelFirst).forEach(move => {
        var moveName = replaceAll(replaceAll(move.name.toUpperCase(), " ", ""), "-", "");
        text += `${move.lvl},${moveName}`
        if(pokemon.moves[pokemon.moves.length -1] === move){
            text += "</br>";
        }else{
            text += ",";
        }
    });

    if(pokemon.tutorMoves){
        text += `TutorMoves = `
        pokemon.tutorMoves.forEach(tm => {
            var moveName = replaceAll(replaceAll(tm.toUpperCase(), " ", ""), "-", "");
            text += `${moveName}`
            if(pokemon.tutorMoves[pokemon.tutorMoves.length -1] === tm){
                text += "</br>";
            }else{
                text += ",";
            }
        });
    }

    if(pokemon.hiddenAbilities){
        text += `HiddenAbilities = ${replaceAll(pokemon.hiddenAbilities.toUpperCase(), " ", "")}</br>`;
    }

    text += `EggGroups = Undiscovered</br>HatchSteps = 100</br>Height = ${pokemon.height}</br>Weight = ${pokemon.weight} </br>Color = Green</br>Shape = Head</br>Evolutions = ${getEvolutionPBSDataString(pokemon)}</br>Category = ${pokemon.species}</br>Pokedex = ${pokemon.dexEntry} </br>#-------------------------------`;

   return text;
}

function getEvolutionPBSDataString(pokemon){
    if(pokemon.evolutions.length <= 1){
        return "";
    }

    var lastEvo = pokemon.evolutions[pokemon.evolutions.length - 1];
    if(lastEvo.name === pokemon.name || (lastEvo.alternateEvo && lastEvo.alternateEvo.name === pokemon.name)){
        return "";
    }

    var self = pokemon.evolutions.filter(f => f.name === pokemon.name)[0];
    var evosAfterSelf = pokemon.evolutions.filter(f => f.lvl > self.lvl || (f.lvl == -1 && f.lvl !== self.lvl));
    if(evosAfterSelf.length <= 0) return "";

    var str = `${getEvolutionPBSString(evosAfterSelf[0])}`;
    if(evosAfterSelf[0].alternateEvo){
        str = `${str},${getEvolutionPBSString(evosAfterSelf[0].alternateEvo)}`;
    }
    return str;
}

function getEvolutionPBSString(evo){
    return `${evo.name.toUpperCase()},${getEvolutionMethodPBSString(evo)},${getEvolutionParamPBSString(evo)}`;
}

function getEvolutionParamPBSString(evolution){
    switch(evolution.extraInfo){
        case "Leaf Stone":
            return "LEAFSTONE";
        default:
            return evolution.lvl;
    }
}

function getEvolutionMethodPBSString(evolution){
    switch(evolution.extraInfo){
        case "Female only":
            return "LevelFemale";
        case "Leaf Stone":
            return "Item";
        default:
            return "Level";
    }
}