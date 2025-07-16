import { worldCup2022Kits } from "./world_cup_2022_kits";
export interface FieldKit {
  shirtColors: number[];
  shortsColor: number;
  sockPrimaryColor: number;
  sockSecondaryColor: number;
}

export interface TeamKit {
  field: FieldKit;
  goalkeeper: FieldKit;
}

const baseTeamKits: Record<string, TeamKit> = {
  "Cercle Brugge": {
    "field": {
      "shirtColors": [
        3754772
      ],
      "shortsColor": 3030032,
      "sockPrimaryColor": 3754772,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4479512
      ],
      "shortsColor": 4479512,
      "sockPrimaryColor": 4479512,
      "sockSecondaryColor": 0
    }
  },
  "Club Brugge KV": {
    "field": {
      "shirtColors": [
        16670561
      ],
      "shortsColor": 13323342,
      "sockPrimaryColor": 16670561,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16740980
      ],
      "shortsColor": 16740980,
      "sockPrimaryColor": 16740980,
      "sockSecondaryColor": 0
    }
  },
  "FCV Dender EH": {
    "field": {
      "shirtColors": [
        11410712
      ],
      "shortsColor": 9115411,
      "sockPrimaryColor": 11410712,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13706013
      ],
      "shortsColor": 13706013,
      "sockPrimaryColor": 13706013,
      "sockSecondaryColor": 0
    }
  },
  "K Beerschot VA": {
    "field": {
      "shirtColors": [
        13540275
      ],
      "shortsColor": 10845327,
      "sockPrimaryColor": 13540275,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16235223
      ],
      "shortsColor": 16235223,
      "sockPrimaryColor": 16235223,
      "sockSecondaryColor": 0
    }
  },
  "KAA Gent": {
    "field": {
      "shirtColors": [
        3993753
      ],
      "shortsColor": 3195002,
      "sockPrimaryColor": 3993753,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4784056
      ],
      "shortsColor": 4784056,
      "sockPrimaryColor": 4784056,
      "sockSecondaryColor": 0
    }
  },
  "KRC Genk": {
    "field": {
      "shirtColors": [
        15765791
      ],
      "shortsColor": 12612633,
      "sockPrimaryColor": 15765791,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16756261
      ],
      "shortsColor": 16756261,
      "sockPrimaryColor": 16756261,
      "sockSecondaryColor": 0
    }
  },
  "KV Kortrijk": {
    "field": {
      "shirtColors": [
        2530451
      ],
      "shortsColor": 1998198,
      "sockPrimaryColor": 2530451,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3062704
      ],
      "shortsColor": 3062704,
      "sockPrimaryColor": 3062704,
      "sockSecondaryColor": 0
    }
  },
  "KV Mechelen": {
    "field": {
      "shirtColors": [
        10681410
      ],
      "shortsColor": 8571445,
      "sockPrimaryColor": 10681410,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12779343
      ],
      "shortsColor": 12779343,
      "sockPrimaryColor": 12779343,
      "sockSecondaryColor": 0
    }
  },
  "KVC Westerlo": {
    "field": {
      "shirtColors": [
        13710375
      ],
      "shortsColor": 10955295,
      "sockPrimaryColor": 13710375,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16465455
      ],
      "shortsColor": 16465455,
      "sockPrimaryColor": 16465455,
      "sockSecondaryColor": 0
    }
  },
  "Oud-Heverlee Leuven": {
    "field": {
      "shirtColors": [
        14200302
      ],
      "shortsColor": 11373246,
      "sockPrimaryColor": 14200302,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16765183
      ],
      "shortsColor": 16765183,
      "sockPrimaryColor": 16765183,
      "sockSecondaryColor": 0
    }
  },
  "RSC Anderlecht": {
    "field": {
      "shirtColors": [
        1863472
      ],
      "shortsColor": 1464614,
      "sockPrimaryColor": 1863472,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2262330
      ],
      "shortsColor": 2262330,
      "sockPrimaryColor": 2262330,
      "sockSecondaryColor": 0
    }
  },
  "Royal Antwerp FC": {
    "field": {
      "shirtColors": [
        13412099
      ],
      "shortsColor": 10716674,
      "sockPrimaryColor": 13412099,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16107524
      ],
      "shortsColor": 16107524,
      "sockPrimaryColor": 16107524,
      "sockSecondaryColor": 0
    }
  },
  "Sint-Truidense VV": {
    "field": {
      "shirtColors": [
        8204932
      ],
      "shortsColor": 6563946,
      "sockPrimaryColor": 8204932,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9845918
      ],
      "shortsColor": 9845918,
      "sockPrimaryColor": 9845918,
      "sockSecondaryColor": 0
    }
  },
  "Sporting Charleroi": {
    "field": {
      "shirtColors": [
        10476139
      ],
      "shortsColor": 8367702,
      "sockPrimaryColor": 10476139,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12582784
      ],
      "shortsColor": 12582784,
      "sockPrimaryColor": 12582784,
      "sockSecondaryColor": 0
    }
  },
  "Standard Liège": {
    "field": {
      "shirtColors": [
        11298310
      ],
      "shortsColor": 9064965,
      "sockPrimaryColor": 11298310,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13531655
      ],
      "shortsColor": 13531655,
      "sockPrimaryColor": 13531655,
      "sockSecondaryColor": 0
    }
  },
  "Union Saint-Gilloise": {
    "field": {
      "shirtColors": [
        14362059
      ],
      "shortsColor": 11476642,
      "sockPrimaryColor": 14362059,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16723188
      ],
      "shortsColor": 16723188,
      "sockPrimaryColor": 16723188,
      "sockSecondaryColor": 0
    }
  },
  "] as string[": {
    "field": {
      "shirtColors": [
        11363359
      ],
      "shortsColor": 9064473,
      "sockPrimaryColor": 11363359,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13662245
      ],
      "shortsColor": 13662245,
      "sockPrimaryColor": 13662245,
      "sockSecondaryColor": 0
    }
  },
  "Athletico Paranaense": {
    "field": {
      "shirtColors": [
        1153119
      ],
      "shortsColor": 948812,
      "sockPrimaryColor": 1153119,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1357426
      ],
      "shortsColor": 1357426,
      "sockPrimaryColor": 1357426,
      "sockSecondaryColor": 0
    }
  },
  "Atlético Goianiense": {
    "field": {
      "shirtColors": [
        12906853
      ],
      "shortsColor": 10338641,
      "sockPrimaryColor": 12906853,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15466361
      ],
      "shortsColor": 15466361,
      "sockPrimaryColor": 15466361,
      "sockSecondaryColor": 0
    }
  },
  "Atlético Mineiro": {
    "field": {
      "shirtColors": [
        7764260
      ],
      "shortsColor": 6185245,
      "sockPrimaryColor": 7764260,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9343275
      ],
      "shortsColor": 9343275,
      "sockPrimaryColor": 9343275,
      "sockSecondaryColor": 0
    }
  },
  "Bahia BA": {
    "field": {
      "shirtColors": [
        11944446
      ],
      "shortsColor": 9581771,
      "sockPrimaryColor": 11944446,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14307071
      ],
      "shortsColor": 14307071,
      "sockPrimaryColor": 14307071,
      "sockSecondaryColor": 0
    }
  },
  "Botafogo RJ": {
    "field": {
      "shirtColors": [
        2516077
      ],
      "shortsColor": 1986647,
      "sockPrimaryColor": 2516077,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3045507
      ],
      "shortsColor": 3045507,
      "sockPrimaryColor": 3045507,
      "sockSecondaryColor": 0
    }
  },
  "Ceará CE": {
    "field": {
      "shirtColors": [
        16216756
      ],
      "shortsColor": 12999568,
      "sockPrimaryColor": 16216756,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16746968
      ],
      "shortsColor": 16746968,
      "sockPrimaryColor": 16746968,
      "sockSecondaryColor": 0
    }
  },
  "Corinthians SP": {
    "field": {
      "shirtColors": [
        455393
      ],
      "shortsColor": 377524,
      "sockPrimaryColor": 455393,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        524287
      ],
      "shortsColor": 524287,
      "sockPrimaryColor": 524287,
      "sockSecondaryColor": 0
    }
  },
  "Coritiba PR": {
    "field": {
      "shirtColors": [
        10024715
      ],
      "shortsColor": 8046089,
      "sockPrimaryColor": 10024715,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11992845
      ],
      "shortsColor": 11992845,
      "sockPrimaryColor": 11992845,
      "sockSecondaryColor": 0
    }
  },
  "Flamengo RJ": {
    "field": {
      "shirtColors": [
        12297621
      ],
      "shortsColor": 9864311,
      "sockPrimaryColor": 12297621,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14730931
      ],
      "shortsColor": 14730931,
      "sockPrimaryColor": 14730931,
      "sockSecondaryColor": 0
    }
  },
  "Fluminense RJ": {
    "field": {
      "shirtColors": [
        7382714
      ],
      "shortsColor": 5932437,
      "sockPrimaryColor": 7382714,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8832991
      ],
      "shortsColor": 8832991,
      "sockPrimaryColor": 8832991,
      "sockSecondaryColor": 0
    }
  },
  "Fortaleza CE": {
    "field": {
      "shirtColors": [
        2336908
      ],
      "shortsColor": 1869424,
      "sockPrimaryColor": 2336908,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2804392
      ],
      "shortsColor": 2804392,
      "sockPrimaryColor": 2804392,
      "sockSecondaryColor": 0
    }
  },
  "Goiás GO": {
    "field": {
      "shirtColors": [
        748629
      ],
      "shortsColor": 611908,
      "sockPrimaryColor": 748629,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        885350
      ],
      "shortsColor": 885350,
      "sockPrimaryColor": 885350,
      "sockSecondaryColor": 0
    }
  },
  "Grêmio Porto Alegre": {
    "field": {
      "shirtColors": [
        16523646
      ],
      "shortsColor": 13245029,
      "sockPrimaryColor": 16523646,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16722071
      ],
      "shortsColor": 16722071,
      "sockPrimaryColor": 16722071,
      "sockSecondaryColor": 0
    }
  },
  "Internacional": {
    "field": {
      "shirtColors": [
        11484127
      ],
      "shortsColor": 9187250,
      "sockPrimaryColor": 11484127,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13780991
      ],
      "shortsColor": 13780991,
      "sockPrimaryColor": 13780991,
      "sockSecondaryColor": 0
    }
  },
  "Palmeiras": {
    "field": {
      "shirtColors": [
        9872622
      ],
      "shortsColor": 7898046,
      "sockPrimaryColor": 9872622,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11847167
      ],
      "shortsColor": 11847167,
      "sockPrimaryColor": 11847167,
      "sockSecondaryColor": 0
    }
  },
  "Red Bull Bragantino": {
    "field": {
      "shirtColors": [
        10244119
      ],
      "shortsColor": 8208402,
      "sockPrimaryColor": 10244119,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12279836
      ],
      "shortsColor": 12279836,
      "sockPrimaryColor": 12279836,
      "sockSecondaryColor": 0
    }
  },
  "Santos FC": {
    "field": {
      "shirtColors": [
        11703365
      ],
      "shortsColor": 9336375,
      "sockPrimaryColor": 11703365,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14070355
      ],
      "shortsColor": 14070355,
      "sockPrimaryColor": 14070355,
      "sockSecondaryColor": 0
    }
  },
  "Sport Recife PE": {
    "field": {
      "shirtColors": [
        11145425
      ],
      "shortsColor": 8916391,
      "sockPrimaryColor": 11145425,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13374459
      ],
      "shortsColor": 13374459,
      "sockPrimaryColor": 13374459,
      "sockSecondaryColor": 0
    }
  },
  "São Paulo FC": {
    "field": {
      "shirtColors": [
        3106295
      ],
      "shortsColor": 2511302,
      "sockPrimaryColor": 3106295,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3701247
      ],
      "shortsColor": 3701247,
      "sockPrimaryColor": 3701247,
      "sockSecondaryColor": 0
    }
  },
  "Vasco da Gama RJ": {
    "field": {
      "shirtColors": [
        6220051
      ],
      "shortsColor": 4962831,
      "sockPrimaryColor": 6220051,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7470871
      ],
      "shortsColor": 7470871,
      "sockPrimaryColor": 7470871,
      "sockSecondaryColor": 0
    }
  },
  "1. FC Heidenheim 1846": {
    "field": {
      "shirtColors": [
        4890055
      ],
      "shortsColor": 3899039,
      "sockPrimaryColor": 4890055,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5881071
      ],
      "shortsColor": 5881071,
      "sockPrimaryColor": 5881071,
      "sockSecondaryColor": 0
    }
  },
  "1. FC Köln": {
    "field": {
      "shirtColors": [
        11651917
      ],
      "shortsColor": 9347646,
      "sockPrimaryColor": 11651917,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13956188
      ],
      "shortsColor": 13956188,
      "sockPrimaryColor": 13956188,
      "sockSecondaryColor": 0
    }
  },
  "1. FC Union Berlin": {
    "field": {
      "shirtColors": [
        1248467
      ],
      "shortsColor": 985769,
      "sockPrimaryColor": 1248467,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1511165
      ],
      "shortsColor": 1511165,
      "sockPrimaryColor": 1511165,
      "sockSecondaryColor": 0
    }
  },
  "1. FSV Mainz 05": {
    "field": {
      "shirtColors": [
        9914110
      ],
      "shortsColor": 7944395,
      "sockPrimaryColor": 9914110,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11883775
      ],
      "shortsColor": 11883775,
      "sockPrimaryColor": 11883775,
      "sockSecondaryColor": 0
    }
  },
  "Bayer 04 Leverkusen": {
    "field": {
      "shirtColors": [
        13019883
      ],
      "shortsColor": 10389692,
      "sockPrimaryColor": 13019883,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15650047
      ],
      "shortsColor": 15650047,
      "sockPrimaryColor": 15650047,
      "sockSecondaryColor": 0
    }
  },
  "Borussia Dortmund": {
    "field": {
      "shirtColors": [
        12006723
      ],
      "shortsColor": 9579062,
      "sockPrimaryColor": 12006723,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14434384
      ],
      "shortsColor": 14434384,
      "sockPrimaryColor": 14434384,
      "sockSecondaryColor": 0
    }
  },
  "Borussia Mönchengladbach": {
    "field": {
      "shirtColors": [
        6365447
      ],
      "shortsColor": 5118470,
      "sockPrimaryColor": 6365447,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7612424
      ],
      "shortsColor": 7612424,
      "sockPrimaryColor": 7612424,
      "sockSecondaryColor": 0
    }
  },
  "Eintracht Frankfurt": {
    "field": {
      "shirtColors": [
        4089081
      ],
      "shortsColor": 3297479,
      "sockPrimaryColor": 4089081,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4880639
      ],
      "shortsColor": 4880639,
      "sockPrimaryColor": 4880639,
      "sockSecondaryColor": 0
    }
  },
  "FC Augsburg": {
    "field": {
      "shirtColors": [
        16440843
      ],
      "shortsColor": 13152777,
      "sockPrimaryColor": 16440843,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16776973
      ],
      "shortsColor": 16776973,
      "sockPrimaryColor": 16776973,
      "sockSecondaryColor": 0
    }
  },
  "FC Bayern München": {
    "field": {
      "shirtColors": [
        13998615
      ],
      "shortsColor": 11172626,
      "sockPrimaryColor": 13998615,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16759068
      ],
      "shortsColor": 16759068,
      "sockPrimaryColor": 16759068,
      "sockSecondaryColor": 0
    }
  },
  "RB Leipzig": {
    "field": {
      "shirtColors": [
        16771240
      ],
      "shortsColor": 13417094,
      "sockPrimaryColor": 16771240,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16777162
      ],
      "shortsColor": 16777162,
      "sockPrimaryColor": 16777162,
      "sockSecondaryColor": 0
    }
  },
  "SC Freiburg": {
    "field": {
      "shirtColors": [
        5538856
      ],
      "shortsColor": 4418080,
      "sockPrimaryColor": 5538856,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        6659632
      ],
      "shortsColor": 6659632,
      "sockPrimaryColor": 6659632,
      "sockSecondaryColor": 0
    }
  },
  "SV Darmstadt 98": {
    "field": {
      "shirtColors": [
        7063748
      ],
      "shortsColor": 5677213,
      "sockPrimaryColor": 7063748,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8450283
      ],
      "shortsColor": 8450283,
      "sockPrimaryColor": 8450283,
      "sockSecondaryColor": 0
    }
  },
  "SV Werder Bremen": {
    "field": {
      "shirtColors": [
        139767
      ],
      "shortsColor": 137926,
      "sockPrimaryColor": 139767,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        141567
      ],
      "shortsColor": 141567,
      "sockPrimaryColor": 141567,
      "sockSecondaryColor": 0
    }
  },
  "TSG 1899 Hoffenheim": {
    "field": {
      "shirtColors": [
        12619186
      ],
      "shortsColor": 10121614,
      "sockPrimaryColor": 12619186,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15116758
      ],
      "shortsColor": 15116758,
      "sockPrimaryColor": 15116758,
      "sockSecondaryColor": 0
    }
  },
  "VfB Stuttgart": {
    "field": {
      "shirtColors": [
        15126274
      ],
      "shortsColor": 12101122,
      "sockPrimaryColor": 15126274,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16775170
      ],
      "shortsColor": 16775170,
      "sockPrimaryColor": 16775170,
      "sockSecondaryColor": 0
    }
  },
  "VfL Bochum 1848": {
    "field": {
      "shirtColors": [
        84733
      ],
      "shortsColor": 80842,
      "sockPrimaryColor": 84733,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        88575
      ],
      "shortsColor": 88575,
      "sockPrimaryColor": 88575,
      "sockSecondaryColor": 0
    }
  },
  "VfL Wolfsburg": {
    "field": {
      "shirtColors": [
        7710181
      ],
      "shortsColor": 6194359,
      "sockPrimaryColor": 7710181,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9225983
      ],
      "shortsColor": 9225983,
      "sockPrimaryColor": 9225983,
      "sockSecondaryColor": 0
    }
  },
  "AFC Bournemouth": {
    "field": {
      "shirtColors": [
        11566596
      ],
      "shortsColor": 9266435,
      "sockPrimaryColor": 11566596,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13866757
      ],
      "shortsColor": 13866757,
      "sockPrimaryColor": 13866757,
      "sockSecondaryColor": 0
    }
  },
  "Arsenal FC": {
    "field": {
      "shirtColors": [
        5850439
      ],
      "shortsColor": 4667193,
      "sockPrimaryColor": 5850439,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7033685
      ],
      "shortsColor": 7033685,
      "sockPrimaryColor": 7033685,
      "sockSecondaryColor": 0
    }
  },
  "Aston Villa FC": {
    "field": {
      "shirtColors": [
        7229550
      ],
      "shortsColor": 5783640,
      "sockPrimaryColor": 7229550,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8675460
      ],
      "shortsColor": 8675460,
      "sockPrimaryColor": 8675460,
      "sockSecondaryColor": 0
    }
  },
  "Brentford FC": {
    "field": {
      "shirtColors": [
        11000679
      ],
      "shortsColor": 8826706,
      "sockPrimaryColor": 11000679,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13172604
      ],
      "shortsColor": 13172604,
      "sockPrimaryColor": 13172604,
      "sockSecondaryColor": 0
    }
  },
  "Brighton & Hove Albion FC": {
    "field": {
      "shirtColors": [
        1872003
      ],
      "shortsColor": 1471337,
      "sockPrimaryColor": 1872003,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2272669
      ],
      "shortsColor": 2272669,
      "sockPrimaryColor": 2272669,
      "sockSecondaryColor": 0
    }
  },
  "Burnley FC": {
    "field": {
      "shirtColors": [
        8094060
      ],
      "shortsColor": 6448982,
      "sockPrimaryColor": 8094060,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9739138
      ],
      "shortsColor": 9739138,
      "sockPrimaryColor": 9739138,
      "sockSecondaryColor": 0
    }
  },
  "Chelsea FC": {
    "field": {
      "shirtColors": [
        16160026
      ],
      "shortsColor": 12941077,
      "sockPrimaryColor": 16160026,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16757535
      ],
      "shortsColor": 16757535,
      "sockPrimaryColor": 16757535,
      "sockSecondaryColor": 0
    }
  },
  "Crystal Palace FC": {
    "field": {
      "shirtColors": [
        1450283
      ],
      "shortsColor": 1186338,
      "sockPrimaryColor": 1450283,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1714228
      ],
      "shortsColor": 1714228,
      "sockPrimaryColor": 1714228,
      "sockSecondaryColor": 0
    }
  },
  "Everton FC": {
    "field": {
      "shirtColors": [
        16030056
      ],
      "shortsColor": 12810835,
      "sockPrimaryColor": 16030056,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16758909
      ],
      "shortsColor": 16758909,
      "sockPrimaryColor": 16758909,
      "sockSecondaryColor": 0
    }
  },
  "Fulham FC": {
    "field": {
      "shirtColors": [
        12702054
      ],
      "shortsColor": 10135378,
      "sockPrimaryColor": 12702054,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15268730
      ],
      "shortsColor": 15268730,
      "sockPrimaryColor": 15268730,
      "sockSecondaryColor": 0
    }
  },
  "Liverpool FC": {
    "field": {
      "shirtColors": [
        1832859
      ],
      "shortsColor": 1492604,
      "sockPrimaryColor": 1832859,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2162618
      ],
      "shortsColor": 2162618,
      "sockPrimaryColor": 2162618,
      "sockSecondaryColor": 0
    }
  },
  "Luton Town FC": {
    "field": {
      "shirtColors": [
        13740501
      ],
      "shortsColor": 10979242,
      "sockPrimaryColor": 13740501,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16501759
      ],
      "shortsColor": 16501759,
      "sockPrimaryColor": 16501759,
      "sockSecondaryColor": 0
    }
  },
  "Manchester City FC": {
    "field": {
      "shirtColors": [
        10518598
      ],
      "shortsColor": 8414776,
      "sockPrimaryColor": 10518598,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12622420
      ],
      "shortsColor": 12622420,
      "sockPrimaryColor": 12622420,
      "sockSecondaryColor": 0
    }
  },
  "Manchester United FC": {
    "field": {
      "shirtColors": [
        2354318
      ],
      "shortsColor": 1883506,
      "sockPrimaryColor": 2354318,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2817962
      ],
      "shortsColor": 2817962,
      "sockPrimaryColor": 2817962,
      "sockSecondaryColor": 0
    }
  },
  "Newcastle United FC": {
    "field": {
      "shirtColors": [
        15534354
      ],
      "shortsColor": 12453646,
      "sockPrimaryColor": 15534354,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16714518
      ],
      "shortsColor": 16714518,
      "sockPrimaryColor": 16714518,
      "sockSecondaryColor": 0
    }
  },
  "Nottingham Forest FC": {
    "field": {
      "shirtColors": [
        7703155
      ],
      "shortsColor": 6188636,
      "sockPrimaryColor": 7703155,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9217674
      ],
      "shortsColor": 9217674,
      "sockPrimaryColor": 9217674,
      "sockSecondaryColor": 0
    }
  },
  "Sheffield United FC": {
    "field": {
      "shirtColors": [
        13087870
      ],
      "shortsColor": 10457189,
      "sockPrimaryColor": 13087870,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15718551
      ],
      "shortsColor": 15718551,
      "sockPrimaryColor": 15718551,
      "sockSecondaryColor": 0
    }
  },
  "Tottenham Hotspur FC": {
    "field": {
      "shirtColors": [
        6805094
      ],
      "shortsColor": 5417810,
      "sockPrimaryColor": 6805094,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8191866
      ],
      "shortsColor": 8191866,
      "sockPrimaryColor": 8191866,
      "sockSecondaryColor": 0
    }
  },
  "West Ham United FC": {
    "field": {
      "shirtColors": [
        9700733
      ],
      "shortsColor": 7734372,
      "sockPrimaryColor": 9700733,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11667094
      ],
      "shortsColor": 11667094,
      "sockPrimaryColor": 11667094,
      "sockSecondaryColor": 0
    }
  },
  "Wolverhampton Wanderers FC": {
    "field": {
      "shirtColors": [
        5884412
      ],
      "shortsColor": 4694474,
      "sockPrimaryColor": 5884412,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7074303
      ],
      "shortsColor": 7074303,
      "sockPrimaryColor": 7074303,
      "sockSecondaryColor": 0
    }
  },
  "Qatar": {
    "field": {
      "shirtColors": [
        10700661
      ],
      "shortsColor": 8534366,
      "sockPrimaryColor": 10700661,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12866956
      ],
      "shortsColor": 12866956,
      "sockPrimaryColor": 12866956,
      "sockSecondaryColor": 0
    }
  },
  "Ecuador": {
    "field": {
      "shirtColors": [
        10230077
      ],
      "shortsColor": 8197169,
      "sockPrimaryColor": 10230077,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12262985
      ],
      "shortsColor": 12262985,
      "sockPrimaryColor": 12262985,
      "sockSecondaryColor": 0
    }
  },
  "Senegal": {
    "field": {
      "shirtColors": [
        3948169
      ],
      "shortsColor": 3158638,
      "sockPrimaryColor": 3948169,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4737700
      ],
      "shortsColor": 4737700,
      "sockPrimaryColor": 4737700,
      "sockSecondaryColor": 0
    }
  },
  "Netherlands": {
    "field": {
      "shirtColors": [
        10625648
      ],
      "shortsColor": 8526682,
      "sockPrimaryColor": 10625648,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12724614
      ],
      "shortsColor": 12724614,
      "sockPrimaryColor": 12724614,
      "sockSecondaryColor": 0
    }
  },
  "England": {
    "field": {
      "shirtColors": [
        10556329
      ],
      "shortsColor": 8458119,
      "sockPrimaryColor": 10556329,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12654539
      ],
      "shortsColor": 12654539,
      "sockPrimaryColor": 12654539,
      "sockSecondaryColor": 0
    }
  },
  "Iran": {
    "field": {
      "shirtColors": [
        2287414
      ],
      "shortsColor": 1816875,
      "sockPrimaryColor": 2287414,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2752321
      ],
      "shortsColor": 2752321,
      "sockPrimaryColor": 2752321,
      "sockSecondaryColor": 0
    }
  },
  "United States": {
    "field": {
      "shirtColors": [
        14303135
      ],
      "shortsColor": 11416191,
      "sockPrimaryColor": 14303135,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16731327
      ],
      "shortsColor": 16731327,
      "sockPrimaryColor": 16731327,
      "sockSecondaryColor": 0
    }
  },
  "Wales": {
    "field": {
      "shirtColors": [
        16234224
      ],
      "shortsColor": 13013696,
      "sockPrimaryColor": 16234224,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16767743
      ],
      "shortsColor": 16767743,
      "sockPrimaryColor": 16767743,
      "sockSecondaryColor": 0
    }
  },
  "Argentina": {
    "field": {
      "shirtColors": [
        15066311
      ],
      "shortsColor": 12039839,
      "sockPrimaryColor": 15066311,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16777199
      ],
      "shortsColor": 16777199,
      "sockPrimaryColor": 16777199,
      "sockSecondaryColor": 0
    }
  },
  "Saudi Arabia": {
    "field": {
      "shirtColors": [
        935134
      ],
      "shortsColor": 734898,
      "sockPrimaryColor": 935134,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1135359
      ],
      "shortsColor": 1135359,
      "sockPrimaryColor": 1135359,
      "sockSecondaryColor": 0
    }
  },
  "Mexico": {
    "field": {
      "shirtColors": [
        2920661
      ],
      "shortsColor": 2323370,
      "sockPrimaryColor": 2920661,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3517951
      ],
      "shortsColor": 3517951,
      "sockPrimaryColor": 3517951,
      "sockSecondaryColor": 0
    }
  },
  "Poland": {
    "field": {
      "shirtColors": [
        13792394
      ],
      "shortsColor": 11033966,
      "sockPrimaryColor": 13792394,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16550822
      ],
      "shortsColor": 16550822,
      "sockPrimaryColor": 16550822,
      "sockSecondaryColor": 0
    }
  },
  "France": {
    "field": {
      "shirtColors": [
        15168571
      ],
      "shortsColor": 12148015,
      "sockPrimaryColor": 15168571,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16747335
      ],
      "shortsColor": 16747335,
      "sockPrimaryColor": 16747335,
      "sockSecondaryColor": 0
    }
  },
  "Australia": {
    "field": {
      "shirtColors": [
        1878368
      ],
      "shortsColor": 1476429,
      "sockPrimaryColor": 1878368,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2280307
      ],
      "shortsColor": 2280307,
      "sockPrimaryColor": 2280307,
      "sockSecondaryColor": 0
    }
  },
  "Denmark": {
    "field": {
      "shirtColors": [
        12735546
      ],
      "shortsColor": 10175278,
      "sockPrimaryColor": 12735546,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15295814
      ],
      "shortsColor": 15295814,
      "sockPrimaryColor": 15295814,
      "sockSecondaryColor": 0
    }
  },
  "Tunisia": {
    "field": {
      "shirtColors": [
        7471919
      ],
      "shortsColor": 5964326,
      "sockPrimaryColor": 7471919,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8979512
      ],
      "shortsColor": 8979512,
      "sockPrimaryColor": 8979512,
      "sockSecondaryColor": 0
    }
  },
  "Spain": {
    "field": {
      "shirtColors": [
        12976553
      ],
      "shortsColor": 10355079,
      "sockPrimaryColor": 12976553,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15598027
      ],
      "shortsColor": 15598027,
      "sockPrimaryColor": 15598027,
      "sockSecondaryColor": 0
    }
  },
  "Costa Rica": {
    "field": {
      "shirtColors": [
        13541249
      ],
      "shortsColor": 10846055,
      "sockPrimaryColor": 13541249,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16236443
      ],
      "shortsColor": 16236443,
      "sockPrimaryColor": 16236443,
      "sockSecondaryColor": 0
    }
  },
  "Germany": {
    "field": {
      "shirtColors": [
        11363219
      ],
      "shortsColor": 9064310,
      "sockPrimaryColor": 11363219,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13662128
      ],
      "shortsColor": 13662128,
      "sockPrimaryColor": 13662128,
      "sockSecondaryColor": 0
    }
  },
  "Japan": {
    "field": {
      "shirtColors": [
        4232166
      ],
      "shortsColor": 3372728,
      "sockPrimaryColor": 4232166,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5091583
      ],
      "shortsColor": 5091583,
      "sockPrimaryColor": 5091583,
      "sockSecondaryColor": 0
    }
  },
  "Belgium": {
    "field": {
      "shirtColors": [
        14095075
      ],
      "shortsColor": 11275958,
      "sockPrimaryColor": 14095075,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16717567
      ],
      "shortsColor": 16717567,
      "sockPrimaryColor": 16717567,
      "sockSecondaryColor": 0
    }
  },
  "Canada": {
    "field": {
      "shirtColors": [
        14619374
      ],
      "shortsColor": 11669182,
      "sockPrimaryColor": 14619374,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16717567
      ],
      "shortsColor": 16717567,
      "sockPrimaryColor": 16717567,
      "sockSecondaryColor": 0
    }
  },
  "Morocco": {
    "field": {
      "shirtColors": [
        2370608
      ],
      "shortsColor": 1909542,
      "sockPrimaryColor": 2370608,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2831674
      ],
      "shortsColor": 2831674,
      "sockPrimaryColor": 2831674,
      "sockSecondaryColor": 0
    }
  },
  "Croatia": {
    "field": {
      "shirtColors": [
        1311307
      ],
      "shortsColor": 1049148,
      "sockPrimaryColor": 1311307,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1573466
      ],
      "shortsColor": 1573466,
      "sockPrimaryColor": 1573466,
      "sockSecondaryColor": 0
    }
  },
  "Brazil": {
    "field": {
      "shirtColors": [
        1326988
      ],
      "shortsColor": 1061488,
      "sockPrimaryColor": 1326988,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1592488
      ],
      "shortsColor": 1592488,
      "sockPrimaryColor": 1592488,
      "sockSecondaryColor": 0
    }
  },
  "Serbia": {
    "field": {
      "shirtColors": [
        6738106
      ],
      "shortsColor": 5416597,
      "sockPrimaryColor": 6738106,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8059615
      ],
      "shortsColor": 8059615,
      "sockPrimaryColor": 8059615,
      "sockSecondaryColor": 0
    }
  },
  "Switzerland": {
    "field": {
      "shirtColors": [
        15606659
      ],
      "shortsColor": 12459113,
      "sockPrimaryColor": 15606659,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16722589
      ],
      "shortsColor": 16722589,
      "sockPrimaryColor": 16722589,
      "sockSecondaryColor": 0
    }
  },
  "Cameroon": {
    "field": {
      "shirtColors": [
        15742066
      ],
      "shortsColor": 12593755,
      "sockPrimaryColor": 15742066,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16727689
      ],
      "shortsColor": 16727689,
      "sockPrimaryColor": 16727689,
      "sockSecondaryColor": 0
    }
  },
  "Portugal": {
    "field": {
      "shirtColors": [
        5476958
      ],
      "shortsColor": 4355403,
      "sockPrimaryColor": 5476958,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        6598513
      ],
      "shortsColor": 6598513,
      "sockPrimaryColor": 6598513,
      "sockSecondaryColor": 0
    }
  },
  "Ghana": {
    "field": {
      "shirtColors": [
        1656115
      ],
      "shortsColor": 1324841,
      "sockPrimaryColor": 1656115,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1987389
      ],
      "shortsColor": 1987389,
      "sockPrimaryColor": 1987389,
      "sockSecondaryColor": 0
    }
  },
  "Uruguay": {
    "field": {
      "shirtColors": [
        10188542
      ],
      "shortsColor": 8150731,
      "sockPrimaryColor": 10188542,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12226303
      ],
      "shortsColor": 12226303,
      "sockPrimaryColor": 12226303,
      "sockSecondaryColor": 0
    }
  },
  "South Korea": {
    "field": {
      "shirtColors": [
        12929111
      ],
      "shortsColor": 10369606,
      "sockPrimaryColor": 12929111,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15488616
      ],
      "shortsColor": 15488616,
      "sockPrimaryColor": 15488616,
      "sockSecondaryColor": 0
    }
  },
  "Athletic Club": {
    "field": {
      "shirtColors": [
        15804886
      ],
      "shortsColor": 12657067,
      "sockPrimaryColor": 15804886,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16724479
      ],
      "shortsColor": 16724479,
      "sockPrimaryColor": 16724479,
      "sockSecondaryColor": 0
    }
  },
  "CA Osasuna": {
    "field": {
      "shirtColors": [
        9761328
      ],
      "shortsColor": 7782950,
      "sockPrimaryColor": 9761328,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11730746
      ],
      "shortsColor": 11730746,
      "sockPrimaryColor": 11730746,
      "sockSecondaryColor": 0
    }
  },
  "Club Atlético de Madrid": {
    "field": {
      "shirtColors": [
        5962679
      ],
      "shortsColor": 4770194,
      "sockPrimaryColor": 5962679,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7143388
      ],
      "shortsColor": 7143388,
      "sockPrimaryColor": 7143388,
      "sockSecondaryColor": 0
    }
  },
  "Cádiz CF": {
    "field": {
      "shirtColors": [
        15534668
      ],
      "shortsColor": 12453949,
      "sockPrimaryColor": 15534668,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16714843
      ],
      "shortsColor": 16714843,
      "sockPrimaryColor": 16714843,
      "sockSecondaryColor": 0
    }
  },
  "Deportivo Alavés": {
    "field": {
      "shirtColors": [
        249226
      ],
      "shortsColor": 173166,
      "sockPrimaryColor": 249226,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        325286
      ],
      "shortsColor": 325286,
      "sockPrimaryColor": 325286,
      "sockSecondaryColor": 0
    }
  },
  "FC Barcelona": {
    "field": {
      "shirtColors": [
        13301736
      ],
      "shortsColor": 10667706,
      "sockPrimaryColor": 13301736,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15925247
      ],
      "shortsColor": 15925247,
      "sockPrimaryColor": 15925247,
      "sockSecondaryColor": 0
    }
  },
  "Getafe CF": {
    "field": {
      "shirtColors": [
        7746137
      ],
      "shortsColor": 6170695,
      "sockPrimaryColor": 7746137,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9321579
      ],
      "shortsColor": 9321579,
      "sockPrimaryColor": 9321579,
      "sockSecondaryColor": 0
    }
  },
  "Girona FC": {
    "field": {
      "shirtColors": [
        8467179
      ],
      "shortsColor": 6760636,
      "sockPrimaryColor": 8467179,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        10173695
      ],
      "shortsColor": 10173695,
      "sockPrimaryColor": 10173695,
      "sockSecondaryColor": 0
    }
  },
  "Granada CF": {
    "field": {
      "shirtColors": [
        4923293
      ],
      "shortsColor": 3938686,
      "sockPrimaryColor": 4923293,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5907900
      ],
      "shortsColor": 5907900,
      "sockPrimaryColor": 5907900,
      "sockSecondaryColor": 0
    }
  },
  "RC Celta de Vigo": {
    "field": {
      "shirtColors": [
        4888706
      ],
      "shortsColor": 3897960,
      "sockPrimaryColor": 4888706,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5879452
      ],
      "shortsColor": 5879452,
      "sockPrimaryColor": 5879452,
      "sockSecondaryColor": 0
    }
  },
  "RCD Mallorca": {
    "field": {
      "shirtColors": [
        3808002
      ],
      "shortsColor": 3020290,
      "sockPrimaryColor": 3808002,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4595714
      ],
      "shortsColor": 4595714,
      "sockPrimaryColor": 4595714,
      "sockSecondaryColor": 0
    }
  },
  "Rayo Vallecano de Madrid": {
    "field": {
      "shirtColors": [
        11589082
      ],
      "shortsColor": 9284270,
      "sockPrimaryColor": 11589082,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13893631
      ],
      "shortsColor": 13893631,
      "sockPrimaryColor": 13893631,
      "sockSecondaryColor": 0
    }
  },
  "Real Betis Balompié": {
    "field": {
      "shirtColors": [
        1170284
      ],
      "shortsColor": 962390,
      "sockPrimaryColor": 1170284,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1376130
      ],
      "shortsColor": 1376130,
      "sockPrimaryColor": 1376130,
      "sockSecondaryColor": 0
    }
  },
  "Real Madrid CF": {
    "field": {
      "shirtColors": [
        652708
      ],
      "shortsColor": 509059,
      "sockPrimaryColor": 652708,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        786373
      ],
      "shortsColor": 786373,
      "sockPrimaryColor": 786373,
      "sockSecondaryColor": 0
    }
  },
  "Real Sociedad de Fútbol": {
    "field": {
      "shirtColors": [
        13693220
      ],
      "shortsColor": 10928413,
      "sockPrimaryColor": 13693220,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16449323
      ],
      "shortsColor": 16449323,
      "sockPrimaryColor": 16449323,
      "sockSecondaryColor": 0
    }
  },
  "Sevilla FC": {
    "field": {
      "shirtColors": [
        7494465
      ],
      "shortsColor": 5982516,
      "sockPrimaryColor": 7494465,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9006414
      ],
      "shortsColor": 9006414,
      "sockPrimaryColor": 9006414,
      "sockSecondaryColor": 0
    }
  },
  "UD Almería": {
    "field": {
      "shirtColors": [
        10865266
      ],
      "shortsColor": 8692315,
      "sockPrimaryColor": 10865266,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13038217
      ],
      "shortsColor": 13038217,
      "sockPrimaryColor": 13038217,
      "sockSecondaryColor": 0
    }
  },
  "UD Las Palmas": {
    "field": {
      "shirtColors": [
        16710167
      ],
      "shortsColor": 13355026,
      "sockPrimaryColor": 16710167,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16776988
      ],
      "shortsColor": 16776988,
      "sockPrimaryColor": 16776988,
      "sockSecondaryColor": 0
    }
  },
  "Valencia CF": {
    "field": {
      "shirtColors": [
        3074514
      ],
      "shortsColor": 2472616,
      "sockPrimaryColor": 3074514,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3670012
      ],
      "shortsColor": 3670012,
      "sockPrimaryColor": 3670012,
      "sockSecondaryColor": 0
    }
  },
  "Villarreal CF": {
    "field": {
      "shirtColors": [
        16026273
      ],
      "shortsColor": 12807809,
      "sockPrimaryColor": 16026273,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16754369
      ],
      "shortsColor": 16754369,
      "sockPrimaryColor": 16754369,
      "sockSecondaryColor": 0
    }
  },
  "AS Monaco FC": {
    "field": {
      "shirtColors": [
        12616878
      ],
      "shortsColor": 10119819,
      "sockPrimaryColor": 12616878,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15113937
      ],
      "shortsColor": 15113937,
      "sockPrimaryColor": 15113937,
      "sockSecondaryColor": 0
    }
  },
  "Clermont Foot 63": {
    "field": {
      "shirtColors": [
        13258829
      ],
      "shortsColor": 10633278,
      "sockPrimaryColor": 13258829,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15884380
      ],
      "shortsColor": 15884380,
      "sockPrimaryColor": 15884380,
      "sockSecondaryColor": 0
    }
  },
  "FC Lorient": {
    "field": {
      "shirtColors": [
        6215470
      ],
      "shortsColor": 4959269,
      "sockPrimaryColor": 6215470,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7470903
      ],
      "shortsColor": 7470903,
      "sockPrimaryColor": 7470903,
      "sockSecondaryColor": 0
    }
  },
  "FC Metz": {
    "field": {
      "shirtColors": [
        3170241
      ],
      "shortsColor": 2509978,
      "sockPrimaryColor": 3170241,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3830504
      ],
      "shortsColor": 3830504,
      "sockPrimaryColor": 3830504,
      "sockSecondaryColor": 0
    }
  },
  "FC Nantes": {
    "field": {
      "shirtColors": [
        1124874
      ],
      "shortsColor": 926216,
      "sockPrimaryColor": 1124874,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1323532
      ],
      "shortsColor": 1323532,
      "sockPrimaryColor": 1323532,
      "sockSecondaryColor": 0
    }
  },
  "Le Havre AC": {
    "field": {
      "shirtColors": [
        13524857
      ],
      "shortsColor": 10832993,
      "sockPrimaryColor": 13524857,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16216721
      ],
      "shortsColor": 16216721,
      "sockPrimaryColor": 16216721,
      "sockSecondaryColor": 0
    }
  },
  "Lille OSC": {
    "field": {
      "shirtColors": [
        12042983
      ],
      "shortsColor": 9608121,
      "sockPrimaryColor": 12042983,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14477823
      ],
      "shortsColor": 14477823,
      "sockPrimaryColor": 14477823,
      "sockSecondaryColor": 0
    }
  },
  "Montpellier HSC": {
    "field": {
      "shirtColors": [
        16290929
      ],
      "shortsColor": 13006426,
      "sockPrimaryColor": 16290929,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16757384
      ],
      "shortsColor": 16757384,
      "sockPrimaryColor": 16757384,
      "sockSecondaryColor": 0
    }
  },
  "OGC Nice": {
    "field": {
      "shirtColors": [
        9696530
      ],
      "shortsColor": 7783438,
      "sockPrimaryColor": 9696530,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11599638
      ],
      "shortsColor": 11599638,
      "sockPrimaryColor": 11599638,
      "sockSecondaryColor": 0
    }
  },
  "Olympique Lyonnais": {
    "field": {
      "shirtColors": [
        10515314
      ],
      "shortsColor": 8412251,
      "sockPrimaryColor": 10515314,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12618377
      ],
      "shortsColor": 12618377,
      "sockPrimaryColor": 12618377,
      "sockSecondaryColor": 0
    }
  },
  "Olympique de Marseille": {
    "field": {
      "shirtColors": [
        1699734
      ],
      "shortsColor": 1359736,
      "sockPrimaryColor": 1699734,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2031540
      ],
      "shortsColor": 2031540,
      "sockPrimaryColor": 2031540,
      "sockSecondaryColor": 0
    }
  },
  "Paris Saint-Germain FC": {
    "field": {
      "shirtColors": [
        515953
      ],
      "shortsColor": 438874,
      "sockPrimaryColor": 515953,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        589704
      ],
      "shortsColor": 589704,
      "sockPrimaryColor": 589704,
      "sockSecondaryColor": 0
    }
  },
  "RC Strasbourg Alsace": {
    "field": {
      "shirtColors": [
        1620690
      ],
      "shortsColor": 1283496,
      "sockPrimaryColor": 1620690,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1957884
      ],
      "shortsColor": 1957884,
      "sockPrimaryColor": 1957884,
      "sockSecondaryColor": 0
    }
  },
  "Racing Club de Lens": {
    "field": {
      "shirtColors": [
        5607301
      ],
      "shortsColor": 4485738,
      "sockPrimaryColor": 5607301,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        6728864
      ],
      "shortsColor": 6728864,
      "sockPrimaryColor": 6728864,
      "sockSecondaryColor": 0
    }
  },
  "Stade Brestois 29": {
    "field": {
      "shirtColors": [
        6446437
      ],
      "shortsColor": 5130833,
      "sockPrimaryColor": 6446437,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7762041
      ],
      "shortsColor": 7762041,
      "sockPrimaryColor": 7762041,
      "sockSecondaryColor": 0
    }
  },
  "Stade Rennais FC 1901": {
    "field": {
      "shirtColors": [
        15756549
      ],
      "shortsColor": 12605188,
      "sockPrimaryColor": 15756549,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16745222
      ],
      "shortsColor": 16745222,
      "sockPrimaryColor": 16745222,
      "sockSecondaryColor": 0
    }
  },
  "Stade de Reims": {
    "field": {
      "shirtColors": [
        9261820
      ],
      "shortsColor": 7422666,
      "sockPrimaryColor": 9261820,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11100927
      ],
      "shortsColor": 11100927,
      "sockPrimaryColor": 11100927,
      "sockSecondaryColor": 0
    }
  },
  "Toulouse FC": {
    "field": {
      "shirtColors": [
        2492531
      ],
      "shortsColor": 1967708,
      "sockPrimaryColor": 2492531,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3017354
      ],
      "shortsColor": 3017354,
      "sockPrimaryColor": 3017354,
      "sockSecondaryColor": 0
    }
  },
  "Atlanta United FC": {
    "field": {
      "shirtColors": [
        888365
      ],
      "shortsColor": 684580,
      "sockPrimaryColor": 888365,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1092150
      ],
      "shortsColor": 1092150,
      "sockPrimaryColor": 1092150,
      "sockSecondaryColor": 0
    }
  },
  "Austin FC": {
    "field": {
      "shirtColors": [
        10657027
      ],
      "shortsColor": 8551938,
      "sockPrimaryColor": 10657027,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12762116
      ],
      "shortsColor": 12762116,
      "sockPrimaryColor": 12762116,
      "sockSecondaryColor": 0
    }
  },
  "CF Montréal": {
    "field": {
      "shirtColors": [
        5950279
      ],
      "shortsColor": 4760121,
      "sockPrimaryColor": 5950279,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7140437
      ],
      "shortsColor": 7140437,
      "sockPrimaryColor": 7140437,
      "sockSecondaryColor": 0
    }
  },
  "Charlotte FC": {
    "field": {
      "shirtColors": [
        657809
      ],
      "shortsColor": 526196,
      "sockPrimaryColor": 657809,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        789422
      ],
      "shortsColor": 789422,
      "sockPrimaryColor": 789422,
      "sockSecondaryColor": 0
    }
  },
  "Chicago Fire": {
    "field": {
      "shirtColors": [
        4151404
      ],
      "shortsColor": 3294806,
      "sockPrimaryColor": 4151404,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5008002
      ],
      "shortsColor": 5008002,
      "sockPrimaryColor": 5008002,
      "sockSecondaryColor": 0
    }
  },
  "Colorado Rapids": {
    "field": {
      "shirtColors": [
        3025038
      ],
      "shortsColor": 2433138,
      "sockPrimaryColor": 3025038,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3616938
      ],
      "shortsColor": 3616938,
      "sockPrimaryColor": 3616938,
      "sockSecondaryColor": 0
    }
  },
  "Columbus Crew": {
    "field": {
      "shirtColors": [
        882457
      ],
      "shortsColor": 679700,
      "sockPrimaryColor": 882457,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        1085214
      ],
      "shortsColor": 1085214,
      "sockPrimaryColor": 1085214,
      "sockSecondaryColor": 0
    }
  },
  "D.C. United": {
    "field": {
      "shirtColors": [
        6542734
      ],
      "shortsColor": 5220978,
      "sockPrimaryColor": 6542734,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7864234
      ],
      "shortsColor": 7864234,
      "sockPrimaryColor": 7864234,
      "sockSecondaryColor": 0
    }
  },
  "FC Cincinnati": {
    "field": {
      "shirtColors": [
        7023051
      ],
      "shortsColor": 5644706,
      "sockPrimaryColor": 7023051,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8401396
      ],
      "shortsColor": 8401396,
      "sockPrimaryColor": 8401396,
      "sockSecondaryColor": 0
    }
  },
  "FC Dallas": {
    "field": {
      "shirtColors": [
        16755858
      ],
      "shortsColor": 13404789,
      "sockPrimaryColor": 16755858,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16764591
      ],
      "shortsColor": 16764591,
      "sockPrimaryColor": 16764591,
      "sockSecondaryColor": 0
    }
  },
  "Houston Dynamo": {
    "field": {
      "shirtColors": [
        8363004
      ],
      "shortsColor": 6716618,
      "sockPrimaryColor": 8363004,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        10009343
      ],
      "shortsColor": 10009343,
      "sockPrimaryColor": 10009343,
      "sockSecondaryColor": 0
    }
  },
  "Inter Miami CF": {
    "field": {
      "shirtColors": [
        6692166
      ],
      "shortsColor": 5379896,
      "sockPrimaryColor": 6692166,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8004436
      ],
      "shortsColor": 8004436,
      "sockPrimaryColor": 8004436,
      "sockSecondaryColor": 0
    }
  },
  "Los Angeles FC": {
    "field": {
      "shirtColors": [
        9869598
      ],
      "shortsColor": 7895576,
      "sockPrimaryColor": 9869598,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11843620
      ],
      "shortsColor": 11843620,
      "sockPrimaryColor": 11843620,
      "sockSecondaryColor": 0
    }
  },
  "Los Angeles Galaxy": {
    "field": {
      "shirtColors": [
        14092049
      ],
      "shortsColor": 11273742,
      "sockPrimaryColor": 14092049,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16713748
      ],
      "shortsColor": 16713748,
      "sockPrimaryColor": 16713748,
      "sockSecondaryColor": 0
    }
  },
  "Minnesota United FC": {
    "field": {
      "shirtColors": [
        11457228
      ],
      "shortsColor": 9152675,
      "sockPrimaryColor": 11457228,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13761781
      ],
      "shortsColor": 13761781,
      "sockPrimaryColor": 13761781,
      "sockSecondaryColor": 0
    }
  },
  "Nashville SC": {
    "field": {
      "shirtColors": [
        3652934
      ],
      "shortsColor": 2922296,
      "sockPrimaryColor": 3652934,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4383572
      ],
      "shortsColor": 4383572,
      "sockPrimaryColor": 4383572,
      "sockSecondaryColor": 0
    }
  },
  "New England Revolution": {
    "field": {
      "shirtColors": [
        9896672
      ],
      "shortsColor": 7930547,
      "sockPrimaryColor": 9896672,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11862783
      ],
      "shortsColor": 11862783,
      "sockPrimaryColor": 11862783,
      "sockSecondaryColor": 0
    }
  },
  "New York City FC": {
    "field": {
      "shirtColors": [
        15004385
      ],
      "shortsColor": 11977396,
      "sockPrimaryColor": 15004385,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16777215
      ],
      "shortsColor": 16777215,
      "sockPrimaryColor": 16777215,
      "sockSecondaryColor": 0
    }
  },
  "New York RB": {
    "field": {
      "shirtColors": [
        9007457
      ],
      "shortsColor": 7232078,
      "sockPrimaryColor": 9007457,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        10782836
      ],
      "shortsColor": 10782836,
      "sockPrimaryColor": 10782836,
      "sockSecondaryColor": 0
    }
  },
  "Orlando City": {
    "field": {
      "shirtColors": [
        9486986
      ],
      "shortsColor": 7576430,
      "sockPrimaryColor": 9486986,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11397542
      ],
      "shortsColor": 11397542,
      "sockPrimaryColor": 11397542,
      "sockSecondaryColor": 0
    }
  },
  "Philadelphia Union": {
    "field": {
      "shirtColors": [
        13250852
      ],
      "shortsColor": 10626845,
      "sockPrimaryColor": 13250852,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15874859
      ],
      "shortsColor": 15874859,
      "sockPrimaryColor": 15874859,
      "sockSecondaryColor": 0
    }
  },
  "Portland Timbers": {
    "field": {
      "shirtColors": [
        13277224
      ],
      "shortsColor": 10648096,
      "sockPrimaryColor": 13277224,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15906352
      ],
      "shortsColor": 15906352,
      "sockPrimaryColor": 15906352,
      "sockSecondaryColor": 0
    }
  },
  "Real Salt Lake": {
    "field": {
      "shirtColors": [
        3241783
      ],
      "shortsColor": 2580268,
      "sockPrimaryColor": 3241783,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3903298
      ],
      "shortsColor": 3903298,
      "sockPrimaryColor": 3903298,
      "sockSecondaryColor": 0
    }
  },
  "San Diego FC": {
    "field": {
      "shirtColors": [
        13823733
      ],
      "shortsColor": 11058884,
      "sockPrimaryColor": 13823733,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16580607
      ],
      "shortsColor": 16580607,
      "sockPrimaryColor": 16580607,
      "sockSecondaryColor": 0
    }
  },
  "San Jose Earthquakes": {
    "field": {
      "shirtColors": [
        12282717
      ],
      "shortsColor": 9852490,
      "sockPrimaryColor": 12282717,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14712944
      ],
      "shortsColor": 14712944,
      "sockPrimaryColor": 14712944,
      "sockSecondaryColor": 0
    }
  },
  "Seattle Sounders": {
    "field": {
      "shirtColors": [
        8348303
      ],
      "shortsColor": 6704754,
      "sockPrimaryColor": 8348303,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9991852
      ],
      "shortsColor": 9991852,
      "sockPrimaryColor": 9991852,
      "sockSecondaryColor": 0
    }
  },
  "Sporting Kansas City": {
    "field": {
      "shirtColors": [
        16321932
      ],
      "shortsColor": 13044336,
      "sockPrimaryColor": 16321932,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16715944
      ],
      "shortsColor": 16715944,
      "sockPrimaryColor": 16715944,
      "sockSecondaryColor": 0
    }
  },
  "St. Louis City SC": {
    "field": {
      "shirtColors": [
        13600686
      ],
      "shortsColor": 10906763,
      "sockPrimaryColor": 13600686,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16294609
      ],
      "shortsColor": 16294609,
      "sockPrimaryColor": 16294609,
      "sockSecondaryColor": 0
    }
  },
  "Toronto FC": {
    "field": {
      "shirtColors": [
        2727148
      ],
      "shortsColor": 2194877,
      "sockPrimaryColor": 2727148,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3259391
      ],
      "shortsColor": 3259391,
      "sockPrimaryColor": 3259391,
      "sockSecondaryColor": 0
    }
  },
  "Vancouver Whitecaps": {
    "field": {
      "shirtColors": [
        12915783
      ],
      "shortsColor": 10358841,
      "sockPrimaryColor": 12915783,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15472725
      ],
      "shortsColor": 15472725,
      "sockPrimaryColor": 15472725,
      "sockSecondaryColor": 0
    }
  },
  "Boavista FC": {
    "field": {
      "shirtColors": [
        12696772
      ],
      "shortsColor": 10131101,
      "sockPrimaryColor": 12696772,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15262443
      ],
      "shortsColor": 15262443,
      "sockPrimaryColor": 15262443,
      "sockSecondaryColor": 0
    }
  },
  "CF Estrela da Amadora": {
    "field": {
      "shirtColors": [
        7346011
      ],
      "shortsColor": 5902921,
      "sockPrimaryColor": 7346011,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        8789101
      ],
      "shortsColor": 8789101,
      "sockPrimaryColor": 8789101,
      "sockSecondaryColor": 0
    }
  },
  "Casa Pia AC": {
    "field": {
      "shirtColors": [
        16636206
      ],
      "shortsColor": 13282853,
      "sockPrimaryColor": 16636206,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16777015
      ],
      "shortsColor": 16777015,
      "sockPrimaryColor": 16777015,
      "sockSecondaryColor": 0
    }
  },
  "FC Arouca": {
    "field": {
      "shirtColors": [
        13775192
      ],
      "shortsColor": 11020102,
      "sockPrimaryColor": 13775192,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16530282
      ],
      "shortsColor": 16530282,
      "sockPrimaryColor": 16530282,
      "sockSecondaryColor": 0
    }
  },
  "FC Famalicão": {
    "field": {
      "shirtColors": [
        5571328
      ],
      "shortsColor": 4456960,
      "sockPrimaryColor": 5571328,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        6685696
      ],
      "shortsColor": 6685696,
      "sockPrimaryColor": 6685696,
      "sockSecondaryColor": 0
    }
  },
  "FC Porto": {
    "field": {
      "shirtColors": [
        680651
      ],
      "shortsColor": 544418,
      "sockPrimaryColor": 680651,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        816884
      ],
      "shortsColor": 816884,
      "sockPrimaryColor": 816884,
      "sockSecondaryColor": 0
    }
  },
  "FC Vizela": {
    "field": {
      "shirtColors": [
        3008502
      ],
      "shortsColor": 2406853,
      "sockPrimaryColor": 3008502,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3604479
      ],
      "shortsColor": 3604479,
      "sockPrimaryColor": 3604479,
      "sockSecondaryColor": 0
    }
  },
  "GD Chaves": {
    "field": {
      "shirtColors": [
        13515339
      ],
      "shortsColor": 10825276,
      "sockPrimaryColor": 13515339,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16205402
      ],
      "shortsColor": 16205402,
      "sockPrimaryColor": 16205402,
      "sockSecondaryColor": 0
    }
  },
  "GD Estoril Praia": {
    "field": {
      "shirtColors": [
        3840352
      ],
      "shortsColor": 3045965,
      "sockPrimaryColor": 3840352,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4634739
      ],
      "shortsColor": 4634739,
      "sockPrimaryColor": 4634739,
      "sockSecondaryColor": 0
    }
  },
  "Gil Vicente FC": {
    "field": {
      "shirtColors": [
        11934217
      ],
      "shortsColor": 9573639,
      "sockPrimaryColor": 11934217,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14294795
      ],
      "shortsColor": 14294795,
      "sockPrimaryColor": 14294795,
      "sockSecondaryColor": 0
    }
  },
  "Moreirense FC": {
    "field": {
      "shirtColors": [
        10868004
      ],
      "shortsColor": 8694301,
      "sockPrimaryColor": 10868004,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13041451
      ],
      "shortsColor": 13041451,
      "sockPrimaryColor": 13041451,
      "sockSecondaryColor": 0
    }
  },
  "Portimonense SC": {
    "field": {
      "shirtColors": [
        2148657
      ],
      "shortsColor": 1745191,
      "sockPrimaryColor": 2148657,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2552123
      ],
      "shortsColor": 2552123,
      "sockPrimaryColor": 2552123,
      "sockSecondaryColor": 0
    }
  },
  "Rio Ave FC": {
    "field": {
      "shirtColors": [
        10084437
      ],
      "shortsColor": 8041284,
      "sockPrimaryColor": 10084437,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12124006
      ],
      "shortsColor": 12124006,
      "sockPrimaryColor": 12124006,
      "sockSecondaryColor": 0
    }
  },
  "SC Farense": {
    "field": {
      "shirtColors": [
        13544034
      ],
      "shortsColor": 10848334,
      "sockPrimaryColor": 13544034,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16239734
      ],
      "shortsColor": 16239734,
      "sockPrimaryColor": 16239734,
      "sockSecondaryColor": 0
    }
  },
  "Sport Lisboa e Benfica": {
    "field": {
      "shirtColors": [
        11789243
      ],
      "shortsColor": 9418390,
      "sockPrimaryColor": 11789243,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        14155744
      ],
      "shortsColor": 14155744,
      "sockPrimaryColor": 14155744,
      "sockSecondaryColor": 0
    }
  },
  "Sporting Clube de Braga": {
    "field": {
      "shirtColors": [
        15963951
      ],
      "shortsColor": 12744998,
      "sockPrimaryColor": 15963951,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16758072
      ],
      "shortsColor": 16758072,
      "sockPrimaryColor": 16758072,
      "sockSecondaryColor": 0
    }
  },
  "Sporting Clube de Portugal": {
    "field": {
      "shirtColors": [
        4743994
      ],
      "shortsColor": 3821358,
      "sockPrimaryColor": 4743994,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        5666630
      ],
      "shortsColor": 5666630,
      "sockPrimaryColor": 5666630,
      "sockSecondaryColor": 0
    }
  },
  "Vitória Guimarães": {
    "field": {
      "shirtColors": [
        12821542
      ],
      "shortsColor": 10257182,
      "sockPrimaryColor": 12821542,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15385902
      ],
      "shortsColor": 15385902,
      "sockPrimaryColor": 15385902,
      "sockSecondaryColor": 0
    }
  },
  "AC Milan": {
    "field": {
      "shirtColors": [
        7825631
      ],
      "shortsColor": 6247346,
      "sockPrimaryColor": 7825631,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9403903
      ],
      "shortsColor": 9403903,
      "sockPrimaryColor": 9403903,
      "sockSecondaryColor": 0
    }
  },
  "AC Monza": {
    "field": {
      "shirtColors": [
        8007061
      ],
      "shortsColor": 6431863,
      "sockPrimaryColor": 8007061,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9582259
      ],
      "shortsColor": 9582259,
      "sockPrimaryColor": 9582259,
      "sockSecondaryColor": 0
    }
  },
  "ACF Fiorentina": {
    "field": {
      "shirtColors": [
        11642323
      ],
      "shortsColor": 9340073,
      "sockPrimaryColor": 11642323,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13944573
      ],
      "shortsColor": 13944573,
      "sockPrimaryColor": 13944573,
      "sockSecondaryColor": 0
    }
  },
  "AS Roma": {
    "field": {
      "shirtColors": [
        76767
      ],
      "shortsColor": 74418,
      "sockPrimaryColor": 76767,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        79103
      ],
      "shortsColor": 79103,
      "sockPrimaryColor": 79103,
      "sockSecondaryColor": 0
    }
  },
  "Atalanta BC": {
    "field": {
      "shirtColors": [
        13003081
      ],
      "shortsColor": 10376250,
      "sockPrimaryColor": 13003081,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        15629912
      ],
      "shortsColor": 15629912,
      "sockPrimaryColor": 15629912,
      "sockSecondaryColor": 0
    }
  },
  "Bologna FC 1909": {
    "field": {
      "shirtColors": [
        13790526
      ],
      "shortsColor": 11032370,
      "sockPrimaryColor": 13790526,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16548682
      ],
      "shortsColor": 16548682,
      "sockPrimaryColor": 16548682,
      "sockSecondaryColor": 0
    }
  },
  "Cagliari Calcio": {
    "field": {
      "shirtColors": [
        3880073
      ],
      "shortsColor": 3091054,
      "sockPrimaryColor": 3880073,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        4669092
      ],
      "shortsColor": 4669092,
      "sockPrimaryColor": 4669092,
      "sockSecondaryColor": 0
    }
  },
  "Empoli FC": {
    "field": {
      "shirtColors": [
        9962969
      ],
      "shortsColor": 7996590,
      "sockPrimaryColor": 9962969,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11929343
      ],
      "shortsColor": 11929343,
      "sockPrimaryColor": 11929343,
      "sockSecondaryColor": 0
    }
  },
  "FC Internazionale Milano": {
    "field": {
      "shirtColors": [
        15402194
      ],
      "shortsColor": 12321704,
      "sockPrimaryColor": 15402194,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16713212
      ],
      "shortsColor": 16713212,
      "sockPrimaryColor": 16713212,
      "sockSecondaryColor": 0
    }
  },
  "Frosinone Calcio": {
    "field": {
      "shirtColors": [
        8127498
      ],
      "shortsColor": 6488840,
      "sockPrimaryColor": 8127498,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        9766156
      ],
      "shortsColor": 9766156,
      "sockPrimaryColor": 9766156,
      "sockSecondaryColor": 0
    }
  },
  "Genoa CFC": {
    "field": {
      "shirtColors": [
        9394210
      ],
      "shortsColor": 7489051,
      "sockPrimaryColor": 9394210,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11299369
      ],
      "shortsColor": 11299369,
      "sockPrimaryColor": 11299369,
      "sockSecondaryColor": 0
    }
  },
  "Hellas Verona FC": {
    "field": {
      "shirtColors": [
        11024877
      ],
      "shortsColor": 8793790,
      "sockPrimaryColor": 11024877,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        13255935
      ],
      "shortsColor": 13255935,
      "sockPrimaryColor": 13255935,
      "sockSecondaryColor": 0
    }
  },
  "Juventus FC": {
    "field": {
      "shirtColors": [
        9658591
      ],
      "shortsColor": 7753138,
      "sockPrimaryColor": 9658591,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        11564031
      ],
      "shortsColor": 11564031,
      "sockPrimaryColor": 11564031,
      "sockSecondaryColor": 0
    }
  },
  "SS Lazio": {
    "field": {
      "shirtColors": [
        10403755
      ],
      "shortsColor": 8296841,
      "sockPrimaryColor": 10403755,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        12510669
      ],
      "shortsColor": 12510669,
      "sockPrimaryColor": 12510669,
      "sockSecondaryColor": 0
    }
  },
  "SSC Napoli": {
    "field": {
      "shirtColors": [
        5984492
      ],
      "shortsColor": 4800701,
      "sockPrimaryColor": 5984492,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7168255
      ],
      "shortsColor": 7168255,
      "sockPrimaryColor": 7168255,
      "sockSecondaryColor": 0
    }
  },
  "Torino FC": {
    "field": {
      "shirtColors": [
        732330
      ],
      "shortsColor": 598920,
      "sockPrimaryColor": 732330,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        865740
      ],
      "shortsColor": 865740,
      "sockPrimaryColor": 865740,
      "sockSecondaryColor": 0
    }
  },
  "US Lecce": {
    "field": {
      "shirtColors": [
        6460362
      ],
      "shortsColor": 5142178,
      "sockPrimaryColor": 6460362,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        7778546
      ],
      "shortsColor": 7778546,
      "sockPrimaryColor": 7778546,
      "sockSecondaryColor": 0
    }
  },
  "US Salernitana 1919": {
    "field": {
      "shirtColors": [
        15538604
      ],
      "shortsColor": 12457098,
      "sockPrimaryColor": 15538604,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        16719566
      ],
      "shortsColor": 16719566,
      "sockPrimaryColor": 16719566,
      "sockSecondaryColor": 0
    }
  },
  "US Sassuolo Calcio": {
    "field": {
      "shirtColors": [
        1669806
      ],
      "shortsColor": 1335947,
      "sockPrimaryColor": 1669806,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        2003665
      ],
      "shortsColor": 2003665,
      "sockPrimaryColor": 2003665,
      "sockSecondaryColor": 0
    }
  },
  "Udinese Calcio": {
    "field": {
      "shirtColors": [
        2616376
      ],
      "shortsColor": 2080045,
      "sockPrimaryColor": 2616376,
      "sockSecondaryColor": 16777215
    },
    "goalkeeper": {
      "shirtColors": [
        3145539
      ],
      "shortsColor": 3145539,
      "sockPrimaryColor": 3145539,
      "sockSecondaryColor": 0
    }
  }
};

export const teamKits: Record<string, TeamKit> = { ...baseTeamKits, ...worldCup2022Kits };
