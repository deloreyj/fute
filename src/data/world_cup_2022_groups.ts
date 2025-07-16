export const worldCup2022Groups: Record<string, string[]> = {
  "Group A": ["Qatar", "Ecuador", "Senegal", "Netherlands"],
  "Group B": ["England", "Iran", "United States", "Wales"],
  "Group C": ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
  "Group D": ["France", "Australia", "Denmark", "Tunisia"],
  "Group E": ["Spain", "Costa Rica", "Germany", "Japan"],
  "Group F": ["Belgium", "Canada", "Morocco", "Croatia"],
  "Group G": ["Brazil", "Serbia", "Switzerland", "Cameroon"],
  "Group H": ["Portugal", "Ghana", "Uruguay", "South Korea"],
};

export function getGroupOpponents(team: string): string[] | null {
  for (const teams of Object.values(worldCup2022Groups)) {
    if (teams.includes(team)) {
      return teams.filter((t) => t !== team);
    }
  }
  return null;
}
