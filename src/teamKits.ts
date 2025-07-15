export enum TeamType {
  SPORTING = "sporting",
  BENFICA = "benfica",
}

export interface KitColors {
  shirtColors: number[];
  shortsColor: number;
  sockPrimaryColor: number;
  sockSecondaryColor: number;
}

export interface TeamKit {
  field: KitColors;
  goalkeeper: KitColors;
}

export const TEAM_KITS: Record<TeamType, TeamKit> = {
  [TeamType.SPORTING]: {
    field: {
      shirtColors: [0x007a33, 0xffffff],
      shortsColor: 0x000000,
      sockPrimaryColor: 0x007a33,
      sockSecondaryColor: 0xffffff,
    },
    goalkeeper: {
      shirtColors: [0xffcc00],
      shortsColor: 0xffcc00,
      sockPrimaryColor: 0xffcc00,
      sockSecondaryColor: 0x000000,
    },
  },
  [TeamType.BENFICA]: {
    field: {
      shirtColors: [0xd40000],
      shortsColor: 0xffffff,
      sockPrimaryColor: 0xd40000,
      sockSecondaryColor: 0xffffff,
    },
    goalkeeper: {
      shirtColors: [0x0066ff],
      shortsColor: 0x0066ff,
      sockPrimaryColor: 0x0066ff,
      sockSecondaryColor: 0xffffff,
    },
  },
};
