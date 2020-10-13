const dummyTeam = {
    league_id: null,
    captain_name: '',
    contact_number: '',
    contact_email: '',
    players: []
}

const match = (numTeams, teams) => { 
    const matches = [];                  
    if (!teams) {
      teams = [];
      for (let i = 1; i <= numTeams; i += 1) {
          teams.push(i);
      }
    } else {
      teams = teams.slice();
    }
  
    if (numTeams % 2 === 1) { //if odd
      teams.push(dummyTeam); // add a dummy to make teams even
      numTeams += 1;
    }
    for (let j = 0; j < numTeams - 1; j += 1) {
      matches[j] = []; // create inner match array for round j
      for (let i = 0; i < numTeams / 2; i += 1) {
        if (teams[i] !== -1 && teams[numTeams - 1 - i] !== -1) {
          matches[j].push([teams[i], teams[numTeams - 1 - i]]); // insert pair as a match
        }
      }
      teams.splice(1, 0, teams.pop()); // permutate for next round
    }
    return matches;
  };

module.exports = {
    match
}