import axios from "axios";
// const axios = require("axios")

async function getWinnerTotoalGoals(competition, year) {
  const data = await axios.get(
    `https://jsonmock.hackerrank.com/api/football_competitions?name=${competition}&year=${year}`
  );
  const response = data.data;
  const winner = response.data[0].winner;

  const team1Score = await countGoals(competition, year, winner, "team1");
  const team2Score = await countGoals(competition, year, winner, "team2");

  return team1Score + team2Score;
}

async function countGoals(competition, year, winner, hostTeam) {
  const teamData = await axios.get(
    `https://jsonmock.hackerrank.com/api/football_matches?name=${competition}&year=${year}&${hostTeam}=${winner}`
  );
  const totalPageTeam = teamData.data.total_pages;
  const promises = [];
  for (let i = 1; i <= totalPageTeam; i++) {
    promises.push(
      axios.get(
        `https://jsonmock.hackerrank.com/api/football_matches?name=${competition}&year=${year}&${hostTeam}=${winner}&page=${i}`
      )
    );
  }
  const resolvedPromises = await Promise.all(promises);
  let res = 0;
  for (let i of resolvedPromises) {
    const current = i.data.data;
    const count = current.reduce((pre, cur) => {
      pre += parseInt(cur[hostTeam + "goals"]);
      return pre;
    }, 0);
    res += count;
  }
  return res;
}

getWinnerTotoalGoals("UEFA%20Champions%20League", 2011).then((res) =>
  console.log(res)
);
