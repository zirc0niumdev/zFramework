zFramework.Core.Bank = {};
zFramework.Core.Bank.NPCs = { 
    "LS": {
        pos: { x: 243.75, y: 226.23, z: 105.29, h: 161.31 },
        model: "a_m_m_business_01",
        name: "Patrick"
    }
};

zFramework.Core.Bank.GenerateUID = playerUUID => `${playerUUID}-${RandomInt(1000, 9000)}-${RandomInt(1000, 9000)}`;