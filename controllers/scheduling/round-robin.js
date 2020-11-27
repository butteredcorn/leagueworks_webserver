const dummyTeam = {
    _id: "",
    league_id: null,
    team_name: '',
    phone_number: '',
    email: '',
    captain_id: "",
    players: [],
    timeStamp: ""
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
        if (JSON.stringify(teams[i]) !== JSON.stringify(dummyTeam) && JSON.stringify(teams[numTeams - 1 - i]) !== JSON.stringify(dummyTeam)) {
          matches[j].push([teams[i], teams[numTeams - 1 - i]]); // insert pair as a match
        }
      }
      teams.splice(1, 0, teams.pop()); // permutate for next round
    }
    return matches;
  };

  const formattedMatch = (numTeams, teams) => { 
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
        if (JSON.stringify(teams[i]) !== JSON.stringify(dummyTeam) && JSON.stringify(teams[numTeams - 1 - i]) !== JSON.stringify(dummyTeam)) {
          const home_team = Math.random() < 0.5;  //randomize homefield advantage
          const teamOne = {team_id: teams[i]._id, team_name: teams[i].team_name, home_team: home_team, players: teams[i].players}
          const teamTwo = {team_id: teams[numTeams - 1 - i]._id, team_name: teams[numTeams - 1 - i].team_name, home_team: !home_team, players: teams[numTeams - 1 - i].players}
          matches[j].push([teamOne, teamTwo]); // insert pair as a match
        }
      }
      teams.splice(1, 0, teams.pop()); // permutate for next round
    }
    return matches;
  };

module.exports = {
    match,
    formattedMatch
}