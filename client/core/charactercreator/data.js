const fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
const mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
const fatherNames = ["Benjamin", "Daniel", "Joshua", "Ryry", "Andrew", "Juan", "Alex", "Isaac", "Evan", "Ethan", "Vincent", "Angel", "Diego", "Adrian", "Gabriel", "Michael", "Santiago", "Kevin", "Louis", "Samuel", "Anthony", "Claude", "Niko", "John"];
const motherNames = ["Latina", "Aubrey", "Jasmine", "Gisele", "Amelia", "Isabella", "Zoe", "Ava", "Camila", "Violet", "Sophia", "Evelyn", "Nicole", "Ashley", "Gracie", "Brianna", "Natalie", "Olivia", "Elizabeth", "Charlotte", "Emma", "Misty"];
const featureNames = ["Largeur du nez", "Hauteur bas du nez", "Longueur pointe du nez", "Profondeur milieu de nez", "Hauteur pointe du nez", "Nez casse", "Hauteur des sourcils", "Profondeur des sourcils", "Hauteur des pommettes", "Largeur des pommettes", "Profondeur des joues", "Taille des yeux", "Epaisseur de la levre", "Largeur de la mâchoire", "Forme de la mâchoire", "Hauteur du menton", "Profondeur du menton", "Largeur du menton", "Indentation du menton", "Largeur de cou"];
const appearanceNames = ["Imperfections", "Barbe", "Sourcils", "Rides", "Maquillage", "Rougeur", "Complexion", "Dommages du soleil", "Levres", "Taches de rousseur", "Poils du torse"];
const maxHairColor = 64;
const maxEyeColor = 32;
const maxBlushColor = 27;
const maxLipstickColor = 32;

const appearanceItemNames = [
    // blemishes
    ["Aucun", "Measles", "Pimples", "Spots", "Break Out", "Blackheads", "Build Up", "Pustules", "Zits", "Full Acne", "Acne", "Cheek Rash", "Face Rash", "Picker", "Puberty", "Eyesore", "Chin Rash", "Two Face", "T Zone", "Greasy", "Marked", "Acne Scarring", "Full Acne Scarring", "Cold Sores", "Impetigo"],
    // facial hair
    ["Aucun", "Light Stubble", "Balbo", "Circle Beard", "Goatee", "Chin", "Chin Fuzz", "Pencil Chin Strap", "Scruffy", "Musketeer", "Mustache", "Trimmed Beard", "Stubble", "Thin Circle Beard", "Horseshoe", "Pencil and 'Chops", "Chin Strap Beard", "Balbo and Sideburns", "Mutton Chops", "Scruffy Beard", "Curly", "Curly & Deep Stranger", "Handlebar", "Faustic", "Otto & Patch", "Otto & Full Stranger", "Light Franz", "The Hampstead", "The Ambrose", "Lincoln Curtain"],
    // eyebrows
    ["Aucun", "Balanced", "Fashion", "Cleopatra", "Quizzical", "Femme", "Seductive", "Pinched", "Chola", "Triomphe", "Carefree", "Curvaceous", "Rodent", "Double Tram", "Thin", "Penciled", "Mother Plucker", "Straight and Narrow", "Natural", "Fuzzy", "Unkempt", "Caterpillar", "Regular", "Mediterranean", "Groomed", "Bushels", "Feathered", "Prickly", "Monobrow", "Winged", "Triple Tram", "Arched Tram", "Cutouts", "Fade Away", "Solo Tram"],
    // ageing
    ["Aucun", "Crow's Feet", "First Signs", "Middle Aged", "Worry Lines", "Depression", "Distinguished", "Aged", "Weathered", "Wrinkled", "Sagging", "Tough Life", "Vintage", "Retired", "Junkie", "Geriatric"],
    // makeup
    ["Aucun", "Smoky Black", "Bronze", "Soft Gray", "Retro Glam", "Natural Look", "Cat Eyes", "Chola", "Vamp", "Vinewood Glamour", "Bubblegum", "Aqua Dream", "Pin Up", "Purple Passion", "Smoky Cat Eye", "Smoldering Ruby", "Pop Princess"],
    // blush
    ["Aucun", "Full", "Angled", "Round", "Horizontal", "High", "Sweetheart", "Eighties"],
    // complexion
    ["Aucun", "Rosy Cheeks", "Stubble Rash", "Hot Flush", "Sunburn", "Bruised", "Alchoholic", "Patchy", "Totem", "Blood Vessels", "Damaged", "Pale", "Ghostly"],
    // sun damage
    ["Aucun", "Uneven", "Sandpaper", "Patchy", "Rough", "Leathery", "Textured", "Coarse", "Rugged", "Creased", "Cracked", "Gritty"],
    // lipstick
    ["Aucun", "Color Matte", "Color Gloss", "Lined Matte", "Lined Gloss", "Heavy Lined Matte", "Heavy Lined Gloss", "Lined Nude Matte", "Liner Nude Gloss", "Smudged", "Geisha"],
    // freckles
    ["Aucun", "Cherub", "All Over", "Irregular", "Dot Dash", "Over the Bridge", "Baby Doll", "Pixie", "Sun Kissed", "Beauty Marks", "Line Up", "Modelesque", "Occasional", "Speckled", "Rain Drops", "Double Dip", "One Sided", "Pairs", "Growth"],
    // chest hair
    ["Aucun", "Natural", "The Strip", "The Tree", "Hairy", "Grisly", "Ape", "Groomed Ape", "Bikini", "Lightning Bolt", "Reverse Lightning", "Love Heart", "Chestache", "Happy Face", "Skull", "Snail Trail", "Slug and Nips", "Hairy Arms"]
];

const hairList = [
    // male
    [
        {ID: 0, Name: "Close Shave", Collection: "mpbeach_overlays", Overlay: "FM_Hair_Fuzz"},
        {ID: 1, Name: "Buzzcut", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_001"},
        {ID: 2, Name: "Faux Hawk", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_002"},
        {ID: 3, Name: "Hipster", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_003"},
        {ID: 4, Name: "Side Parting", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_004"},
        {ID: 5, Name: "Shorter Cut", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_005"},
        {ID: 6, Name: "Biker", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_006"},
        {ID: 7, Name: "Ponytail", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_007"},
        {ID: 8, Name: "Cornrows", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_008"},
        {ID: 9, Name: "Slicked", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_009"},
        {ID: 10, Name: "Short Brushed", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_013"},
        {ID: 11, Name: "Spikey", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_002"},
        {ID: 12, Name: "Caesar", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_011"},
        {ID: 13, Name: "Chopped", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_012"},
        {ID: 14, Name: "Dreads", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_014"},
        {ID: 15, Name: "Long Hair", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_015"},
        {ID: 16, Name: "Shaggy Curls", Collection: "multiplayer_overlays", Overlay: "NGBea_M_Hair_000"},
        {ID: 17, Name: "Surfer Dude", Collection: "multiplayer_overlays", Overlay: "NGBea_M_Hair_001"},
        {ID: 18, Name: "Short Side Part", Collection: "multiplayer_overlays", Overlay: "NGBus_M_Hair_000"},
        {ID: 19, Name: "High Slicked Sides", Collection: "multiplayer_overlays", Overlay: "NGBus_M_Hair_001"},
        {ID: 20, Name: "Long Slicked", Collection: "multiplayer_overlays", Overlay: "NGHip_M_Hair_000"},
        {ID: 21, Name: "Hipster Youth", Collection: "multiplayer_overlays", Overlay: "NGHip_M_Hair_001"},
        {ID: 22, Name: "Mullet", Collection: "multiplayer_overlays", Overlay: "NGInd_M_Hair_000"},
        {ID: 24, Name: "Classic Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_M_Hair_000"},
        {ID: 25, Name: "Palm Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_M_Hair_001"},
        {ID: 26, Name: "Lightning Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_M_Hair_002"},
        {ID: 27, Name: "Whipped Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_M_Hair_003"},
        {ID: 28, Name: "Zig Zag Cornrows", Collection: "mplowrider2_overlays", Overlay: "LR_M_Hair_004"},
        {ID: 29, Name: "Snail Cornrows", Collection: "mplowrider2_overlays", Overlay: "LR_M_Hair_005"},
        {ID: 30, Name: "Hightop", Collection: "mplowrider2_overlays", Overlay: "LR_M_Hair_006"},
        {ID: 31, Name: "Loose Swept Back", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_000_M"},
        {ID: 32, Name: "Undercut Swept Back", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_001_M"},
        {ID: 33, Name: "Undercut Swept Side", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_002_M"},
        {ID: 34, Name: "Spiked Mohawk", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_003_M"},
        {ID: 35, Name: "Mod", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_004_M"},
        {ID: 36, Name: "Layered Mod", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_005_M"},
        {ID: 72, Name: "Flattop", Collection: "mpgunrunning_overlays", Overlay: "MP_Gunrunning_Hair_M_000_M"},
        {ID: 73, Name: "Military Buzzcut", Collection: "mpgunrunning_overlays", Overlay: "MP_Gunrunning_Hair_M_001_M"}
    ],
    // female
    [
        {ID: 0, Name: "Close Shave", Collection: "mpbeach_overlays", Overlay: "FM_Hair_Fuzz"},
        {ID: 1, Name: "Short", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_001"},
        {ID: 2, Name: "Layered Bob", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_002"},
        {ID: 3, Name: "Pigtails", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_003"},
        {ID: 4, Name: "Ponytail", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_004"},
        {ID: 5, Name: "Braided Mohawk", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_005"},
        {ID: 6, Name: "Braids", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_006"},
        {ID: 7, Name: "Bob", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_007"},
        {ID: 8, Name: "Faux Hawk", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_008"},
        {ID: 9, Name: "French Twist", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_009"},
        {ID: 10, Name: "Long Bob", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_010"},
        {ID: 11, Name: "Loose Tied", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_011"},
        {ID: 12, Name: "Pixie", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_012"},
        {ID: 13, Name: "Shaved Bangs", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_013"},
        {ID: 14, Name: "Top Knot", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_014"},
        {ID: 15, Name: "Wavy Bob", Collection: "multiplayer_overlays", Overlay: "NG_M_Hair_015"},
        {ID: 16, Name: "Messy Bun", Collection: "multiplayer_overlays", Overlay: "NGBea_F_Hair_000"},
        {ID: 17, Name: "Pin Up Girl", Collection: "multiplayer_overlays", Overlay: "NGBea_F_Hair_001"},
        {ID: 18, Name: "Tight Bun", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_007"},
        {ID: 19, Name: "Twisted Bob", Collection: "multiplayer_overlays", Overlay: "NGBus_F_Hair_000"},
        {ID: 20, Name: "Flapper Bob", Collection: "multiplayer_overlays", Overlay: "NGBus_F_Hair_001"},
        {ID: 21, Name: "Big Bangs", Collection: "multiplayer_overlays", Overlay: "NGBea_F_Hair_001"},
        {ID: 22, Name: "Braided Top Knot", Collection: "multiplayer_overlays", Overlay: "NGHip_F_Hair_000"},
        {ID: 23, Name: "Mullet", Collection: "multiplayer_overlays", Overlay: "NGInd_F_Hair_000"},
        {ID: 25, Name: "Pinched Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_F_Hair_000"},
        {ID: 26, Name: "Leaf Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_F_Hair_001"},
        {ID: 27, Name: "Zig Zag Cornrows", Collection: "mplowrider_overlays", Overlay: "LR_F_Hair_002"},
        {ID: 28, Name: "Pigtail Bangs", Collection: "mplowrider2_overlays", Overlay: "LR_F_Hair_003"},
        {ID: 29, Name: "Wave Braids", Collection: "mplowrider2_overlays", Overlay: "LR_F_Hair_003"},
        {ID: 30, Name: "Coil Braids", Collection: "mplowrider2_overlays", Overlay: "LR_F_Hair_004"},
        {ID: 31, Name: "Rolled Quiff", Collection: "mplowrider2_overlays", Overlay: "LR_F_Hair_006"},
        {ID: 32, Name: "Loose Swept Back", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_000_F"},
        {ID: 33, Name: "Undercut Swept Back", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_001_F"},
        {ID: 34, Name: "Undercut Swept Side", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_002_F"},
        {ID: 35, Name: "Spiked Mohawk", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_003_F"},
        {ID: 36, Name: "Bandana and Braid", Collection: "multiplayer_overlays", Overlay: "NG_F_Hair_003"},
        {ID: 37, Name: "Layered Mod", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_006_F"},
        {ID: 38, Name: "Skinbyrd", Collection: "mpbiker_overlays", Overlay: "MP_Biker_Hair_004_F"},
        {ID: 76, Name: "Neat Bun", Collection: "mpgunrunning_overlays", Overlay: "MP_Gunrunning_Hair_F_000_F"},
        {ID: 77, Name: "Short Bob", Collection: "mpgunrunning_overlays", Overlay: "MP_Gunrunning_Hair_F_001_F"}
    ]
];

const eyeColors = ["Vert", "Vert emeraude", "Bleu clair", "Bleu ocean", "Marron clair", "Marron fonce", "Hazel", "Gris fonce", "Gris clair", "Rose", "Jaune", "Violet", "Blackout", "Nuances de gris", "Tequila Sunrise", "Atomic", "Warp", "ECola", "Space Ranger", "Ying Yang", "Bullseye", "Lizard", "Dragon", "Extra Terrestrial", "Goat", "Smiley", "Possede", "Demon", "Infecte", "Alien", "Mort-vivant", "Zombie"];

export {
    fathers,
    mothers,
    fatherNames,
    motherNames,
    featureNames,
    appearanceNames,
    appearanceItemNames,
    hairList,
    eyeColors,
    maxHairColor,
    maxEyeColor,
    maxBlushColor,
    maxLipstickColor
};